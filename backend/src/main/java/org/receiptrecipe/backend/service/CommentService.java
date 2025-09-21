package org.receiptrecipe.backend.service;

import org.receiptrecipe.backend.entity.Comment;
import org.receiptrecipe.backend.entity.Post;
import org.receiptrecipe.backend.entity.User;
import org.receiptrecipe.backend.dto.CommentRequest;
import org.receiptrecipe.backend.repository.CommentRepository;
import org.receiptrecipe.backend.repository.PostRepository;
import org.receiptrecipe.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;
    
    @Autowired
    private PostRepository postRepository;
    
    @Autowired
    private UserRepository userRepository;

    public List<Comment> getCommentsByPostId(Long postId) {
        List<Comment> comments = commentRepository.findByPostIdOrderByCreatedAtAsc(postId);
        
        // author 정보를 명시적으로 로드하고 authorName, authorAvatarUrl 설정
        comments.forEach(comment -> {
            if (comment.getAuthor() != null && comment.getAuthor().getId() != null) {
                User author = userRepository.findById(comment.getAuthor().getId()).orElse(null);
                if (author != null) {
                    comment.setAuthor(author); // author 객체를 완전히 로드
                    comment.setAuthorId(author.getId());
                    comment.setAuthorName(author.getDisplayName());
                    comment.setAuthorAvatarUrl(author.getAvatarUrl());
                }
            }
        });
        
        return comments;
    }

    public Comment createComment(Comment comment) {
        // Post 엔티티 로드
        if (comment.getPost() != null && comment.getPost().getId() != null) {
            Post post = postRepository.findById(comment.getPost().getId()).orElse(null);
            if (post == null) {
                throw new RuntimeException("포스트를 찾을 수 없습니다.");
            }
            comment.setPost(post);
        } else {
            throw new RuntimeException("포스트 ID가 필요합니다.");
        }
        
        // User 엔티티 로드
        if (comment.getAuthor() != null && comment.getAuthor().getId() != null) {
            User author = userRepository.findById(comment.getAuthor().getId()).orElse(null);
            if (author == null) {
                throw new RuntimeException("사용자를 찾을 수 없습니다.");
            }
            comment.setAuthor(author);
        } else {
            throw new RuntimeException("작성자 ID가 필요합니다.");
        }
        
        comment.setCreatedAt(LocalDateTime.now());
        comment.setUpdatedAt(LocalDateTime.now());
        
        // 부모 댓글이 있는 경우 부모 댓글의 답글 수 증가
        if (comment.getParentComment() != null && comment.getParentComment().getId() != null) {
            Comment parentComment = commentRepository.findById(comment.getParentComment().getId()).orElse(null);
            if (parentComment != null) {
                parentComment.setReplyCount(parentComment.getReplyCount() + 1);
                commentRepository.save(parentComment);
            }
        }
        
        return commentRepository.save(comment);
    }

    public Comment createComment(CommentRequest commentRequest) {
        // Post 엔티티 로드
        Post post = postRepository.findById(commentRequest.getPostId()).orElse(null);
        if (post == null) {
            throw new RuntimeException("포스트를 찾을 수 없습니다.");
        }
        
        // User 엔티티 로드
        User author = userRepository.findById(commentRequest.getAuthorId()).orElse(null);
        if (author == null) {
            throw new RuntimeException("사용자를 찾을 수 없습니다.");
        }
        
        // Comment 엔티티 생성
        Comment comment = new Comment();
        comment.setContent(commentRequest.getContent());
        comment.setPost(post);
        comment.setAuthor(author); // This will set authorName, authorAvatarUrl, and authorId
        comment.setCreatedAt(LocalDateTime.now());
        comment.setUpdatedAt(LocalDateTime.now());
        
        // 부모 댓글이 있는 경우
        if (commentRequest.getParentCommentId() != null) {
            Comment parentComment = commentRepository.findById(commentRequest.getParentCommentId()).orElse(null);
            if (parentComment != null) {
                comment.setParentComment(parentComment);
                parentComment.setReplyCount(parentComment.getReplyCount() + 1);
                commentRepository.save(parentComment);
            }
        }
        
        return commentRepository.save(comment);
    }

    public Comment updateComment(Long id, Comment commentDetails) {
        Optional<Comment> comment = commentRepository.findById(id);
        if (comment.isPresent()) {
            Comment existingComment = comment.get();
            existingComment.setContent(commentDetails.getContent());
            existingComment.setUpdatedAt(LocalDateTime.now());
            return commentRepository.save(existingComment);
        }
        return null;
    }

    public void deleteComment(Long id) {
        Optional<Comment> comment = commentRepository.findById(id);
        if (comment.isPresent()) {
            Comment commentToDelete = comment.get();
            
            // 부모 댓글이 있는 경우 부모 댓글의 답글 수 감소
            if (commentToDelete.getParentComment() != null) {
                Comment parentComment = commentToDelete.getParentComment();
                parentComment.setReplyCount(Math.max(0, parentComment.getReplyCount() - 1));
                commentRepository.save(parentComment);
            }
            
            commentRepository.deleteById(id);
        }
    }

    public Comment likeComment(Long id) {
        Optional<Comment> comment = commentRepository.findById(id);
        if (comment.isPresent()) {
            Comment existingComment = comment.get();
            existingComment.setLikeCount(existingComment.getLikeCount() + 1);
            existingComment.setUpdatedAt(LocalDateTime.now());
            return commentRepository.save(existingComment);
        }
        throw new RuntimeException("댓글을 찾을 수 없습니다.");
    }
}
