package org.receiptrecipe.backend.controller;

import org.receiptrecipe.backend.dto.RecipeRatingRequest;
import org.receiptrecipe.backend.dto.RecipeRatingResponse;
import org.receiptrecipe.backend.service.RecipeRatingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/ratings")
@CrossOrigin(origins = "*")
public class RecipeRatingController {
    
    @Autowired
    private RecipeRatingService ratingService;
    
    // 평점 및 리뷰 추가/수정
    @PostMapping("/recipes/{recipeId}/users/{userId}")
    public ResponseEntity<Map<String, Object>> addOrUpdateRating(
            @PathVariable Long recipeId,
            @PathVariable Long userId,
            @RequestBody RecipeRatingRequest request) {
        try {
            RecipeRatingResponse response = ratingService.addOrUpdateRating(recipeId, userId, request);
            Map<String, Object> result = new HashMap<>();
            result.put("message", "평점이 성공적으로 저장되었습니다.");
            result.put("rating", response);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    // 평점 삭제
    @DeleteMapping("/recipes/{recipeId}/users/{userId}")
    public ResponseEntity<Map<String, Object>> deleteRating(
            @PathVariable Long recipeId,
            @PathVariable Long userId) {
        try {
            ratingService.deleteRating(recipeId, userId);
            Map<String, Object> result = new HashMap<>();
            result.put("message", "평점이 삭제되었습니다.");
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    // 레시피의 평점 목록 조회
    @GetMapping("/recipes/{recipeId}")
    public ResponseEntity<Page<RecipeRatingResponse>> getRecipeRatings(
            @PathVariable Long recipeId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Page<RecipeRatingResponse> ratings = ratingService.getRecipeRatings(recipeId, page, size);
            return ResponseEntity.ok(ratings);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // 사용자의 평점 목록 조회
    @GetMapping("/users/{userId}")
    public ResponseEntity<Page<RecipeRatingResponse>> getUserRatings(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Page<RecipeRatingResponse> ratings = ratingService.getUserRatings(userId, page, size);
            return ResponseEntity.ok(ratings);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // 특정 사용자의 특정 레시피 평점 조회
    @GetMapping("/recipes/{recipeId}/users/{userId}")
    public ResponseEntity<Map<String, Object>> getUserRatingForRecipe(
            @PathVariable Long recipeId,
            @PathVariable Long userId) {
        try {
            Optional<RecipeRatingResponse> rating = ratingService.getUserRatingForRecipe(recipeId, userId);
            Map<String, Object> result = new HashMap<>();
            result.put("hasRating", rating.isPresent());
            result.put("rating", rating.orElse(null));
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    // 레시피의 평균 평점 조회
    @GetMapping("/recipes/{recipeId}/average")
    public ResponseEntity<Map<String, Object>> getAverageRating(@PathVariable Long recipeId) {
        try {
            Double averageRating = ratingService.getAverageRating(recipeId);
            Long ratingCount = ratingService.getRatingCount(recipeId);
            
            Map<String, Object> result = new HashMap<>();
            result.put("averageRating", averageRating != null ? Math.round(averageRating * 10.0) / 10.0 : 0.0);
            result.put("ratingCount", ratingCount);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    // 높은 평점의 레시피들 조회
    @GetMapping("/high-rated")
    public ResponseEntity<List<RecipeRatingResponse>> getHighRatedRecipes(
            @RequestParam(defaultValue = "4") int minRating,
            @RequestParam(defaultValue = "10") int limit) {
        try {
            List<RecipeRatingResponse> ratings = ratingService.getHighRatedRecipes(minRating, limit);
            return ResponseEntity.ok(ratings);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}