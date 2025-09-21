package org.receiptrecipe.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "tags")
public class Tag {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull
    @Column(name = "name", unique = true)
    private String name;
    
    @Column(name = "color")
    private String color; // Hex color code
    
    @Column(name = "description")
    private String description;
    
    @ManyToMany(mappedBy = "tags", fetch = FetchType.LAZY)
    private List<Receipt> receipts;
    
    @ManyToMany(mappedBy = "tags", fetch = FetchType.LAZY)
    private List<Recipe> recipes;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Constructors
    public Tag() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    public Tag(String name) {
        this();
        this.name = name;
    }
    
    public Tag(String name, String color) {
        this(name);
        this.color = color;
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
    
    public String getColor() {
        return color;
    }
    
    public void setColor(String color) {
        this.color = color;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public List<Receipt> getReceipts() {
        return receipts;
    }
    
    public void setReceipts(List<Receipt> receipts) {
        this.receipts = receipts;
    }
    
    public List<Recipe> getRecipes() {
        return recipes;
    }
    
    public void setRecipes(List<Recipe> recipes) {
        this.recipes = recipes;
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
