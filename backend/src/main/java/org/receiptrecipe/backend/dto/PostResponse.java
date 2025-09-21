package org.receiptrecipe.backend.dto;

import org.receiptrecipe.backend.entity.Post;

import java.time.LocalDateTime;

public class PostResponse {
    private Long id;
    private String title;
    private String content;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long likeCount;
    private Long commentCount;
    private Long viewCount;
    private UserSummary author;

    public static class UserSummary {
        private Long id;
        private String username;
        private String displayName;
        private String avatarUrl;

        // Getters and Setters
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getDisplayName() { return displayName; }
        public void setDisplayName(String displayName) { this.displayName = displayName; }
        public String getAvatarUrl() { return avatarUrl; }
        public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }

        public static UserSummary from(org.receiptrecipe.backend.entity.User user) {
            UserSummary summary = new UserSummary();
            summary.setId(user.getId());
            summary.setUsername(user.getUsername());
            summary.setDisplayName(user.getDisplayName());
            summary.setAvatarUrl(user.getAvatarUrl());
            return summary;
        }
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    public Long getLikeCount() { return likeCount; }
    public void setLikeCount(Long likeCount) { this.likeCount = likeCount; }
    public Long getCommentCount() { return commentCount; }
    public void setCommentCount(Long commentCount) { this.commentCount = commentCount; }
    public Long getViewCount() { return viewCount; }
    public void setViewCount(Long viewCount) { this.viewCount = viewCount; }
    public UserSummary getAuthor() { return author; }
    public void setAuthor(UserSummary author) { this.author = author; }

    public static PostResponse from(Post post) {
        PostResponse response = new PostResponse();
        response.setId(post.getId());
        response.setTitle(post.getTitle());
        response.setContent(post.getContent());
        response.setStatus(post.getStatus() != null ? post.getStatus().toString() : "PUBLISHED");
        response.setCreatedAt(post.getCreatedAt());
        response.setUpdatedAt(post.getUpdatedAt());
        response.setLikeCount(post.getLikes() != null ? (long) post.getLikes().size() : 0L);
        response.setCommentCount(post.getComments() != null ? (long) post.getComments().size() : 0L);
        response.setViewCount(post.getViewCount() != null ? post.getViewCount().longValue() : 0L);
        if (post.getAuthor() != null) {
            response.setAuthor(UserSummary.from(post.getAuthor()));
        }
        return response;
    }
}