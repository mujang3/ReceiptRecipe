package org.receiptrecipe.backend.controller;

import org.receiptrecipe.backend.dto.PasswordChangeRequest;
import org.receiptrecipe.backend.dto.ProfileUpdateRequest;
import org.receiptrecipe.backend.entity.Post;
import org.receiptrecipe.backend.entity.User;
import org.receiptrecipe.backend.repository.PostRepository;
import org.receiptrecipe.backend.repository.UserRepository;
import org.receiptrecipe.backend.service.UserDetailsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/profile")
public class ProfileController {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PostRepository postRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUserProfile(Authentication authentication) {
        try {
            UserDetailsServiceImpl.UserPrincipal userPrincipal = (UserDetailsServiceImpl.UserPrincipal) authentication.getPrincipal();
            User user = userRepository.findById(userPrincipal.getId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            Map<String, Object> profile = new HashMap<>();
            profile.put("id", user.getId());
            profile.put("username", user.getUsername());
            profile.put("email", user.getEmail());
            profile.put("displayName", user.getDisplayName());
            profile.put("avatarUrl", user.getAvatarUrl());
            profile.put("preferences", user.getPreferences());
            profile.put("createdAt", user.getCreatedAt());
            profile.put("updatedAt", user.getUpdatedAt());
            
            return ResponseEntity.ok(profile);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "프로필을 불러오는데 실패했습니다: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @PutMapping("/me")
    public ResponseEntity<?> updateProfile(@RequestBody ProfileUpdateRequest request, Authentication authentication) {
        try {
            UserDetailsServiceImpl.UserPrincipal userPrincipal = (UserDetailsServiceImpl.UserPrincipal) authentication.getPrincipal();
            User user = userRepository.findById(userPrincipal.getId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            // 이메일 중복 확인 (다른 사용자가 사용 중인지)
            if (request.getEmail() != null && !request.getEmail().equals(user.getEmail())) {
                if (userRepository.existsByEmail(request.getEmail())) {
                    Map<String, String> error = new HashMap<>();
                    error.put("error", "이미 사용 중인 이메일입니다.");
                    return ResponseEntity.badRequest().body(error);
                }
                user.setEmail(request.getEmail());
            }
            
            if (request.getDisplayName() != null) {
                user.setDisplayName(request.getDisplayName());
            }
            
            if (request.getAvatarUrl() != null) {
                user.setAvatarUrl(request.getAvatarUrl());
            }
            
            if (request.getPreferences() != null) {
                user.setPreferences(request.getPreferences());
            }
            
            User updatedUser = userRepository.save(user);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "프로필이 성공적으로 업데이트되었습니다.");
            response.put("user", updatedUser);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "프로필 업데이트에 실패했습니다: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @PutMapping("/password")
    public ResponseEntity<?> changePassword(@RequestBody PasswordChangeRequest request, Authentication authentication) {
        try {
            UserDetailsServiceImpl.UserPrincipal userPrincipal = (UserDetailsServiceImpl.UserPrincipal) authentication.getPrincipal();
            User user = userRepository.findById(userPrincipal.getId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            // 현재 비밀번호 확인
            if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "현재 비밀번호가 일치하지 않습니다.");
                return ResponseEntity.badRequest().body(error);
            }
            
            // 새 비밀번호와 확인 비밀번호 일치 확인
            if (!request.getNewPassword().equals(request.getConfirmPassword())) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "새 비밀번호와 확인 비밀번호가 일치하지 않습니다.");
                return ResponseEntity.badRequest().body(error);
            }
            
            // 비밀번호 업데이트
            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
            userRepository.save(user);
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "비밀번호가 성공적으로 변경되었습니다.");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "비밀번호 변경에 실패했습니다: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @GetMapping("/posts")
    public ResponseEntity<?> getUserPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {
        try {
            UserDetailsServiceImpl.UserPrincipal userPrincipal = (UserDetailsServiceImpl.UserPrincipal) authentication.getPrincipal();
            User user = userRepository.findById(userPrincipal.getId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            PageRequest pageRequest = PageRequest.of(page, size);
            Page<Post> posts = postRepository.findByAuthorAndStatusOrderByCreatedAtDesc(user, Post.PostStatus.PUBLISHED, pageRequest);
            
            return ResponseEntity.ok(posts);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "게시글을 불러오는데 실패했습니다: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @GetMapping("/stats")
    public ResponseEntity<?> getUserStats(Authentication authentication) {
        try {
            UserDetailsServiceImpl.UserPrincipal userPrincipal = (UserDetailsServiceImpl.UserPrincipal) authentication.getPrincipal();
            User user = userRepository.findById(userPrincipal.getId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            Map<String, Object> stats = new HashMap<>();
            
            // 게시글 통계
            long postCount = postRepository.countByAuthorAndStatus(user, Post.PostStatus.PUBLISHED);
            stats.put("postCount", postCount);
            
            // 최근 작성한 게시글들
            PageRequest pageRequest = PageRequest.of(0, 5);
            Page<Post> recentPosts = postRepository.findByAuthorAndStatusOrderByCreatedAtDesc(user, Post.PostStatus.PUBLISHED, pageRequest);
            stats.put("recentPosts", recentPosts.getContent());
            
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "통계를 불러오는데 실패했습니다: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}


