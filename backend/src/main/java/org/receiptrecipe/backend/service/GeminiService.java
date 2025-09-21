package org.receiptrecipe.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class GeminiService {

    @Value("${gemini.api.key:}")
    private String geminiApiKey;

    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;

    public GeminiService() {
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(30))
                .build();
        this.objectMapper = new ObjectMapper();
    }

    public Map<String, Object> processReceiptText(String ocrText) throws IOException {
        if (geminiApiKey == null || geminiApiKey.isEmpty()) {
            // API 키가 없는 경우 기본 파싱
            return parseReceiptTextBasic(ocrText);
        }

        try {
            String prompt = createReceiptParsingPrompt(ocrText);
            String geminiResponse = callGeminiApi(prompt);
            return parseGeminiResponse(geminiResponse);
        } catch (Exception e) {
            System.err.println("Gemini API 호출 실패, 기본 파싱으로 대체: " + e.getMessage());
            return parseReceiptTextBasic(ocrText);
        }
    }

    private String createReceiptParsingPrompt(String ocrText) {
        return String.format("""
            다음은 영수증 OCR 텍스트입니다. 이 텍스트를 분석하여 JSON 형태로 파싱해주세요.
            
            OCR 텍스트:
            %s
            
            다음 정보를 추출해주세요:
            1. 매장명 (storeName)
            2. 구매일 (purchaseDate) - YYYY-MM-DD 형식
            3. 총 금액 (totalAmount) - 숫자만
            4. 상품 목록 (items) - 각 상품의 이름, 수량, 단가, 총가격
            
            응답은 반드시 다음 JSON 형식으로 해주세요:
            {
                "storeName": "매장명",
                "purchaseDate": "2024-01-01",
                "totalAmount": 10000.0,
                "items": [
                    {
                        "name": "상품명",
                        "quantity": 1,
                        "unitPrice": 1000.0,
                        "totalPrice": 1000.0
                    }
                ]
            }
            
            정보를 찾을 수 없는 경우 null 또는 빈 배열로 표시해주세요.
            """, ocrText);
    }

    private String callGeminiApi(String prompt) throws IOException, InterruptedException {
        String apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";
        
        Map<String, Object> requestBody = new HashMap<>();
        Map<String, Object> content = new HashMap<>();
        Map<String, Object> part = new HashMap<>();
        part.put("text", prompt);
        content.put("parts", new Object[]{part});
        requestBody.put("contents", new Object[]{content});

        String jsonBody = objectMapper.writeValueAsString(requestBody);

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(apiUrl + "?key=" + geminiApiKey))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                .timeout(Duration.ofSeconds(60))
                .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200) {
            throw new IOException("Gemini API 호출 실패: " + response.statusCode() + " - " + response.body());
        }

        return response.body();
    }

    private Map<String, Object> parseGeminiResponse(String geminiResponse) throws IOException {
        JsonNode rootNode = objectMapper.readTree(geminiResponse);
        JsonNode candidates = rootNode.get("candidates");
        
        if (candidates != null && candidates.isArray() && candidates.size() > 0) {
            JsonNode content = candidates.get(0).get("content");
            if (content != null) {
                JsonNode parts = content.get("parts");
                if (parts != null && parts.isArray() && parts.size() > 0) {
                    String text = parts.get(0).get("text").asText();
                    
                    // JSON 부분만 추출 (```json ... ``` 형태일 수 있음)
                    if (text.contains("```json")) {
                        int start = text.indexOf("```json") + 7;
                        int end = text.lastIndexOf("```");
                        if (end > start) {
                            text = text.substring(start, end).trim();
                        }
                    } else if (text.contains("```")) {
                        int start = text.indexOf("```") + 3;
                        int end = text.lastIndexOf("```");
                        if (end > start) {
                            text = text.substring(start, end).trim();
                        }
                    }
                    
                    @SuppressWarnings("unchecked")
                    Map<String, Object> result = (Map<String, Object>) objectMapper.readValue(text, Map.class);
                    return result;
                }
            }
        }
        
        throw new IOException("Gemini 응답 파싱 실패");
    }

    private Map<String, Object> parseReceiptTextBasic(String ocrText) {
        Map<String, Object> result = new HashMap<>();
        List<Map<String, Object>> items = new ArrayList<>();
        
        // 기본값 설정
        result.put("storeName", "Unknown Store");
        result.put("purchaseDate", java.time.LocalDate.now().toString());
        result.put("totalAmount", 0.0);
        
        // 간단한 패턴 매칭으로 정보 추출
        String[] lines = ocrText.split("\n");
        boolean foundStoreName = false;
        
        for (String line : lines) {
            line = line.trim();
            if (line.isEmpty()) continue;
            
            // 매장명 추출 (첫 번째로 긴 줄을 매장명으로 추정)
            if (!foundStoreName && line.length() > 3 && line.length() < 50 && 
                !line.matches(".*\\d{4}-\\d{2}-\\d{2}.*") && 
                !line.matches(".*\\d+[,.]?\\d*원.*") &&
                !line.contains("영수증") && !line.contains("매장")) {
                result.put("storeName", line);
                foundStoreName = true;
                continue;
            }
            
            // 총 금액 추출
            if (line.contains("총") || line.contains("합계") || line.contains("total") || 
                line.contains("총액") || line.contains("결제")) {
                String amountStr = line.replaceAll("[^\\d,.]", "");
                if (!amountStr.isEmpty()) {
                    try {
                        double amount = Double.parseDouble(amountStr.replace(",", ""));
                        result.put("totalAmount", amount);
                    } catch (NumberFormatException e) {
                        // 무시
                    }
                }
                continue;
            }
            
            // 상품명과 가격 추출 (간단한 패턴)
            if (line.matches(".*\\d+[,.]?\\d*원.*") && line.length() > 3) {
                // 가격이 포함된 줄에서 상품명과 가격 분리
                String[] parts = line.split("\\s+");
                StringBuilder itemName = new StringBuilder();
                double price = 0.0;
                
                for (String part : parts) {
                    if (part.matches(".*\\d+[,.]?\\d*원.*")) {
                        // 가격 부분
                        String priceStr = part.replaceAll("[^\\d,.]", "");
                        if (!priceStr.isEmpty()) {
                            try {
                                price = Double.parseDouble(priceStr.replace(",", ""));
                            } catch (NumberFormatException e) {
                                // 무시
                            }
                        }
                    } else if (!part.isEmpty()) {
                        // 상품명 부분
                        if (itemName.length() > 0) itemName.append(" ");
                        itemName.append(part);
                    }
                }
                
                // 상품명이 있고 가격이 0이 아닌 경우만 추가
                if (itemName.length() > 0 && price > 0) {
                    Map<String, Object> item = new HashMap<>();
                    item.put("name", itemName.toString());
                    item.put("quantity", 1);
                    item.put("unitPrice", price);
                    item.put("totalPrice", price);
                    items.add(item);
                }
            } else if (line.length() > 2 && line.length() < 50 && 
                      !line.matches(".*\\d{4}-\\d{2}-\\d{2}.*") &&
                      !line.contains("영수증") && !line.contains("매장") &&
                      !line.contains("주소") && !line.contains("전화")) {
                // 가격이 없는 상품명만 있는 경우
                Map<String, Object> item = new HashMap<>();
                item.put("name", line);
                item.put("quantity", 1);
                item.put("unitPrice", 0.0);
                item.put("totalPrice", 0.0);
                items.add(item);
            }
        }
        
        result.put("items", items);
        return result;
    }
}
