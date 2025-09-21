package org.receiptrecipe.backend.repository;

import org.receiptrecipe.backend.entity.Comment;
import org.receiptrecipe.backend.entity.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    
    Page<Comment> findByPostOrderByCreatedAtAsc(Post post, Pageable pageable);
    
    List<Comment> findByPostAndParentCommentIsNullOrderByCreatedAtAsc(Post post);
    
    List<Comment> findByParentCommentOrderByCreatedAtAsc(Comment parentComment);
    
    long countByPost(Post post);
    
    long countByParentComment(Comment parentComment);
    
    @Query("SELECT c FROM Comment c WHERE c.post = :post AND c.parentComment IS NULL ORDER BY c.createdAt ASC")
    List<Comment> findRootCommentsByPost(@Param("post") Post post);
    
    @Query("SELECT c FROM Comment c WHERE c.parentComment = :parentComment ORDER BY c.createdAt ASC")
    List<Comment> findRepliesByParentComment(@Param("parentComment") Comment parentComment);
    
    List<Comment> findByPostIdOrderByCreatedAtAsc(Long postId);
    
    @Query("SELECT c FROM Comment c JOIN FETCH c.author WHERE c.post.id = :postId ORDER BY c.createdAt ASC")
    List<Comment> findByPostIdOrderByCreatedAtAscWithAuthor(@Param("postId") Long postId);
}


