package org.receiptrecipe.backend.service;

import org.receiptrecipe.backend.entity.RecipeFavorite;
import org.receiptrecipe.backend.entity.User;
import org.receiptrecipe.backend.entity.Recipe;
import org.receiptrecipe.backend.repository.RecipeFavoriteRepository;
import org.receiptrecipe.backend.repository.UserRepository;
import org.receiptrecipe.backend.repository.RecipeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class RecipeFavoriteService {
    
    @Autowired
    private RecipeFavoriteRepository favoriteRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private RecipeRepository recipeRepository;
    
    // 즐겨찾기 추가
    public RecipeFavorite addFavorite(Long userId, Long recipeId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Recipe recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new RuntimeException("Recipe not found"));
        
        // 이미 즐겨찾기되어 있는지 확인
        if (favoriteRepository.existsByUserAndRecipe(user, recipe)) {
            throw new RuntimeException("Recipe already in favorites");
        }
        
        RecipeFavorite favorite = new RecipeFavorite(user, recipe);
        return favoriteRepository.save(favorite);
    }
    
    // 즐겨찾기 제거
    public void removeFavorite(Long userId, Long recipeId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Recipe recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new RuntimeException("Recipe not found"));
        
        RecipeFavorite favorite = favoriteRepository.findByUserAndRecipe(user, recipe)
                .orElseThrow(() -> new RuntimeException("Favorite not found"));
        
        favoriteRepository.delete(favorite);
    }
    
    // 즐겨찾기 토글 (있으면 제거, 없으면 추가)
    public boolean toggleFavorite(Long userId, Long recipeId) {
        if (favoriteRepository.existsByUserIdAndRecipeId(userId, recipeId)) {
            removeFavorite(userId, recipeId);
            return false; // 제거됨
        } else {
            addFavorite(userId, recipeId);
            return true; // 추가됨
        }
    }
    
    // 사용자의 즐겨찾기 목록 조회
    public Page<RecipeFavorite> getUserFavorites(Long userId, int page, int size) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Pageable pageable = PageRequest.of(page, size);
        return favoriteRepository.findByUserOrderByCreatedAtDesc(user, pageable);
    }
    
    // 즐겨찾기 여부 확인
    public boolean isFavorite(Long userId, Long recipeId) {
        return favoriteRepository.existsByUserIdAndRecipeId(userId, recipeId);
    }
    
    // 사용자의 즐겨찾기 개수
    public long getFavoriteCount(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return favoriteRepository.countByUser(user);
    }
    
    // 레시피의 즐겨찾기 개수
    public long getRecipeFavoriteCount(Long recipeId) {
        Recipe recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new RuntimeException("Recipe not found"));
        return favoriteRepository.countByRecipe(recipe);
    }
}


