package org.receiptrecipe.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "recipes")
public class Recipe {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull
    @Column(name = "name")
    private String name;
    
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "instructions", columnDefinition = "TEXT")
    private String instructions;
    
    @Column(name = "cooking_time")
    private Integer cookingTime; // in minutes
    
    @Column(name = "servings")
    private Integer servings;
    
    @Column(name = "difficulty_level")
    private String difficultyLevel; // EASY, MEDIUM, HARD
    
    @Column(name = "category")
    private String category; // KOREAN, WESTERN, JAPANESE, etc.
    
    @Column(name = "image_url")
    private String imageUrl;
    
    @Column(name = "external_id")
    private String externalId; // 외부 API ID (Spoonacular 등)
    
    @OneToMany(mappedBy = "recipe", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<RecipeIngredient> ingredients;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonBackReference
    private User user;
    
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "recipe_tags",
        joinColumns = @JoinColumn(name = "recipe_id"),
        inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    private Set<Tag> tags;
    
    @OneToMany(mappedBy = "recipe", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<RecipeRating> ratings;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Constructors
    public Recipe() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    public Recipe(String name, String description, String instructions) {
        this();
        this.name = name;
        this.description = description;
        this.instructions = instructions;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public String getInstructions() {
        return instructions;
    }
    
    public void setInstructions(String instructions) {
        this.instructions = instructions;
    }
    
    public Integer getCookingTime() {
        return cookingTime;
    }
    
    public void setCookingTime(Integer cookingTime) {
        this.cookingTime = cookingTime;
    }
    
    public Integer getServings() {
        return servings;
    }
    
    public void setServings(Integer servings) {
        this.servings = servings;
    }
    
    public String getDifficultyLevel() {
        return difficultyLevel;
    }
    
    public void setDifficultyLevel(String difficultyLevel) {
        this.difficultyLevel = difficultyLevel;
    }
    
    public String getCategory() {
        return category;
    }
    
    public void setCategory(String category) {
        this.category = category;
    }
    
    public String getImageUrl() {
        return imageUrl;
    }
    
    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
    
    public String getExternalId() {
        return externalId;
    }

    public void setExternalId(String externalId) {
        this.externalId = externalId;
    }
    
    public List<RecipeIngredient> getIngredients() {
        return ingredients;
    }
    
    public void setIngredients(List<RecipeIngredient> ingredients) {
        this.ingredients = ingredients;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    public User getUser() {
        return user;
    }
    
    public void setUser(User user) {
        this.user = user;
    }
    
    public Set<Tag> getTags() {
        return tags;
    }
    
    public void setTags(Set<Tag> tags) {
        this.tags = tags;
    }
    
    public List<RecipeRating> getRatings() {
        return ratings;
    }
    
    public void setRatings(List<RecipeRating> ratings) {
        this.ratings = ratings;
    }
    
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
