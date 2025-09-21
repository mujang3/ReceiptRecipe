package org.receiptrecipe.backend.controller;

import org.receiptrecipe.backend.entity.Receipt;
import org.receiptrecipe.backend.entity.User;
import org.receiptrecipe.backend.service.ReceiptService;
import org.receiptrecipe.backend.service.GeminiService;
import org.receiptrecipe.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/receipts")
public class ReceiptController {

    @Autowired
    private ReceiptService receiptService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private GeminiService geminiService;

    // 영수증 업로드
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadReceipt(@RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "파일이 비어있습니다."));
            }

            // 현재 로그인한 사용자 정보 가져오기 (인증이 없으면 기본 사용자 사용)
            User currentUser;
            try {
                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
                String username = authentication.getName();
                currentUser = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
            } catch (Exception e) {
                // 인증이 없으면 기본 사용자 사용
                currentUser = userRepository.findByUsername("testuser")
                    .orElseThrow(() -> new RuntimeException("기본 사용자를 찾을 수 없습니다."));
            }

            // 파일 저장 및 영수증 생성
            Receipt receipt = receiptService.uploadReceipt(file, currentUser);

            Map<String, Object> response = new HashMap<>();
            response.put("receiptId", receipt.getId());
            response.put("message", "영수증이 성공적으로 업로드되었습니다!");
            response.put("success", true);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "영수증 업로드 중 오류가 발생했습니다: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    // 모든 영수증 조회 (페이지네이션)
    @GetMapping
    public ResponseEntity<?> getReceipts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String storeName,
            @RequestParam(required = false) String searchTerm) {
        try {
            // 항상 test1 사용자 사용 (개발용)
            User currentUser = userRepository.findByUsername("test1")
                .orElseThrow(() -> new RuntimeException("기본 사용자를 찾을 수 없습니다."));

            Pageable pageable = PageRequest.of(page, size);
            Page<Receipt> receipts = receiptService.getReceiptsByUser(currentUser, pageable, storeName, searchTerm);

            Map<String, Object> response = new HashMap<>();
            response.put("content", receipts.getContent());
            response.put("totalElements", receipts.getTotalElements());
            response.put("totalPages", receipts.getTotalPages());
            response.put("size", receipts.getSize());
            response.put("number", receipts.getNumber());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "영수증 조회 중 오류가 발생했습니다: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    // 특정 영수증 조회
    @GetMapping("/{id}")
    public ResponseEntity<?> getReceipt(@PathVariable Long id) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

            Optional<Receipt> receipt = receiptService.getReceiptById(id, currentUser);
            if (receipt.isPresent()) {
                return ResponseEntity.ok(receipt.get());
            } else {
                return ResponseEntity.notFound().build();
            }

        } catch (Exception e) {
            e.printStackTrace();
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "영수증 조회 중 오류가 발생했습니다: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    // 영수증 수정
    @PutMapping("/{id}")
    public ResponseEntity<?> updateReceipt(@PathVariable Long id, @RequestBody Receipt receiptDetails) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

            Optional<Receipt> updatedReceipt = receiptService.updateReceipt(id, receiptDetails, currentUser);
            if (updatedReceipt.isPresent()) {
                return ResponseEntity.ok(updatedReceipt.get());
            } else {
                return ResponseEntity.notFound().build();
            }

        } catch (Exception e) {
            e.printStackTrace();
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "영수증 수정 중 오류가 발생했습니다: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    // 영수증 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReceipt(@PathVariable Long id) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

            boolean deleted = receiptService.deleteReceipt(id, currentUser);
            if (deleted) {
                return ResponseEntity.ok(Map.of("message", "영수증이 성공적으로 삭제되었습니다."));
            } else {
                return ResponseEntity.notFound().build();
            }

        } catch (Exception e) {
            e.printStackTrace();
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "영수증 삭제 중 오류가 발생했습니다: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    // 매장명 목록 조회
    @GetMapping("/stores")
    public ResponseEntity<?> getStoreNames() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

            List<String> storeNames = receiptService.getStoreNamesByUser(currentUser);
            return ResponseEntity.ok(storeNames);

        } catch (Exception e) {
            e.printStackTrace();
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "매장명 조회 중 오류가 발생했습니다: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    // 유통기한 임박 재료 조회
    @GetMapping("/ingredients/expiring")
    public ResponseEntity<?> getExpiringIngredients(@RequestParam(defaultValue = "7") int days) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

            List<Map<String, Object>> expiringIngredients = receiptService.getExpiringIngredients(currentUser, days);
            return ResponseEntity.ok(expiringIngredients);

        } catch (Exception e) {
            e.printStackTrace();
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "유통기한 임박 재료 조회 중 오류가 발생했습니다: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    // OCR 텍스트를 Gemini로 처리
    @PostMapping("/process/{receiptId}")
    public ResponseEntity<?> processReceiptWithGemini(@PathVariable Long receiptId) {
        try {
            // 현재 로그인한 사용자 정보 가져오기 (인증이 없으면 기본 사용자 사용)
            User currentUser;
            try {
                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
                String username = authentication.getName();
                currentUser = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
            } catch (Exception e) {
                // 인증이 없으면 기본 사용자 사용
                currentUser = userRepository.findByUsername("testuser")
                    .orElseThrow(() -> new RuntimeException("기본 사용자를 찾을 수 없습니다."));
            }

            Optional<Receipt> receiptOptional = receiptService.getReceiptById(receiptId, currentUser);
            if (receiptOptional.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Receipt receipt = receiptOptional.get();
            if (receipt.getRawOcrText() == null || receipt.getRawOcrText().trim().isEmpty()) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("error", "OCR 텍스트가 없습니다.");
                return ResponseEntity.badRequest().body(errorResponse);
            }

            // Gemini로 텍스트 재처리
            Map<String, Object> parsedData = geminiService.processReceiptText(receipt.getRawOcrText());
            
            // 영수증 정보 업데이트
            String storeName = (String) parsedData.getOrDefault("storeName", receipt.getStoreName());
            Double totalAmount = ((Number) parsedData.getOrDefault("totalAmount", receipt.getTotalAmount())).doubleValue();
            
            receipt.setStoreName(storeName);
            receipt.setTotalAmount(totalAmount);
            receipt.setProcessedData(parsedData.toString());
            receipt.setUpdatedAt(LocalDateTime.now());

            Receipt updatedReceipt = receiptService.updateReceipt(receiptId, receipt, currentUser).orElse(receipt);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "영수증이 성공적으로 처리되었습니다!");
            response.put("receipt", updatedReceipt);
            response.put("parsedData", parsedData);
            response.put("rawText", receipt.getRawOcrText());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "영수증 처리 중 오류가 발생했습니다: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}
