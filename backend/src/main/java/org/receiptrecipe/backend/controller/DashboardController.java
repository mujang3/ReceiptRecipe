package org.receiptrecipe.backend.controller;

import org.receiptrecipe.backend.entity.Recipe;
import org.receiptrecipe.backend.service.DashboardService;
import org.receiptrecipe.backend.service.NotificationService;
import org.receiptrecipe.backend.entity.IngredientExpiry;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {
    
    @Autowired
    private DashboardService dashboardService;
    
    @Autowired
    private NotificationService notificationService;
    
    @GetMapping("/stats/{userId}")
    public ResponseEntity<Map<String, Object>> getDashboardStats(@PathVariable Long userId) {
        Map<String, Object> stats = dashboardService.getDashboardStats(userId);
        return ResponseEntity.ok(stats);
    }
    
    @GetMapping("/expense-analysis/{userId}")
    public ResponseEntity<Map<String, Object>> getExpenseAnalysis(@PathVariable Long userId) {
        Map<String, Object> analysis = dashboardService.getExpenseAnalysis(userId);
        return ResponseEntity.ok(analysis);
    }
    
    @GetMapping("/recommendations/{userId}")
    public ResponseEntity<List<Recipe>> getRecommendedRecipes(@PathVariable Long userId) {
        List<Recipe> recommendations = dashboardService.getRecommendedRecipes(userId);
        return ResponseEntity.ok(recommendations);
    }
    
    @GetMapping("/notifications/expiring/{userId}")
    public ResponseEntity<List<IngredientExpiry>> getExpiringIngredients(
            @PathVariable Long userId, 
            @RequestParam(defaultValue = "3") int days) {
        List<IngredientExpiry> expiring = notificationService.getExpiringSoon(userId, days);
        return ResponseEntity.ok(expiring);
    }
    
    @GetMapping("/notifications/expired/{userId}")
    public ResponseEntity<List<IngredientExpiry>> getExpiredIngredients(@PathVariable Long userId) {
        List<IngredientExpiry> expired = notificationService.getExpiredIngredients(userId);
        return ResponseEntity.ok(expired);
    }
}
