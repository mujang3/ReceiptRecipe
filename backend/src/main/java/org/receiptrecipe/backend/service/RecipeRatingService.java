package org.receiptrecipe.backend.service;

import org.receiptrecipe.backend.dto.RecipeRatingRequest;
import org.receiptrecipe.backend.dto.RecipeRatingResponse;
import org.receiptrecipe.backend.entity.RecipeRating;
import org.receiptrecipe.backend.entity.Recipe;
import org.receiptrecipe.backend.entity.User;
import org.receiptrecipe.backend.repository.RecipeRatingRepository;
import org.receiptrecipe.backend.repository.RecipeRepository;
import org.receiptrecipe.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class RecipeRatingService {
    
    @Autowired
    private RecipeRatingRepository ratingRepository;
    
    @Autowired
    private RecipeRepository recipeRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    // 평점 및 리뷰 추가/수정
    public RecipeRatingResponse addOrUpdateRating(Long recipeId, Long userId, RecipeRatingRequest request) {
        Recipe recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new RuntimeException("Recipe not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // 기존 평점이 있는지 확인
        Optional<RecipeRating> existingRating = ratingRepository.findByRecipeIdAndUserId(recipeId, userId);
        
        RecipeRating rating;
        if (existingRating.isPresent()) {
            // 기존 평점 수정
            rating = existingRating.get();
            rating.setRating(request.getRating());
            rating.setComment(request.getComment());
            rating.setIsFavorite(request.getIsFavorite());
            rating.setUpdatedAt(LocalDateTime.now());
        } else {
            // 새 평점 생성
            rating = new RecipeRating();
            rating.setRecipe(recipe);
            rating.setUser(user);
            rating.setRating(request.getRating());
            rating.setComment(request.getComment());
            rating.setIsFavorite(request.getIsFavorite());
        }
        
        RecipeRating savedRating = ratingRepository.save(rating);
        return convertToResponse(savedRating);
    }
    
    // 평점 삭제
    public void deleteRating(Long recipeId, Long userId) {
        RecipeRating rating = ratingRepository.findByRecipeIdAndUserId(recipeId, userId)
                .orElseThrow(() -> new RuntimeException("Rating not found"));
        ratingRepository.delete(rating);
    }
    
    // 레시피의 평점 목록 조회
    public Page<RecipeRatingResponse> getRecipeRatings(Long recipeId, int page, int size) {
        Recipe recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new RuntimeException("Recipe not found"));
        
        Pageable pageable = PageRequest.of(page, size);
        Page<RecipeRating> ratings = ratingRepository.findByRecipeOrderByCreatedAtDesc(recipe, pageable);
        
        return ratings.map(this::convertToResponse);
    }
    
    // 사용자의 평점 목록 조회
    public Page<RecipeRatingResponse> getUserRatings(Long userId, int page, int size) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Pageable pageable = PageRequest.of(page, size);
        Page<RecipeRating> ratings = ratingRepository.findByUserOrderByCreatedAtDesc(user, pageable);
        
        return ratings.map(this::convertToResponse);
    }
    
    // 특정 사용자의 특정 레시피 평점 조회
    public Optional<RecipeRatingResponse> getUserRatingForRecipe(Long recipeId, Long userId) {
        Optional<RecipeRating> rating = ratingRepository.findByRecipeIdAndUserId(recipeId, userId);
        return rating.map(this::convertToResponse);
    }
    
    // 레시피의 평균 평점 계산
    public Double getAverageRating(Long recipeId) {
        return ratingRepository.findAverageRatingByRecipeId(recipeId);
    }
    
    // 레시피의 평점 개수
    public Long getRatingCount(Long recipeId) {
        return ratingRepository.countByRecipeId(recipeId);
    }
    
    // 높은 평점의 레시피들 조회
    public List<RecipeRatingResponse> getHighRatedRecipes(int minRating, int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        List<RecipeRating> ratings = ratingRepository.findHighRatedRecipes(minRating, pageable);
        return ratings.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    // 평점을 Response DTO로 변환
    private RecipeRatingResponse convertToResponse(RecipeRating rating) {
        RecipeRatingResponse response = new RecipeRatingResponse();
        response.setId(rating.getId());
        response.setRecipeId(rating.getRecipe().getId());
        response.setRecipeName(rating.getRecipe().getName());
        response.setUserId(rating.getUser().getId());
        response.setUsername(rating.getUser().getUsername());
        response.setUserDisplayName(rating.getUser().getDisplayName());
        response.setUserAvatarUrl(rating.getUser().getAvatarUrl());
        response.setRating(rating.getRating());
        response.setComment(rating.getComment());
        response.setIsFavorite(rating.getIsFavorite());
        response.setCreatedAt(rating.getCreatedAt());
        response.setUpdatedAt(rating.getUpdatedAt());
        return response;
    }
}
