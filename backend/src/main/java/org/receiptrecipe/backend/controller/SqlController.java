package org.receiptrecipe.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sql")
@CrossOrigin(origins = "*")
public class SqlController {

    @Autowired
    private DataSource dataSource;

    // 1. 모든 레시피 조회 (SQL)
    @GetMapping("/recipes")
    public ResponseEntity<?> getAllRecipes(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            List<Map<String, Object>> recipes = new ArrayList<>();
            
            String sql = "SELECT r.id, r.name, r.description, r.category, r.difficulty_level, " +
                        "r.cooking_time, r.servings, r.image_url, r.created_at, r.updated_at, " +
                        "u.display_name as author_name " +
                        "FROM recipes r " +
                        "LEFT JOIN users u ON r.user_id = u.id " +
                        "ORDER BY r.created_at DESC " +
                        "LIMIT ? OFFSET ?";
            
            try (Connection conn = dataSource.getConnection();
                 PreparedStatement stmt = conn.prepareStatement(sql)) {
                
                stmt.setInt(1, size);
                stmt.setInt(2, page * size);
                
                try (ResultSet rs = stmt.executeQuery()) {
                    while (rs.next()) {
                        Map<String, Object> recipe = new HashMap<>();
                        recipe.put("id", rs.getLong("id"));
                        recipe.put("name", rs.getString("name"));
                        recipe.put("description", rs.getString("description"));
                        recipe.put("category", rs.getString("category"));
                        recipe.put("difficultyLevel", rs.getString("difficulty_level"));
                        recipe.put("cookingTime", rs.getInt("cooking_time"));
                        recipe.put("servings", rs.getInt("servings"));
                        recipe.put("imageUrl", rs.getString("image_url"));
                        recipe.put("createdAt", rs.getTimestamp("created_at"));
                        recipe.put("updatedAt", rs.getTimestamp("updated_at"));
                        recipe.put("authorName", rs.getString("author_name"));
                        
                        recipes.add(recipe);
                    }
                }
            }
            
            // 총 개수 조회
            String countSql = "SELECT COUNT(*) FROM recipes";
            long totalElements = 0;
            try (Connection conn = dataSource.getConnection();
                 PreparedStatement stmt = conn.prepareStatement(countSql);
                 ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    totalElements = rs.getLong(1);
                }
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("content", recipes);
            response.put("totalElements", totalElements);
            response.put("totalPages", (totalElements + size - 1) / size);
            response.put("page", page);
            response.put("size", size);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "레시피를 불러오는데 실패했습니다: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // 2. 레시피 검색 (SQL)
    @GetMapping("/recipes/search")
    public ResponseEntity<?> searchRecipes(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            List<Map<String, Object>> recipes = new ArrayList<>();
            
            String sql = "SELECT r.id, r.name, r.description, r.category, r.difficulty_level, " +
                        "r.cooking_time, r.servings, r.image_url, r.created_at, " +
                        "u.display_name as author_name " +
                        "FROM recipes r " +
                        "LEFT JOIN users u ON r.user_id = u.id " +
                        "WHERE r.name LIKE ? OR r.description LIKE ? " +
                        "ORDER BY r.created_at DESC " +
                        "LIMIT ? OFFSET ?";
            
            try (Connection conn = dataSource.getConnection();
                 PreparedStatement stmt = conn.prepareStatement(sql)) {
                
                String searchPattern = "%" + keyword + "%";
                stmt.setString(1, searchPattern);
                stmt.setString(2, searchPattern);
                stmt.setInt(3, size);
                stmt.setInt(4, page * size);
                
                try (ResultSet rs = stmt.executeQuery()) {
                    while (rs.next()) {
                        Map<String, Object> recipe = new HashMap<>();
                        recipe.put("id", rs.getLong("id"));
                        recipe.put("name", rs.getString("name"));
                        recipe.put("description", rs.getString("description"));
                        recipe.put("category", rs.getString("category"));
                        recipe.put("difficultyLevel", rs.getString("difficulty_level"));
                        recipe.put("cookingTime", rs.getInt("cooking_time"));
                        recipe.put("servings", rs.getInt("servings"));
                        recipe.put("imageUrl", rs.getString("image_url"));
                        recipe.put("createdAt", rs.getTimestamp("created_at"));
                        recipe.put("authorName", rs.getString("author_name"));
                        
                        recipes.add(recipe);
                    }
                }
            }
            
            return ResponseEntity.ok(recipes);
            
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "레시피 검색에 실패했습니다: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // 3. 영수증 조회 (SQL)
    @GetMapping("/receipts")
    public ResponseEntity<?> getAllReceipts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            List<Map<String, Object>> receipts = new ArrayList<>();
            
            String sql = "SELECT r.id, r.store_name, r.purchase_date, r.total_amount, " +
                        "r.raw_ocr_text, r.created_at, u.display_name as user_name " +
                        "FROM receipts r " +
                        "LEFT JOIN users u ON r.user_id = u.id " +
                        "ORDER BY r.created_at DESC " +
                        "LIMIT ? OFFSET ?";
            
            try (Connection conn = dataSource.getConnection();
                 PreparedStatement stmt = conn.prepareStatement(sql)) {
                
                stmt.setInt(1, size);
                stmt.setInt(2, page * size);
                
                try (ResultSet rs = stmt.executeQuery()) {
                    while (rs.next()) {
                        Map<String, Object> receipt = new HashMap<>();
                        receipt.put("id", rs.getLong("id"));
                        receipt.put("storeName", rs.getString("store_name"));
                        receipt.put("purchaseDate", rs.getTimestamp("purchase_date"));
                        receipt.put("totalAmount", rs.getDouble("total_amount"));
                        receipt.put("rawOcrText", rs.getString("raw_ocr_text"));
                        receipt.put("createdAt", rs.getTimestamp("created_at"));
                        receipt.put("userName", rs.getString("user_name"));
                        
                        receipts.add(receipt);
                    }
                }
            }
            
            return ResponseEntity.ok(receipts);
            
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "영수증을 불러오는데 실패했습니다: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // 4. 사용자 통계 (SQL)
    @GetMapping("/stats/users")
    public ResponseEntity<?> getUserStats() {
        try {
            Map<String, Object> stats = new HashMap<>();
            
            // 총 사용자 수
            String userCountSql = "SELECT COUNT(*) FROM users";
            try (Connection conn = dataSource.getConnection();
                 PreparedStatement stmt = conn.prepareStatement(userCountSql);
                 ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    stats.put("totalUsers", rs.getLong(1));
                }
            }
            
            // 총 레시피 수
            String recipeCountSql = "SELECT COUNT(*) FROM recipes";
            try (Connection conn = dataSource.getConnection();
                 PreparedStatement stmt = conn.prepareStatement(recipeCountSql);
                 ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    stats.put("totalRecipes", rs.getLong(1));
                }
            }
            
            // 총 포스트 수
            String postCountSql = "SELECT COUNT(*) FROM posts";
            try (Connection conn = dataSource.getConnection();
                 PreparedStatement stmt = conn.prepareStatement(postCountSql);
                 ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    stats.put("totalPosts", rs.getLong(1));
                }
            }
            
            // 총 영수증 수
            String receiptCountSql = "SELECT COUNT(*) FROM receipts";
            try (Connection conn = dataSource.getConnection();
                 PreparedStatement stmt = conn.prepareStatement(receiptCountSql);
                 ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    stats.put("totalReceipts", rs.getLong(1));
                }
            }
            
