// OcrResult.java
package org.receiptrecipe.backend.dto;

import java.math.BigDecimal;
import java.util.List;

public class OcrResult {
    private ProcessedData processedData;
    private String rawText;

    // Getters and Setters
    public ProcessedData getProcessedData() {
        return processedData;
    }

    public void setProcessedData(ProcessedData processedData) {
        this.processedData = processedData;
    }

    public String getRawText() {
        return rawText;
    }

    public void setRawText(String rawText) {
        this.rawText = rawText;
    }

    public static class ProcessedData {
        private String storeName;
        private String purchaseDate;
        private BigDecimal totalAmount;
        private List<Item> items;

        // Getters and Setters
        public String getStoreName() {
            return storeName;
        }

        public void setStoreName(String storeName) {
            this.storeName = storeName;
        }

        public String getPurchaseDate() {
            return purchaseDate;
        }

        public void setPurchaseDate(String purchaseDate) {
            this.purchaseDate = purchaseDate;
        }

        public BigDecimal getTotalAmount() {
            return totalAmount;
        }

        public void setTotalAmount(BigDecimal totalAmount) {
            this.totalAmount = totalAmount;
        }

        public List<Item> getItems() {
            return items;
        }

        public void setItems(List<Item> items) {
            this.items = items;
        }
    }

    public static class Item {
        private String itemName;
        private Integer quantity;
        private BigDecimal unitPrice;
        private BigDecimal totalPrice;
        private String category;
        private Boolean isIngredient;

        // Getters and Setters
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
    }
}