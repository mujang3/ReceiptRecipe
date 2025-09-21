package org.receiptrecipe.backend.controller;

import org.receiptrecipe.backend.dto.CommentRequest;
import org.receiptrecipe.backend.dto.PostRequest;
import org.receiptrecipe.backend.dto.PostResponse;
import org.receiptrecipe.backend.entity.Comment;
import org.receiptrecipe.backend.entity.Post;
import org.receiptrecipe.backend.entity.User;
import org.receiptrecipe.backend.repository.UserRepository;
import org.receiptrecipe.backend.service.CommunityService;
import org.receiptrecipe.backend.service.UserDetailsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/community")
public class CommunityController {
    
    @Autowired
    private CommunityService communityService;
    
    @Autowired
    private UserRepository userRepository;
    
    // Post 관련 엔드포인트들
    @GetMapping("/posts")
    public ResponseEntity<?> getAllPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Page<Post> posts = communityService.getAllPosts(page, size);
            Page<PostResponse> postResponses = posts.map(PostResponse::from);
            return ResponseEntity.ok(postResponses);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "게시글을 불러오는데 실패했습니다: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @GetMapping("/posts/search")
    public ResponseEntity<?> searchPosts(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Page<Post> posts = communityService.searchPosts(keyword, page, size);
            return ResponseEntity.ok(posts);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "게시글 검색에 실패했습니다: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @GetMapping("/posts/{id}")
    public ResponseEntity<?> getPostById(@PathVariable Long id) {
        try {
            Post post = communityService.getPostById(id);
            return ResponseEntity.ok(post);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "게시글을 불러오는데 실패했습니다: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @PostMapping("/posts")
    public ResponseEntity<?> createPost(@RequestBody PostRequest postRequest, Authentication authentication) {
        try {
            UserDetailsServiceImpl.UserPrincipal userPrincipal = (UserDetailsServiceImpl.UserPrincipal) authentication.getPrincipal();
            User user = userRepository.findById(userPrincipal.getId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            Post post = communityService.createPost(postRequest, user);
            return ResponseEntity.ok(post);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "게시글 작성에 실패했습니다: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @PutMapping("/posts/{id}")
    public ResponseEntity<?> updatePost(@PathVariable Long id, @RequestBody PostRequest postRequest, Authentication authentication) {
        try {
            UserDetailsServiceImpl.UserPrincipal userPrincipal = (UserDetailsServiceImpl.UserPrincipal) authentication.getPrincipal();
            User user = userRepository.findById(userPrincipal.getId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            Post post = communityService.updatePost(id, postRequest, user);
            return ResponseEntity.ok(post);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "게시글 수정에 실패했습니다: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @DeleteMapping("/posts/{id}")
    public ResponseEntity<?> deletePost(@PathVariable Long id, Authentication authentication) {
        try {
            UserDetailsServiceImpl.UserPrincipal userPrincipal = (UserDetailsServiceImpl.UserPrincipal) authentication.getPrincipal();
            User user = userRepository.findById(userPrincipal.getId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            communityService.deletePost(id, user);
            Map<String, String> response = new HashMap<>();
            response.put("message", "게시글이 성공적으로 삭제되었습니다.");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "게시글 삭제에 실패했습니다: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @GetMapping("/posts/popular")
    public ResponseEntity<?> getPopularPosts() {
        try {
            List<Post> posts = communityService.getPopularPosts();
            return ResponseEntity.ok(posts);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "인기 게시글을 불러오는데 실패했습니다: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @GetMapping("/posts/most-viewed")
    public ResponseEntity<?> getMostViewedPosts() {
        try {
            List<Post> posts = communityService.getMostViewedPosts();
            return ResponseEntity.ok(posts);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "조회수 높은 게시글을 불러오는데 실패했습니다: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    // Comment 관련 엔드포인트들
    
    @PostMapping("/posts/{postId}/comments")
    public ResponseEntity<?> createComment(@PathVariable Long postId, @RequestBody CommentRequest commentRequest, Authentication authentication) {
        try {
            UserDetailsServiceImpl.UserPrincipal userPrincipal = (UserDetailsServiceImpl.UserPrincipal) authentication.getPrincipal();
            User user = userRepository.findById(userPrincipal.getId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            Comment comment = communityService.createComment(postId, commentRequest, user);
            return ResponseEntity.ok(comment);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "댓글 작성에 실패했습니다: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @PutMapping("/comments/{id}")
    public ResponseEntity<?> updateComment(@PathVariable Long id, @RequestBody CommentRequest commentRequest, Authentication authentication) {
        try {
            UserDetailsServiceImpl.UserPrincipal userPrincipal = (UserDetailsServiceImpl.UserPrincipal) authentication.getPrincipal();
            User user = userRepository.findById(userPrincipal.getId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            Comment comment = communityService.updateComment(id, commentRequest, user);
            return ResponseEntity.ok(comment);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "댓글 수정에 실패했습니다: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @DeleteMapping("/comments/{id}")
    public ResponseEntity<?> deleteComment(@PathVariable Long id, Authentication authentication) {
        try {
            UserDetailsServiceImpl.UserPrincipal userPrincipal = (UserDetailsServiceImpl.UserPrincipal) authentication.getPrincipal();
            User user = userRepository.findById(userPrincipal.getId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            communityService.deleteComment(id, user);
            Map<String, String> response = new HashMap<>();
            response.put("message", "댓글이 성공적으로 삭제되었습니다.");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "댓글 삭제에 실패했습니다: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    // Like 관련 엔드포인트들
    @PostMapping("/posts/{postId}/like")
    public ResponseEntity<?> togglePostLike(@PathVariable Long postId, Authentication authentication) {
        try {
            UserDetailsServiceImpl.UserPrincipal userPrincipal = (UserDetailsServiceImpl.UserPrincipal) authentication.getPrincipal();
            User user = userRepository.findById(userPrincipal.getId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            boolean isLiked = communityService.togglePostLike(postId, user);
            Map<String, Object> response = new HashMap<>();
            response.put("isLiked", isLiked);
            response.put("message", isLiked ? "좋아요를 눌렀습니다." : "좋아요를 취소했습니다.");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "좋아요 처리에 실패했습니다: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @GetMapping("/posts/{postId}/like-status")
    public ResponseEntity<?> getPostLikeStatus(@PathVariable Long postId, Authentication authentication) {
        try {
            UserDetailsServiceImpl.UserPrincipal userPrincipal = (UserDetailsServiceImpl.UserPrincipal) authentication.getPrincipal();
            User user = userRepository.findById(userPrincipal.getId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            boolean isLiked = communityService.isPostLikedByUser(postId, user);
            Map<String, Boolean> response = new HashMap<>();
            response.put("isLiked", isLiked);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "좋아요 상태를 확인하는데 실패했습니다: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    // 댓글 조회 엔드포인트 추가
    @GetMapping("/posts/{postId}/comments")
    public ResponseEntity<?> getCommentsByPostId(
            @PathVariable Long postId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            List<Comment> comments = communityService.getCommentsByPostId(postId);
            Map<String, Object> response = new HashMap<>();
            response.put("content", comments);
            response.put("totalElements", comments.size());
            response.put("totalPages", 1);
            response.put("size", size);
            response.put("number", page);
            response.put("first", true);
            response.put("last", true);
            response.put("numberOfElements", comments.size());
            response.put("empty", comments.isEmpty());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "댓글을 불러오는데 실패했습니다: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}
