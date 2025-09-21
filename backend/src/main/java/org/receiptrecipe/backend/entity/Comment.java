package org.receiptrecipe.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "comments")
public class Comment {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank
    @Column(name = "content", columnDefinition = "TEXT", nullable = false)
    private String content;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    @JsonBackReference
    private Post post;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id", nullable = false)
    private User author;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_comment_id")
    private Comment parentComment;
    
    @OneToMany(mappedBy = "parentComment", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private java.util.List<Comment> replies = new java.util.ArrayList<>();
    
    @Column(name = "like_count")
    private Integer likeCount = 0;
    
    @Column(name = "reply_count")
    private Integer replyCount = 0;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // 프론트엔드에서 필요한 author 정보를 위한 필드들
    @Transient
    private String authorName;
    
    @Transient
    private String authorAvatarUrl;
    
    @Transient
    private Long authorId;
    
    // Constructors
    public Comment() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    public Comment(String content, Post post, User author) {
        this();
        this.content = content;
        this.post = post;
        this.author = author;
    }
    
    public Comment(String content, Post post, User author, Comment parentComment) {
        this(content, post, author);
        this.parentComment = parentComment;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getContent() {
        return content;
    }
    
    public void setContent(String content) {
        this.content = content;
    }
    
    public Post getPost() {
        return post;
    }
    
    public void setPost(Post post) {
        this.post = post;
    }
    
    public User getAuthor() {
        return author;
    }
    
    public void setAuthor(User author) {
        this.author = author;
        if (author != null) {
            this.authorId = author.getId();
            this.authorName = author.getDisplayName();
            this.authorAvatarUrl = author.getAvatarUrl();
        }
    }
    
    public Comment getParentComment() {
        return parentComment;
    }
    
    public void setParentComment(Comment parentComment) {
        this.parentComment = parentComment;
    }
    
    public java.util.List<Comment> getReplies() {
        return replies;
    }
    
    public void setReplies(java.util.List<Comment> replies) {
        this.replies = replies;
    }
    
    public Integer getLikeCount() {
        return likeCount;
    }
    
    public void setLikeCount(Integer likeCount) {
        this.likeCount = likeCount;
    }
    
    public Integer getReplyCount() {
        return replyCount;
    }
    
    public void setReplyCount(Integer replyCount) {
        this.replyCount = replyCount;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    public String getAuthorName() {
        return authorName;
    }
    
    public void setAuthorName(String authorName) {
        this.authorName = authorName;
    }
    
    public String getAuthorAvatarUrl() {
        return authorAvatarUrl;
    }
    
    public void setAuthorAvatarUrl(String authorAvatarUrl) {
        this.authorAvatarUrl = authorAvatarUrl;
    }
    
    public Long getAuthorId() {
        return authorId;
    }
    
    public void setAuthorId(Long authorId) {
        this.authorId = authorId;
    }
    
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}


