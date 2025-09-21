package org.receiptrecipe.backend.repository;

import org.receiptrecipe.backend.entity.Post;
import org.receiptrecipe.backend.entity.PostLike;
import org.receiptrecipe.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PostLikeRepository extends JpaRepository<PostLike, Long> {
    
    boolean existsByUserAndPost(User user, Post post);
    
    Optional<PostLike> findByUserAndPost(User user, Post post);
    
    long countByPost(Post post);
    
    void deleteByUserAndPost(User user, Post post);
}


