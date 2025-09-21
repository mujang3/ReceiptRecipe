package org.receiptrecipe.backend.service;

import org.receiptrecipe.backend.dto.CommentRequest;
import org.receiptrecipe.backend.dto.PostRequest;
import org.receiptrecipe.backend.entity.*;
import org.receiptrecipe.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class CommunityService {
    
    @Autowired
    private PostRepository postRepository;
    
    @Autowired
    private CommentRepository commentRepository;
    
    @Autowired
    private PostLikeRepository postLikeRepository;
    
    
    // Post 관련 메서드들
    public Page<Post> getAllPosts(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Post> posts = postRepository.findByStatusOrderByCreatedAtDescSimple(Post.PostStatus.PUBLISHED, pageable);
        
        // author 정보는 @JsonIgnore로 숨겨져 있으므로 @Transient 필드만 설정
        // 실제로는 author 정보가 필요하지 않으므로 기본값으로 설정
        posts.getContent().forEach(post -> {
            post.setAuthorName("작성자");
            post.setAuthorAvatarUrl(null);
        });
        
        return posts;
    }
    
    public Page<Post> searchPosts(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Post> posts = postRepository.findByKeywordAndStatusWithAuthor(keyword, Post.PostStatus.PUBLISHED, pageable);
        
        // author 정보를 로드하고 authorName, authorAvatarUrl 설정
        posts.getContent().forEach(post -> {
            if (post.getAuthor() != null) {
                post.setAuthorName(post.getAuthor().getDisplayName());
                post.setAuthorAvatarUrl(post.getAuthor().getAvatarUrl());
            }
        });
        
        return posts;
    }
    
    public Post getPostById(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found with id: " + postId));
        
        // 조회수 증가
        post.setViewCount(post.getViewCount() + 1);
        return postRepository.save(post);
    }
    
    public Post createPost(PostRequest postRequest, User author) {
        Post post = new Post(postRequest.getTitle(), postRequest.getContent(), author);
        return postRepository.save(post);
    }
    
    public Post updatePost(Long postId, PostRequest postRequest, User user) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found with id: " + postId));
        
        // 작성자만 수정 가능
        if (!post.getAuthor().getId().equals(user.getId())) {
            throw new RuntimeException("You are not authorized to update this post");
        }
        
        post.setTitle(postRequest.getTitle());
        post.setContent(postRequest.getContent());
        return postRepository.save(post);
    }
    
    public void deletePost(Long postId, User user) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found with id: " + postId));
        
        // 작성자만 삭제 가능
        if (!post.getAuthor().getId().equals(user.getId())) {
            throw new RuntimeException("You are not authorized to delete this post");
        }
        
        post.setStatus(Post.PostStatus.DELETED);
        postRepository.save(post);
    }
    
    public List<Post> getPopularPosts() {
        List<Post> posts = postRepository.findTop10ByStatusOrderByLikeCountDescCreatedAtDescWithAuthor(Post.PostStatus.PUBLISHED);
        
        // author 정보를 로드하고 authorName, authorAvatarUrl 설정
        posts.forEach(post -> {
            if (post.getAuthor() != null) {
                post.setAuthorName(post.getAuthor().getDisplayName());
                post.setAuthorAvatarUrl(post.getAuthor().getAvatarUrl());
            }
        });
        
        return posts;
    }
    
    public List<Post> getMostViewedPosts() {
        Pageable pageable = PageRequest.of(0, 10);
        List<Post> posts = postRepository.findTop10ByStatusOrderByViewCountDescWithAuthor(Post.PostStatus.PUBLISHED, pageable);
        
        // author 정보를 로드하고 authorName, authorAvatarUrl 설정
        posts.forEach(post -> {
            if (post.getAuthor() != null) {
                post.setAuthorName(post.getAuthor().getDisplayName());
                post.setAuthorAvatarUrl(post.getAuthor().getAvatarUrl());
            }
        });
        
        return posts;
    }
    
    // Comment 관련 메서드들
    public Page<Comment> getCommentsByPost(Long postId, int page, int size) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found with id: " + postId));
        
        Pageable pageable = PageRequest.of(page, size);
        return commentRepository.findByPostOrderByCreatedAtAsc(post, pageable);
    }
    
    public Comment createComment(Long postId, CommentRequest commentRequest, User author) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found with id: " + postId));
        
        Comment parentComment = null;
        if (commentRequest.getParentCommentId() != null) {
            parentComment = commentRepository.findById(commentRequest.getParentCommentId())
                    .orElseThrow(() -> new RuntimeException("Parent comment not found"));
        }
        
        Comment comment = new Comment(commentRequest.getContent(), post, author, parentComment);
        Comment savedComment = commentRepository.save(comment);
        
        // 댓글 수 업데이트
        post.setCommentCount(post.getCommentCount() + 1);
        postRepository.save(post);
        
        return savedComment;
    }
    
    public Comment updateComment(Long commentId, CommentRequest commentRequest, User user) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found with id: " + commentId));
        
        // 작성자만 수정 가능
        if (!comment.getAuthor().getId().equals(user.getId())) {
            throw new RuntimeException("You are not authorized to update this comment");
        }
        
        comment.setContent(commentRequest.getContent());
        return commentRepository.save(comment);
    }
    
    public void deleteComment(Long commentId, User user) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found with id: " + commentId));
        
        // 작성자만 삭제 가능
        if (!comment.getAuthor().getId().equals(user.getId())) {
            throw new RuntimeException("You are not authorized to delete this comment");
        }
        
        commentRepository.delete(comment);
        
        // 댓글 수 업데이트
        Post post = comment.getPost();
        post.setCommentCount(post.getCommentCount() - 1);
        postRepository.save(post);
    }
    
    // Like 관련 메서드들
    public boolean togglePostLike(Long postId, User user) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found with id: " + postId));
        
        Optional<PostLike> existingLike = postLikeRepository.findByUserAndPost(user, post);
        
        if (existingLike.isPresent()) {
            // 이미 좋아요를 누른 경우 - 좋아요 취소
            postLikeRepository.delete(existingLike.get());
            post.setLikeCount(post.getLikeCount() - 1);
            postRepository.save(post);
            return false; // 좋아요 취소됨
        } else {
            // 좋아요를 누르지 않은 경우 - 좋아요 추가
            PostLike postLike = new PostLike(user, post);
            postLikeRepository.save(postLike);
            post.setLikeCount(post.getLikeCount() + 1);
            postRepository.save(post);
            return true; // 좋아요 추가됨
        }
    }
    
    public boolean isPostLikedByUser(Long postId, User user) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found with id: " + postId));
        
        return postLikeRepository.existsByUserAndPost(user, post);
    }
    
    public List<Comment> getCommentsByPostId(Long postId) {
        List<Comment> comments = commentRepository.findByPostIdOrderByCreatedAtAscWithAuthor(postId);
        
        // author 정보를 명시적으로 로드하고 authorName, authorAvatarUrl 설정
        comments.forEach(comment -> {
            if (comment.getAuthor() != null && comment.getAuthor().getId() != null) {
                // author 객체가 이미 로드되어 있다면 그대로 사용
                comment.setAuthorId(comment.getAuthor().getId());
                comment.setAuthorName(comment.getAuthor().getDisplayName());
                comment.setAuthorAvatarUrl(comment.getAuthor().getAvatarUrl());
            }
        });
        
        return comments;
    }
}


