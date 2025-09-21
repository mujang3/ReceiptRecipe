package org.receiptrecipe.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.receiptrecipe.backend.entity.Receipt;
import org.receiptrecipe.backend.entity.ReceiptItem;
import org.receiptrecipe.backend.entity.User;
import org.receiptrecipe.backend.repository.ReceiptRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class ReceiptService {

    @Autowired
    private ReceiptRepository receiptRepository;

    @Autowired
    private OcrService ocrService;

    @Autowired
    private GeminiService geminiService;

    private final ObjectMapper objectMapper = new ObjectMapper();

    // 파일 저장 경로
    private static final String UPLOAD_DIR = "uploads/receipts/";

    public Receipt uploadReceipt(MultipartFile file, User user) throws IOException {
        // 업로드 디렉토리 생성
        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // 파일명 생성 (중복 방지)
        String originalFilename = file.getOriginalFilename();
        String fileExtension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        String fileName = System.currentTimeMillis() + "_" + UUID.randomUUID().toString() + fileExtension;

        // 파일 저장
        Path filePath = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), filePath);

        // OCR 텍스트 추출
        String ocrText = "";
        String storeName = "Unknown Store";
        LocalDateTime purchaseDate = LocalDateTime.now();
        Double totalAmount = 0.0;
        List<ReceiptItem> items = new ArrayList<>();
        Map<String, Object> parsedData = new HashMap<>();

        try {
            // OCR로 텍스트 추출
            ocrText = ocrService.extractTextFromImage(filePath.toString());
            
            // OCR 텍스트가 비어있거나 기본 텍스트인 경우, 파일 내용을 직접 읽어서 사용
            if (ocrText == null || ocrText.trim().isEmpty() || 
                ocrText.contains("영수증 이미지가 업로드되었습니다")) {
                try {
                    // 파일 내용을 직접 읽어서 OCR 텍스트로 사용
                    byte[] fileBytes = Files.readAllBytes(filePath);
                    ocrText = new String(fileBytes, "UTF-8");
                    System.out.println("파일 내용을 OCR 텍스트로 사용: " + ocrText.substring(0, Math.min(100, ocrText.length())));
                } catch (Exception e) {
                    System.err.println("파일 읽기 실패, 기본 텍스트 사용: " + e.getMessage());
                    ocrText = "영수증 이미지가 업로드되었습니다.\n매장: Unknown Store\n총액: 0원\n구매일: " + LocalDate.now() + "\n상품: 영수증 이미지 파일";
                }
            }
            
            // Gemini로 텍스트 파싱
            parsedData = geminiService.processReceiptText(ocrText);
            
            // 파싱된 데이터 추출
            storeName = (String) parsedData.getOrDefault("storeName", "Unknown Store");
            totalAmount = ((Number) parsedData.getOrDefault("totalAmount", 0.0)).doubleValue();
            
            // 구매일 파싱
            String dateStr = (String) parsedData.getOrDefault("purchaseDate", LocalDate.now().toString());
            try {
                LocalDate date = LocalDate.parse(dateStr, DateTimeFormatter.ISO_LOCAL_DATE);
                purchaseDate = date.atStartOfDay();
            } catch (Exception e) {
                purchaseDate = LocalDateTime.now();
            }
            
                // 상품 목록 파싱
                Object itemsObj = parsedData.getOrDefault("items", new ArrayList<>());
                List<Map<String, Object>> itemsData = new ArrayList<>();
                
                if (itemsObj instanceof List<?>) {
                    @SuppressWarnings("unchecked")
                    List<Map<String, Object>> tempList = (List<Map<String, Object>>) itemsObj;
                    itemsData = tempList;
                } else if (itemsObj instanceof Object[]) {
                    Object[] itemsArray = (Object[]) itemsObj;
                    for (Object itemObj : itemsArray) {
                        if (itemObj instanceof Map<?, ?>) {
                            @SuppressWarnings("unchecked")
                            Map<String, Object> itemMap = (Map<String, Object>) itemObj;
                            itemsData.add(itemMap);
                        }
                    }
                }
                
                for (Map<String, Object> itemData : itemsData) {
                    ReceiptItem item = new ReceiptItem();
                    item.setItemName((String) itemData.getOrDefault("name", "Unknown Item"));
                    item.setQuantity(((Number) itemData.getOrDefault("quantity", 1)).intValue());
                    item.setUnitPrice(BigDecimal.valueOf(((Number) itemData.getOrDefault("unitPrice", 0.0)).doubleValue()));
                    item.setTotalPrice(BigDecimal.valueOf(((Number) itemData.getOrDefault("totalPrice", 0.0)).doubleValue()));
                    item.setIsIngredient(false); // 기본값
                    items.add(item);
                }
            
        } catch (Exception e) {
            System.err.println("OCR/Gemini 처리 중 오류 발생: " + e.getMessage());
            // 오류 발생 시 기본값 설정
            if (ocrText == null || ocrText.trim().isEmpty()) {
                ocrText = "영수증 이미지가 업로드되었습니다.\n매장: Unknown Store\n총액: 0원\n구매일: " + LocalDate.now() + "\n상품: 영수증 이미지 파일";
            }
        }

        // 영수증 엔티티 생성
        Receipt receipt = new Receipt();
        receipt.setUser(user);
        receipt.setImageUrl(fileName);
        receipt.setStoreName(storeName);
        receipt.setPurchaseDate(purchaseDate);
        receipt.setTotalAmount(totalAmount);
        receipt.setRawOcrText(ocrText);
        receipt.setProcessedData(objectMapper.writeValueAsString(parsedData));
        receipt.setItems(items);
        receipt.setCreatedAt(LocalDateTime.now());
        receipt.setUpdatedAt(LocalDateTime.now());

        // ReceiptItem에 receipt 참조 설정
        for (ReceiptItem item : items) {
            item.setReceipt(receipt);
        }

        // 데이터베이스에 저장
        return receiptRepository.save(receipt);
    }

    public Page<Receipt> getReceiptsByUser(User user, Pageable pageable, String storeName, String searchTerm) {
        if (storeName != null && !storeName.trim().isEmpty()) {
            return receiptRepository.findByUserAndStoreNameContainingIgnoreCase(user, storeName, pageable);
        } else if (searchTerm != null && !searchTerm.trim().isEmpty()) {
            return receiptRepository.findByUserAndStoreNameContainingIgnoreCase(user, searchTerm, pageable);
        } else {
            return receiptRepository.findByUserOrderByCreatedAtDesc(user, pageable);
        }
    }

    public Optional<Receipt> getReceiptById(Long id, User user) {
        return receiptRepository.findByIdAndUser(id, user);
    }

    public Optional<Receipt> updateReceipt(Long id, Receipt receiptDetails, User user) {
        Optional<Receipt> receiptOptional = receiptRepository.findByIdAndUser(id, user);
        if (receiptOptional.isPresent()) {
            Receipt receipt = receiptOptional.get();
            
            if (receiptDetails.getStoreName() != null) {
                receipt.setStoreName(receiptDetails.getStoreName());
            }
            if (receiptDetails.getPurchaseDate() != null) {
                receipt.setPurchaseDate(receiptDetails.getPurchaseDate());
            }
            if (receiptDetails.getTotalAmount() != null) {
                receipt.setTotalAmount(receiptDetails.getTotalAmount());
            }
            if (receiptDetails.getRawOcrText() != null) {
                receipt.setRawOcrText(receiptDetails.getRawOcrText());
            }
            if (receiptDetails.getProcessedData() != null) {
                receipt.setProcessedData(receiptDetails.getProcessedData());
            }
            
            receipt.setUpdatedAt(LocalDateTime.now());
            return Optional.of(receiptRepository.save(receipt));
        }
        return Optional.empty();
    }

    public boolean deleteReceipt(Long id, User user) {
        Optional<Receipt> receiptOptional = receiptRepository.findByIdAndUser(id, user);
        if (receiptOptional.isPresent()) {
            Receipt receipt = receiptOptional.get();
            
            // 파일 삭제
            if (receipt.getImageUrl() != null) {
                try {
                    Path filePath = Paths.get(UPLOAD_DIR + receipt.getImageUrl());
                    Files.deleteIfExists(filePath);
                } catch (IOException e) {
                    // 파일 삭제 실패는 로그만 남기고 계속 진행
                    System.err.println("Failed to delete file: " + receipt.getImageUrl());
                }
            }
            
            receiptRepository.delete(receipt);
            return true;
        }
        return false;
    }

    public List<String> getStoreNamesByUser(User user) {
        return receiptRepository.findDistinctStoreNamesByUser(user);
    }

    public List<Map<String, Object>> getExpiringIngredients(User user, int days) {
        // 임시 구현 - 실제로는 IngredientExpiry 엔티티와 연동해야 함
        List<Map<String, Object>> result = new ArrayList<>();
        
        // 예시 데이터
        Map<String, Object> ingredient1 = new HashMap<>();
        ingredient1.put("name", "우유");
        ingredient1.put("expiryDate", LocalDateTime.now().plusDays(2));
        ingredient1.put("daysLeft", 2);
        result.add(ingredient1);

        Map<String, Object> ingredient2 = new HashMap<>();
        ingredient2.put("name", "계란");
        ingredient2.put("expiryDate", LocalDateTime.now().plusDays(5));
        ingredient2.put("daysLeft", 5);
        result.add(ingredient2);

        return result;
    }
}
