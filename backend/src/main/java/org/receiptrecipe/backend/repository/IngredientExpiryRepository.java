package org.receiptrecipe.backend.repository;

import org.receiptrecipe.backend.entity.IngredientExpiry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface IngredientExpiryRepository extends JpaRepository<IngredientExpiry, Long> {
    
    List<IngredientExpiry> findByUserId(Long userId);
    
    List<IngredientExpiry> findByUserIdOrderByExpiryDateAsc(Long userId);
    
    @Query("SELECT ie FROM IngredientExpiry ie WHERE ie.user.id = :userId AND ie.expiryDate <= :date")
    List<IngredientExpiry> findExpiredIngredients(@Param("userId") Long userId, @Param("date") LocalDate date);
    
    @Query("SELECT ie FROM IngredientExpiry ie WHERE ie.expiryDate <= :date")
    List<IngredientExpiry> findExpiredIngredients(@Param("date") LocalDate date);
    
    @Query("SELECT ie FROM IngredientExpiry ie WHERE ie.user.id = :userId AND ie.expiryDate BETWEEN :startDate AND :endDate")
    List<IngredientExpiry> findExpiringSoon(@Param("userId") Long userId, 
                                          @Param("startDate") LocalDate startDate, 
                                          @Param("endDate") LocalDate endDate);
    
    @Query("SELECT ie FROM IngredientExpiry ie WHERE ie.expiryDate BETWEEN :startDate AND :endDate")
    List<IngredientExpiry> findExpiringSoon(@Param("startDate") LocalDate startDate, 
                                          @Param("endDate") LocalDate endDate);
    
    @Query("SELECT ie FROM IngredientExpiry ie WHERE ie.user.id = :userId AND ie.isNotified = false AND ie.expiryDate <= :date")
    List<IngredientExpiry> findUnnotifiedExpiredIngredients(@Param("userId") Long userId, @Param("date") LocalDate date);
    
    List<IngredientExpiry> findByIngredientNameContainingIgnoreCase(String ingredientName);
    
    @Query("SELECT DISTINCT ie.ingredientName FROM IngredientExpiry ie WHERE ie.user.id = :userId ORDER BY ie.ingredientName")
    List<String> findDistinctIngredientNamesByUserId(@Param("userId") Long userId);
}
