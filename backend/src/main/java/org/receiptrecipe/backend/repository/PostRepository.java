package org.receiptrecipe.backend.repository;

import org.receiptrecipe.backend.entity.Post;
import org.receiptrecipe.backend.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    
    Page<Post> findByStatusOrderByCreatedAtDesc(Post.PostStatus status, Pageable pageable);
    
    Page<Post> findByAuthorAndStatusOrderByCreatedAtDesc(User author, Post.PostStatus status, Pageable pageable);
    
    @Query("SELECT p FROM Post p WHERE p.status = :status AND " +
           "(LOWER(p.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.content) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
           "ORDER BY p.createdAt DESC")
    Page<Post> findByKeywordAndStatus(@Param("keyword") String keyword, 
                                     @Param("status") Post.PostStatus status, 
                                     Pageable pageable);
    
    List<Post> findTop10ByStatusOrderByLikeCountDescCreatedAtDesc(Post.PostStatus status);
    
    @Query("SELECT p FROM Post p WHERE p.status = :status ORDER BY p.viewCount DESC")
    List<Post> findTop10ByStatusOrderByViewCountDesc(@Param("status") Post.PostStatus status, Pageable pageable);
    
    @Query("SELECT p FROM Post p JOIN FETCH p.author WHERE p.status = :status ORDER BY p.createdAt DESC")
    Page<Post> findByStatusOrderByCreatedAtDescWithAuthor(@Param("status") Post.PostStatus status, Pageable pageable);
    
    @Query("SELECT p FROM Post p WHERE p.status = :status ORDER BY p.createdAt DESC")
    Page<Post> findByStatusOrderByCreatedAtDescSimple(@Param("status") Post.PostStatus status, Pageable pageable);
    
    @Query("SELECT p FROM Post p JOIN FETCH p.author WHERE p.status = :status AND " +
           "(LOWER(p.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.content) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
           "ORDER BY p.createdAt DESC")
    Page<Post> findByKeywordAndStatusWithAuthor(@Param("keyword") String keyword, 
                                               @Param("status") Post.PostStatus status, 
                                               Pageable pageable);
    
    @Query("SELECT p FROM Post p JOIN FETCH p.author WHERE p.status = :status ORDER BY p.likeCount DESC, p.createdAt DESC")
    List<Post> findTop10ByStatusOrderByLikeCountDescCreatedAtDescWithAuthor(@Param("status") Post.PostStatus status);
    
    @Query("SELECT p FROM Post p JOIN FETCH p.author WHERE p.status = :status ORDER BY p.viewCount DESC")
    List<Post> findTop10ByStatusOrderByViewCountDescWithAuthor(@Param("status") Post.PostStatus status, Pageable pageable);
    
    long countByAuthorAndStatus(User author, Post.PostStatus status);
}


