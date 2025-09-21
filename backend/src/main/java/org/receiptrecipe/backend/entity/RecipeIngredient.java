package org.receiptrecipe.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

@Entity
@Table(name = "recipe_ingredients")
public class RecipeIngredient {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull
    @Column(name = "ingredient_name")
    private String ingredientName;
    
    @Column(name = "quantity")
    private BigDecimal quantity;
    
    @Column(name = "unit")
    private String unit; // kg, g, ml, l, 개, etc.
    
    @Column(name = "notes")
    private String notes;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipe_id")
    private Recipe recipe;
    
    // Constructors
    public RecipeIngredient() {}
    
    public RecipeIngredient(String ingredientName, BigDecimal quantity, String unit) {
        this.ingredientName = ingredientName;
        this.quantity = quantity;
        this.unit = unit;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getIngredientName() {
        return ingredientName;
    }
    
    public void setIngredientName(String ingredientName) {
        this.ingredientName = ingredientName;
    }
    
    public BigDecimal getQuantity() {
        return quantity;
    }
    
    public void setQuantity(BigDecimal quantity) {
        this.quantity = quantity;
    }
    
    public String getUnit() {
        return unit;
    }
    
    public void setUnit(String unit) {
        this.unit = unit;
    }
    
    public String getNotes() {
        return notes;
    }
    
    public void setNotes(String notes) {
        this.notes = notes;
    }
    
    public Recipe getRecipe() {
        return recipe;
    }
    
    public void setRecipe(Recipe recipe) {
        this.recipe = recipe;
    }
}
