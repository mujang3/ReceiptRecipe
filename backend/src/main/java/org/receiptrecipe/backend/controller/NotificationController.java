package org.receiptrecipe.backend.controller;

import org.receiptrecipe.backend.entity.IngredientExpiry;
import org.receiptrecipe.backend.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {
    
    @Autowired
    private NotificationService notificationService;
    
    // 유통기한 임박 재료 조회
    @GetMapping("/expiring/{userId}")
    public ResponseEntity<List<IngredientExpiry>> getExpiringIngredients(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "3") int days) {
        try {
            List<IngredientExpiry> expiring = notificationService.getExpiringSoon(userId, days);
            return ResponseEntity.ok(expiring);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // 유통기한 만료 재료 조회
    @GetMapping("/expired/{userId}")
    public ResponseEntity<List<IngredientExpiry>> getExpiredIngredients(@PathVariable Long userId) {
        try {
            List<IngredientExpiry> expired = notificationService.getExpiredIngredients(userId);
            return ResponseEntity.ok(expired);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // 알림 통계 조회
    @GetMapping("/stats/{userId}")
    public ResponseEntity<Map<String, Object>> getNotificationStats(@PathVariable Long userId) {
        try {
            Map<String, Object> stats = notificationService.getNotificationStats(userId);
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // 알림 읽음 처리
    @PostMapping("/mark-read/{ingredientExpiryId}")
    public ResponseEntity<Map<String, Object>> markAsNotified(@PathVariable Long ingredientExpiryId) {
        try {
            notificationService.markAsNotified(ingredientExpiryId);
            Map<String, Object> response = Map.of("message", "알림이 읽음 처리되었습니다.");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = Map.of("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}







