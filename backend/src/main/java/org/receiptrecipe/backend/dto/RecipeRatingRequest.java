package org.receiptrecipe.backend.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class RecipeRatingRequest {
    
    @NotNull(message = "평점은 필수입니다")
    @Min(value = 1, message = "평점은 1점 이상이어야 합니다")
    @Max(value = 5, message = "평점은 5점 이하여야 합니다")
    private Integer rating;
    
    private String comment;
    
    private Boolean isFavorite = false;
    
    // 기본 생성자
    public RecipeRatingRequest() {}
    
    // 생성자
    public RecipeRatingRequest(Integer rating, String comment, Boolean isFavorite) {
        this.rating = rating;
        this.comment = comment;
        this.isFavorite = isFavorite;
    }
    
    // Getters and Setters
    public Integer getRating() {
        return rating;
    }
    
    public void setRating(Integer rating) {
        this.rating = rating;
    }
    
    public String getComment() {
        return comment;
    }
    
    public void setComment(String comment) {
        this.comment = comment;
    }
    
    public Boolean getIsFavorite() {
        return isFavorite;
    }
    
    public void setIsFavorite(Boolean isFavorite) {
        this.isFavorite = isFavorite;
    }
}