            return ResponseEntity.ok(stats);
            
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "통계를 불러오는데 실패했습니다: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // 5. 재료별 레시피 조회 (SQL)
    @GetMapping("/recipes/by-ingredient")
    public ResponseEntity<?> getRecipesByIngredient(
            @RequestParam String ingredient,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            List<Map<String, Object>> recipes = new ArrayList<>();
            
            String sql = "SELECT DISTINCT r.id, r.name, r.description, r.category, " +
                        "r.difficulty_level, r.cooking_time, r.servings, r.image_url, " +
                        "u.display_name as author_name " +
                        "FROM recipes r " +
                        "JOIN recipe_ingredients ri ON r.id = ri.recipe_id " +
                        "LEFT JOIN users u ON r.user_id = u.id " +
                        "WHERE ri.ingredient_name LIKE ? " +
                        "ORDER BY r.created_at DESC " +
                        "LIMIT ? OFFSET ?";
            
            try (Connection conn = dataSource.getConnection();
                 PreparedStatement stmt = conn.prepareStatement(sql)) {
                
                String searchPattern = "%" + ingredient + "%";
                stmt.setString(1, searchPattern);
                stmt.setInt(2, size);
                stmt.setInt(3, page * size);
                
                try (ResultSet rs = stmt.executeQuery()) {
                    while (rs.next()) {
                        Map<String, Object> recipe = new HashMap<>();
                        recipe.put("id", rs.getLong("id"));
                        recipe.put("name", rs.getString("name"));
                        recipe.put("description", rs.getString("description"));
                        recipe.put("category", rs.getString("category"));
                        recipe.put("difficultyLevel", rs.getString("difficulty_level"));
                        recipe.put("cookingTime", rs.getInt("cooking_time"));
                        recipe.put("servings", rs.getInt("servings"));
                        recipe.put("imageUrl", rs.getString("image_url"));
                        recipe.put("authorName", rs.getString("author_name"));
                        
                        recipes.add(recipe);
                    }
                }
            }
            
            return ResponseEntity.ok(recipes);
            
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "재료별 레시피 조회에 실패했습니다: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}
