package org.receiptrecipe.backend.repository;

import org.receiptrecipe.backend.entity.Receipt;
import org.receiptrecipe.backend.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReceiptRepository extends JpaRepository<Receipt, Long> {
    
    List<Receipt> findByStoreNameContainingIgnoreCase(String storeName);
    
    List<Receipt> findByPurchaseDateBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    List<Receipt> findByTotalAmountBetween(Double minAmount, Double maxAmount);
    
    @Query("SELECT r FROM Receipt r WHERE r.storeName LIKE %:keyword% OR r.rawOcrText LIKE %:keyword%")
    List<Receipt> findByKeyword(@Param("keyword") String keyword);
    
    @Query("SELECT r FROM Receipt r JOIN r.items i WHERE i.isIngredient = true")
    List<Receipt> findReceiptsWithIngredients();
    
    @Query("SELECT DISTINCT r.storeName FROM Receipt r ORDER BY r.storeName")
    List<String> findDistinctStoreNames();
    
    List<Receipt> findByUserId(Long userId);
    
    // 사용자별 영수증 조회 (페이지네이션)
    Page<Receipt> findByUserOrderByCreatedAtDesc(User user, Pageable pageable);
    
    // 사용자별 영수증 조회 (매장명 검색)
    Page<Receipt> findByUserAndStoreNameContainingIgnoreCase(User user, String storeName, Pageable pageable);
    
    // 특정 사용자의 특정 영수증 조회
    Optional<Receipt> findByIdAndUser(Long id, User user);
    
    // 사용자별 고유 매장명 조회
    @Query("SELECT DISTINCT r.storeName FROM Receipt r WHERE r.user = :user ORDER BY r.storeName")
    List<String> findDistinctStoreNamesByUser(@Param("user") User user);
}
