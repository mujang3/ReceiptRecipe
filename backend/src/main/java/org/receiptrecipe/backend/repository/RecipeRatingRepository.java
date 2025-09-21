package org.receiptrecipe.backend.repository;

import org.receiptrecipe.backend.entity.RecipeRating;
import org.receiptrecipe.backend.entity.Recipe;
import org.receiptrecipe.backend.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RecipeRatingRepository extends JpaRepository<RecipeRating, Long> {
    
    List<RecipeRating> findByRecipeId(Long recipeId);
    
    List<RecipeRating> findByUserId(Long userId);
    
    Optional<RecipeRating> findByRecipeIdAndUserId(Long recipeId, Long userId);
    
    List<RecipeRating> findByIsFavoriteTrue();
    
    List<RecipeRating> findByIsFavoriteTrueAndUserId(Long userId);
    
    @Query("SELECT AVG(r.rating) FROM RecipeRating r WHERE r.recipe.id = :recipeId")
    Double findAverageRatingByRecipeId(@Param("recipeId") Long recipeId);
    
    @Query("SELECT COUNT(r) FROM RecipeRating r WHERE r.recipe.id = :recipeId")
    Long countRatingsByRecipeId(@Param("recipeId") Long recipeId);
    
    @Query("SELECT r FROM RecipeRating r WHERE r.rating >= :minRating ORDER BY r.createdAt DESC")
    List<RecipeRating> findHighRatedRecipes(@Param("minRating") Integer minRating);
    
    // 페이지네이션을 위한 메서드들
    Page<RecipeRating> findByRecipeOrderByCreatedAtDesc(Recipe recipe, Pageable pageable);
    
    Page<RecipeRating> findByUserOrderByCreatedAtDesc(User user, Pageable pageable);
    
    // 평점 개수 조회
    Long countByRecipeId(Long recipeId);
    
    // 높은 평점의 레시피들 조회 (제한된 개수)
    @Query("SELECT r FROM RecipeRating r WHERE r.rating >= :minRating ORDER BY r.createdAt DESC")
    List<RecipeRating> findHighRatedRecipes(@Param("minRating") Integer minRating, Pageable pageable);
}
