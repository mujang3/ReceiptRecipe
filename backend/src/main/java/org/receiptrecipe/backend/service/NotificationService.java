package org.receiptrecipe.backend.service;

import org.receiptrecipe.backend.entity.IngredientExpiry;
import org.receiptrecipe.backend.repository.IngredientExpiryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@Service
public class NotificationService {
    
    @Autowired
    private IngredientExpiryRepository ingredientExpiryRepository;
    
    /**
     * 매일 오전 9시에 유통기한 알림 확인
     */
    @Scheduled(cron = "0 0 9 * * *")
    public void checkExpiringIngredients() {
        LocalDate today = LocalDate.now();
        LocalDate threeDaysFromNow = today.plusDays(3);
        
        // 모든 사용자의 유통기한이 임박한 재료들 조회
        List<IngredientExpiry> expiringSoon = ingredientExpiryRepository
            .findExpiringSoon(today, threeDaysFromNow);
        
        // 알림 로직 (실제로는 이메일, 푸시 알림 등 구현)
        for (IngredientExpiry expiry : expiringSoon) {
            if (!expiry.getIsNotified()) {
                sendExpiryNotification(expiry);
                expiry.setIsNotified(true);
                ingredientExpiryRepository.save(expiry);
            }
        }
    }
    
    /**
     * 유통기한 만료된 재료 알림
     */
    @Scheduled(cron = "0 0 10 * * *")
    public void checkExpiredIngredients() {
        LocalDate today = LocalDate.now();
        
        // 유통기한이 만료된 재료들 조회
        List<IngredientExpiry> expired = ingredientExpiryRepository
            .findExpiredIngredients(today);
        
        for (IngredientExpiry expiry : expired) {
            if (!expiry.getIsNotified()) {
                sendExpiredNotification(expiry);
                expiry.setIsNotified(true);
                ingredientExpiryRepository.save(expiry);
            }
        }
    }
    
    public List<IngredientExpiry> getExpiringSoon(Long userId, int days) {
        LocalDate today = LocalDate.now();
        LocalDate futureDate = today.plusDays(days);
        
        return ingredientExpiryRepository.findExpiringSoon(userId, today, futureDate);
    }
    
    public List<IngredientExpiry> getExpiredIngredients(Long userId) {
        LocalDate today = LocalDate.now();
        return ingredientExpiryRepository.findExpiredIngredients(userId, today);
    }
    
    /**
     * 알림 통계 조회
     */
    public Map<String, Object> getNotificationStats(Long userId) {
        List<IngredientExpiry> expiringSoon = getExpiringSoon(userId, 3);
        List<IngredientExpiry> expired = getExpiredIngredients(userId);
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("expiringSoonCount", expiringSoon.size());
        stats.put("expiredCount", expired.size());
        stats.put("totalNotifications", expiringSoon.size() + expired.size());
        
        return stats;
    }
    
    /**
     * 알림 읽음 처리
     */
    public void markAsNotified(Long ingredientExpiryId) {
        IngredientExpiry expiry = ingredientExpiryRepository.findById(ingredientExpiryId)
                .orElseThrow(() -> new RuntimeException("Ingredient expiry not found"));
        expiry.setIsNotified(true);
        ingredientExpiryRepository.save(expiry);
    }
    
    private void sendExpiryNotification(IngredientExpiry expiry) {
        // 실제 알림 구현 (이메일, 푸시 알림, SMS 등)
        System.out.println("알림: " + expiry.getIngredientName() + "의 유통기한이 " + 
                          expiry.getExpiryDate() + "까지 남았습니다.");
    }
    
    private void sendExpiredNotification(IngredientExpiry expiry) {
        // 실제 알림 구현
        System.out.println("알림: " + expiry.getIngredientName() + "의 유통기한이 " + 
                          expiry.getExpiryDate() + "에 만료되었습니다.");
    }
}
