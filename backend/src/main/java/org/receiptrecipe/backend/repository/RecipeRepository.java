package org.receiptrecipe.backend.repository;

import org.receiptrecipe.backend.entity.Recipe;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecipeRepository extends JpaRepository<Recipe, Long> {
    
    List<Recipe> findByNameContainingIgnoreCase(String name);
    Page<Recipe> findByNameContainingIgnoreCase(String name, Pageable pageable);
    
    List<Recipe> findByCategory(String category);
    Page<Recipe> findByCategory(String category, Pageable pageable);
    
    List<Recipe> findByDifficultyLevel(String difficultyLevel);
    Page<Recipe> findByDifficultyLevel(String difficultyLevel, Pageable pageable);
    
    List<Recipe> findByCookingTimeLessThanEqual(Integer maxCookingTime);
    
    @Query("SELECT r FROM Recipe r WHERE r.name LIKE %:keyword% OR r.description LIKE %:keyword%")
    List<Recipe> findByKeyword(@Param("keyword") String keyword);
    
    @Query("SELECT r FROM Recipe r JOIN r.ingredients ri WHERE ri.ingredientName LIKE %:ingredientName%")
    List<Recipe> findByIngredientName(@Param("ingredientName") String ingredientName);
    
    @Query("SELECT r FROM Recipe r WHERE r.id IN (" +
           "SELECT DISTINCT r2.id FROM Recipe r2 JOIN r2.ingredients ri " +
           "WHERE ri.ingredientName IN :ingredientNames)")
    List<Recipe> findByIngredientNames(@Param("ingredientNames") List<String> ingredientNames);
    
    @Query("SELECT DISTINCT r.category FROM Recipe r WHERE r.category IS NOT NULL ORDER BY r.category")
    List<String> findDistinctCategories();
    
    @Query("SELECT DISTINCT r.difficultyLevel FROM Recipe r WHERE r.difficultyLevel IS NOT NULL ORDER BY r.difficultyLevel")
    List<String> findDistinctDifficultyLevels();
    
    List<Recipe> findByUserId(Long userId);
    
    boolean existsByExternalId(String externalId);
}
