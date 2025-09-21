package org.receiptrecipe.backend.service;

import org.receiptrecipe.backend.entity.Recipe;
import org.receiptrecipe.backend.entity.RecipeRating;
import org.receiptrecipe.backend.entity.User;
import org.receiptrecipe.backend.repository.RecipeRepository;
import org.receiptrecipe.backend.repository.RecipeRatingRepository;
import org.receiptrecipe.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@Transactional
public class RecipeService {
    
    @Autowired
    private RecipeRepository recipeRepository;
    
    @Autowired
    private RecipeRatingRepository recipeRatingRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public Page<Recipe> getAllRecipes(int page, int size, String category, String search, String difficultyLevel) {
        Pageable pageable = PageRequest.of(page, size);
        
        // 검색어가 있는 경우
        if (search != null && !search.trim().isEmpty()) {
            return recipeRepository.findByNameContainingIgnoreCase(search, pageable);
        }
        
        // 카테고리가 있는 경우
        if (category != null && !category.trim().isEmpty()) {
            return recipeRepository.findByCategory(category, pageable);
        }
        
        // 난이도가 있는 경우
        if (difficultyLevel != null && !difficultyLevel.trim().isEmpty()) {
            return recipeRepository.findByDifficultyLevel(difficultyLevel, pageable);
        }
        
        // 모든 레시피 반환
        return recipeRepository.findAll(pageable);
    }
    
    public Optional<Recipe> getRecipeById(Long id) {
        return recipeRepository.findById(id);
    }
    
    public Recipe saveRecipe(Recipe recipe) {
        if (recipe.getId() == null) {
            recipe.setCreatedAt(LocalDateTime.now());
        }
        recipe.setUpdatedAt(LocalDateTime.now());
        return recipeRepository.save(recipe);
    }
    
    public Recipe createRecipe(Recipe recipe) {
        recipe.setCreatedAt(LocalDateTime.now());
        recipe.setUpdatedAt(LocalDateTime.now());
        return recipeRepository.save(recipe);
    }
    
    public Recipe updateRecipe(Recipe recipe) {
        recipe.setUpdatedAt(LocalDateTime.now());
        return recipeRepository.save(recipe);
    }
    
    public boolean deleteRecipe(Long id) {
        if (recipeRepository.existsById(id)) {
            recipeRepository.deleteById(id);
            return true;
        }
        return false;
    }
    
    public List<Recipe> getRecipesByUserId(Long userId) {
        return recipeRepository.findByUserId(userId);
    }
    
    public List<Recipe> getRecipesByCategory(String category) {
        return recipeRepository.findByCategory(category);
    }
    
    public List<Recipe> searchRecipes(String keyword) {
        return recipeRepository.findByNameContainingIgnoreCase(keyword);
    }
    
    public Map<String, Object> rateRecipe(Long recipeId, Long userId, int rating, String comment) {
        Map<String, Object> result = new HashMap<>();
        
        try {
            // 레시피 존재 확인
            Optional<Recipe> recipeOpt = recipeRepository.findById(recipeId);
            if (!recipeOpt.isPresent()) {
                result.put("success", false);
                result.put("message", "레시피를 찾을 수 없습니다.");
                return result;
            }
            
            // 사용자 존재 확인
            Optional<User> userOpt = userRepository.findById(userId);
            if (!userOpt.isPresent()) {
                result.put("success", false);
                result.put("message", "사용자를 찾을 수 없습니다.");
                return result;
            }
            
            Recipe recipe = recipeOpt.get();
            User user = userOpt.get();
            
            // 기존 평점 확인
            Optional<RecipeRating> existingRating = recipeRatingRepository
                .findByRecipeIdAndUserId(recipeId, userId);
            
            RecipeRating recipeRating;
            if (existingRating.isPresent()) {
                // 기존 평점 업데이트
                recipeRating = existingRating.get();
                recipeRating.setRating(rating);
                recipeRating.setComment(comment);
                recipeRating.setUpdatedAt(LocalDateTime.now());
            } else {
                // 새 평점 생성
                recipeRating = new RecipeRating();
                recipeRating.setRecipe(recipe);
                recipeRating.setUser(user);
                recipeRating.setRating(rating);
                recipeRating.setComment(comment);
                recipeRating.setCreatedAt(LocalDateTime.now());
                recipeRating.setUpdatedAt(LocalDateTime.now());
            }
            
            recipeRatingRepository.save(recipeRating);
            
            result.put("success", true);
            result.put("message", "평점이 등록되었습니다.");
            result.put("rating", recipeRating);
            
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "평점 등록에 실패했습니다: " + e.getMessage());
        }
        
        return result;
    }
    
    public List<String> getDistinctCategories() {
        return recipeRepository.findDistinctCategories();
    }
    
    public List<String> getDistinctDifficultyLevels() {
        return recipeRepository.findDistinctDifficultyLevels();
    }
    
    public boolean existsByExternalId(String externalId) {
        return recipeRepository.existsByExternalId(externalId);
    }
}
