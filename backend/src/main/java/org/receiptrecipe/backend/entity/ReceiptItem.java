package org.receiptrecipe.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

@Entity
@Table(name = "receipt_items")
public class ReceiptItem {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull
    @Column(name = "item_name")
    private String itemName;
    
    @Column(name = "quantity")
    private Integer quantity;
    
    @Column(name = "unit_price", precision = 10, scale = 2)
    private BigDecimal unitPrice;
    
    @Column(name = "total_price", precision = 10, scale = 2)
    private BigDecimal totalPrice;
    
    @Column(name = "category")
    private String category;
    
    @Column(name = "is_ingredient")
    private Boolean isIngredient = false;
    
    @Column(name = "expiry_date")
    private java.time.LocalDate expiryDate;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "receipt_id")
    private Receipt receipt;
    
    // Constructors
    public ReceiptItem() {}
    
    public ReceiptItem(String itemName, Integer quantity, BigDecimal unitPrice, BigDecimal totalPrice) {
        this.itemName = itemName;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        this.totalPrice = totalPrice;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getItemName() {
        return itemName;
    }
    
    public void setItemName(String itemName) {
        this.itemName = itemName;
    }
    
    public Integer getQuantity() {
        return quantity;
    }
    
    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
    
    public BigDecimal getUnitPrice() {
        return unitPrice;
    }
    
    public void setUnitPrice(BigDecimal unitPrice) {
        this.unitPrice = unitPrice;
    }
    
    public BigDecimal getTotalPrice() {
        return totalPrice;
    }
    
    public void setTotalPrice(BigDecimal totalPrice) {
        this.totalPrice = totalPrice;
    }
    
    public String getCategory() {
        return category;
    }
    
    public void setCategory(String category) {
        this.category = category;
    }
    
    public Boolean getIsIngredient() {
        return isIngredient;
    }
    
    public void setIsIngredient(Boolean isIngredient) {
        this.isIngredient = isIngredient;
    }
    
    public java.time.LocalDate getExpiryDate() {
        return expiryDate;
    }
    
    public void setExpiryDate(java.time.LocalDate expiryDate) {
        this.expiryDate = expiryDate;
    }
    
    public Receipt getReceipt() {
        return receipt;
    }
    
    public void setReceipt(Receipt receipt) {
        this.receipt = receipt;
    }
}
