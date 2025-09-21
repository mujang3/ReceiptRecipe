package org.receiptrecipe.backend.repository;

import org.receiptrecipe.backend.entity.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TagRepository extends JpaRepository<Tag, Long> {
    
    Optional<Tag> findByName(String name);
    
    List<Tag> findByNameContainingIgnoreCase(String name);
    
    @Query("SELECT t FROM Tag t ORDER BY t.createdAt DESC")
    List<Tag> findAllOrderByCreatedAtDesc();
    
    @Query("SELECT t FROM Tag t LEFT JOIN FETCH t.receipts LEFT JOIN FETCH t.recipes WHERE t.id = :id")
    Optional<Tag> findByIdWithRelations(@Param("id") Long id);
}
