package org.receiptrecipe.backend.repository;

import org.receiptrecipe.backend.entity.RecipeFavorite;
import org.receiptrecipe.backend.entity.User;
import org.receiptrecipe.backend.entity.Recipe;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RecipeFavoriteRepository extends JpaRepository<RecipeFavorite, Long> {
    
    // 사용자와 레시피로 즐겨찾기 찾기
    Optional<RecipeFavorite> findByUserAndRecipe(User user, Recipe recipe);
    
    // 사용자와 레시피로 즐겨찾기 존재 여부 확인
    boolean existsByUserAndRecipe(User user, Recipe recipe);
    
    // 사용자의 즐겨찾기 목록 (페이지네이션)
    Page<RecipeFavorite> findByUserOrderByCreatedAtDesc(User user, Pageable pageable);
    
    // 사용자의 즐겨찾기 개수
    long countByUser(User user);
    
    // 레시피의 즐겨찾기 개수
    long countByRecipe(Recipe recipe);
    
    // 사용자 ID와 레시피 ID로 즐겨찾기 찾기
    @Query("SELECT rf FROM RecipeFavorite rf WHERE rf.user.id = :userId AND rf.recipe.id = :recipeId")
    Optional<RecipeFavorite> findByUserIdAndRecipeId(@Param("userId") Long userId, @Param("recipeId") Long recipeId);
    
    // 사용자 ID와 레시피 ID로 즐겨찾기 존재 여부 확인
    @Query("SELECT COUNT(rf) > 0 FROM RecipeFavorite rf WHERE rf.user.id = :userId AND rf.recipe.id = :recipeId")
    boolean existsByUserIdAndRecipeId(@Param("userId") Long userId, @Param("recipeId") Long recipeId);
}







