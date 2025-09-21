package org.receiptrecipe.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "ingredient_expiry")
public class IngredientExpiry {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @NotNull
    @Column(name = "ingredient_name")
    private String ingredientName;
    
    @Column(name = "quantity")
    private Double quantity;
    
    @Column(name = "unit")
    private String unit;
    
    @NotNull
    @Column(name = "expiry_date")
    private LocalDate expiryDate;
    
    @Column(name = "purchase_date")
    private LocalDate purchaseDate;
    
    @Column(name = "is_notified")
    private Boolean isNotified = false;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Constructors
    public IngredientExpiry() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    public IngredientExpiry(User user, String ingredientName, LocalDate expiryDate) {
        this();
        this.user = user;
        this.ingredientName = ingredientName;
        this.expiryDate = expiryDate;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public User getUser() {
        return user;
    }
    
    public void setUser(User user) {
        this.user = user;
    }
    
    public String getIngredientName() {
        return ingredientName;
    }
    
    public void setIngredientName(String ingredientName) {
        this.ingredientName = ingredientName;
    }
    
    public Double getQuantity() {
        return quantity;
    }
    
    public void setQuantity(Double quantity) {
        this.quantity = quantity;
    }
    
    public String getUnit() {
        return unit;
    }
    
    public void setUnit(String unit) {
        this.unit = unit;
    }
    
    public LocalDate getExpiryDate() {
        return expiryDate;
    }
    
    public void setExpiryDate(LocalDate expiryDate) {
        this.expiryDate = expiryDate;
    }
    
    public LocalDate getPurchaseDate() {
        return purchaseDate;
    }
    
    public void setPurchaseDate(LocalDate purchaseDate) {
        this.purchaseDate = purchaseDate;
    }
    
    public Boolean getIsNotified() {
        return isNotified;
    }
    
    public void setIsNotified(Boolean isNotified) {
        this.isNotified = isNotified;
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
    
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
