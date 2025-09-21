package org.receiptrecipe.backend.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "receipts")
public class Receipt {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull
    @Column(name = "store_name")
    private String storeName;
    
    @Column(name = "purchase_date")
    private LocalDateTime purchaseDate;
    
    @Column(name = "total_amount")
    private Double totalAmount;
    
    @Column(name = "image_url")
    private String imageUrl;
    
    @Column(name = "raw_ocr_text", columnDefinition = "TEXT")
    private String rawOcrText;
    
    @Column(name = "processed_data", columnDefinition = "JSON")
    private String processedData;
    
    @OneToMany(mappedBy = "receipt", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ReceiptItem> items;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonBackReference
    private User user;
    
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "receipt_tags",
        joinColumns = @JoinColumn(name = "receipt_id"),
        inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    private Set<Tag> tags;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Constructors
    public Receipt() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    public Receipt(String storeName, LocalDateTime purchaseDate, Double totalAmount) {
        this();
        this.storeName = storeName;
        this.purchaseDate = purchaseDate;
        this.totalAmount = totalAmount;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getStoreName() {
        return storeName;
    }
    
    public void setStoreName(String storeName) {
        this.storeName = storeName;
    }
    
    public LocalDateTime getPurchaseDate() {
        return purchaseDate;
    }
    
    public void setPurchaseDate(LocalDateTime purchaseDate) {
        this.purchaseDate = purchaseDate;
    }
    
    public Double getTotalAmount() {
        return totalAmount;
    }
    
    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }
    
    public String getImageUrl() {
        return imageUrl;
    }
    
    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
    
    public String getRawOcrText() {
        return rawOcrText;
    }
    
    public void setRawOcrText(String rawOcrText) {
        this.rawOcrText = rawOcrText;
    }
    
    public String getProcessedData() {
        return processedData;
    }
    
    public void setProcessedData(String processedData) {
        this.processedData = processedData;
    }
    
    public List<ReceiptItem> getItems() {
        return items;
    }
    
    public void setItems(List<ReceiptItem> items) {
        this.items = items;
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
    
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
