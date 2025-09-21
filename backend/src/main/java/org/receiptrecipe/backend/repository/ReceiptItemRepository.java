package org.receiptrecipe.backend.repository;

import org.receiptrecipe.backend.entity.ReceiptItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ReceiptItemRepository extends JpaRepository<ReceiptItem, Long> {
    
    List<ReceiptItem> findByItemNameContainingIgnoreCase(String itemName);
    
    List<ReceiptItem> findByIsIngredientTrue();
    
    List<ReceiptItem> findByCategory(String category);
    
    @Query("SELECT ri FROM ReceiptItem ri WHERE ri.expiryDate <= :date AND ri.isIngredient = true")
    List<ReceiptItem> findExpiringIngredients(@Param("date") LocalDate date);
    
    @Query("SELECT ri FROM ReceiptItem ri WHERE ri.expiryDate BETWEEN :startDate AND :endDate AND ri.isIngredient = true")
    List<ReceiptItem> findIngredientsExpiringBetween(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    @Query("SELECT DISTINCT ri.itemName FROM ReceiptItem ri WHERE ri.isIngredient = true ORDER BY ri.itemName")
    List<String> findDistinctIngredientNames();
    
    @Query("SELECT DISTINCT ri.category FROM ReceiptItem ri WHERE ri.category IS NOT NULL ORDER BY ri.category")
    List<String> findDistinctCategories();
}
