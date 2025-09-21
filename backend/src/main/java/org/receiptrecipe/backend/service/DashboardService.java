package org.receiptrecipe.backend.service;

import org.receiptrecipe.backend.entity.*;
import org.receiptrecipe.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DashboardService {
    
    @Autowired
    private ReceiptRepository receiptRepository;
    
    @Autowired
    private RecipeRepository recipeRepository;
    
    @Autowired
    private RecipeRatingRepository recipeRatingRepository;
    
    @Autowired
    private IngredientExpiryRepository ingredientExpiryRepository;
    
    public Map<String, Object> getDashboardStats(Long userId) {
        Map<String, Object> stats = new HashMap<>();
        
        // 기본 통계는 사용자별 통계로 대체
        
        // 사용자별 통계
        List<Receipt> userReceipts = receiptRepository.findByUserId(userId);
        List<Recipe> userRecipes = recipeRepository.findByUserId(userId);
        
        stats.put("totalReceipts", userReceipts.size());
        stats.put("totalRecipes", userRecipes.size());
        
        // 최근 활동
        LocalDateTime oneWeekAgo = LocalDateTime.now().minusWeeks(1);
        long recentReceipts = userReceipts.stream()
            .filter(receipt -> receipt.getCreatedAt().isAfter(oneWeekAgo))
            .count();
        
        long recentRecipes = userRecipes.stream()
            .filter(recipe -> recipe.getCreatedAt().isAfter(oneWeekAgo))
            .count();
        
        stats.put("recentReceipts", recentReceipts);
        stats.put("recentRecipes", recentRecipes);
        
        // 즐겨찾기 레시피
        List<RecipeRating> favoriteRecipes = recipeRatingRepository.findByIsFavoriteTrueAndUserId(userId);
        stats.put("favoriteRecipes", favoriteRecipes.size());
        
        // 유통기한 임박 재료
        LocalDate threeDaysFromNow = LocalDate.now().plusDays(3);
        List<IngredientExpiry> expiringSoon = ingredientExpiryRepository
            .findExpiringSoon(userId, LocalDate.now(), threeDaysFromNow);
        stats.put("expiringSoon", expiringSoon.size());
        
        // 월별 지출 분석
        Map<String, Double> monthlySpending = calculateMonthlySpending(userReceipts);
        stats.put("monthlySpending", monthlySpending);
        
        return stats;
    }
    
    public Map<String, Object> getExpenseAnalysis(Long userId) {
        Map<String, Object> analysis = new HashMap<>();
        
        List<Receipt> userReceipts = receiptRepository.findByUserId(userId);
        
        // 카테고리별 지출
        Map<String, Double> categorySpending = new HashMap<>();
        Map<String, Integer> storeFrequency = new HashMap<>();
        
        for (Receipt receipt : userReceipts) {
            String storeName = receipt.getStoreName();
            Double amount = receipt.getTotalAmount();
            
            if (amount != null) {
                // 매장별 지출
                storeFrequency.merge(storeName, 1, Integer::sum);
                
                // 카테고리별 지출 (간단한 분류)
                String category = categorizeStore(storeName);
                categorySpending.merge(category, amount, Double::sum);
            }
        }
        
        analysis.put("categorySpending", categorySpending);
        analysis.put("favoriteStores", storeFrequency);
        
        return analysis;
    }
    
    public List<Recipe> getRecommendedRecipes(Long userId) {
        // 사용자의 최근 구매 재료를 기반으로 레시피 추천
        // 간단한 추천 로직 (실제로는 더 복잡한 알고리즘 사용 가능)
        return recipeRepository.findByUserId(userId);
    }
    
    private Map<String, Double> calculateMonthlySpending(List<Receipt> receipts) {
        Map<String, Double> monthlySpending = new HashMap<>();
        
        for (Receipt receipt : receipts) {
            if (receipt.getTotalAmount() != null && receipt.getPurchaseDate() != null) {
                String month = receipt.getPurchaseDate().toLocalDate().toString().substring(0, 7); // YYYY-MM
                monthlySpending.merge(month, receipt.getTotalAmount(), Double::sum);
            }
        }
        
        return monthlySpending;
    }
    
    private String categorizeStore(String storeName) {
        if (storeName == null) return "기타";
        
        String name = storeName.toLowerCase();
        if (name.contains("마트") || name.contains("mart") || name.contains("슈퍼")) {
            return "마트/슈퍼";
        } else if (name.contains("편의점") || name.contains("convenience")) {
            return "편의점";
        } else if (name.contains("백화점") || name.contains("department")) {
            return "백화점";
        } else if (name.contains("약국") || name.contains("pharmacy")) {
            return "약국";
        } else {
            return "기타";
        }
    }
}
