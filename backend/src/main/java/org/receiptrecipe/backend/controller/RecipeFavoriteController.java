package org.receiptrecipe.backend.controller;

import org.receiptrecipe.backend.entity.RecipeFavorite;
import org.receiptrecipe.backend.service.RecipeFavoriteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/favorites")
@CrossOrigin(origins = "*")
public class RecipeFavoriteController {
    
    @Autowired
    private RecipeFavoriteService favoriteService;
    
    // 즐겨찾기 추가
    @PostMapping("/recipes/{recipeId}/users/{userId}")
    public ResponseEntity<Map<String, Object>> addFavorite(
            @PathVariable Long recipeId,
            @PathVariable Long userId) {
        try {
            RecipeFavorite favorite = favoriteService.addFavorite(userId, recipeId);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "레시피가 즐겨찾기에 추가되었습니다.");
            response.put("favoriteId", favorite.getId());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    // 즐겨찾기 제거
    @DeleteMapping("/recipes/{recipeId}/users/{userId}")
    public ResponseEntity<Map<String, Object>> removeFavorite(
            @PathVariable Long recipeId,
            @PathVariable Long userId) {
        try {
            favoriteService.removeFavorite(userId, recipeId);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "레시피가 즐겨찾기에서 제거되었습니다.");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    // 즐겨찾기 토글
    @PostMapping("/recipes/{recipeId}/users/{userId}/toggle")
    public ResponseEntity<Map<String, Object>> toggleFavorite(
            @PathVariable Long recipeId,
            @PathVariable Long userId) {
        try {
            boolean isAdded = favoriteService.toggleFavorite(userId, recipeId);
            Map<String, Object> response = new HashMap<>();
            response.put("isFavorite", isAdded);
            response.put("message", isAdded ? "레시피가 즐겨찾기에 추가되었습니다." : "레시피가 즐겨찾기에서 제거되었습니다.");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    // 사용자의 즐겨찾기 목록 조회
    @GetMapping("/users/{userId}")
    public ResponseEntity<Page<RecipeFavorite>> getUserFavorites(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        try {
            Page<RecipeFavorite> favorites = favoriteService.getUserFavorites(userId, page, size);
            return ResponseEntity.ok(favorites);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // 즐겨찾기 여부 확인
    @GetMapping("/recipes/{recipeId}/users/{userId}/check")
    public ResponseEntity<Map<String, Object>> checkFavorite(
            @PathVariable Long recipeId,
            @PathVariable Long userId) {
        try {
            boolean isFavorite = favoriteService.isFavorite(userId, recipeId);
            Map<String, Object> response = new HashMap<>();
            response.put("isFavorite", isFavorite);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    // 사용자의 즐겨찾기 개수
    @GetMapping("/users/{userId}/count")
    public ResponseEntity<Map<String, Object>> getFavoriteCount(@PathVariable Long userId) {
        try {
            long count = favoriteService.getFavoriteCount(userId);
            Map<String, Object> response = new HashMap<>();
            response.put("count", count);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    // 레시피의 즐겨찾기 개수
    @GetMapping("/recipes/{recipeId}/count")
    public ResponseEntity<Map<String, Object>> getRecipeFavoriteCount(@PathVariable Long recipeId) {
        try {
            long count = favoriteService.getRecipeFavoriteCount(recipeId);
            Map<String, Object> response = new HashMap<>();
            response.put("count", count);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}







