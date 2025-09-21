package org.receiptrecipe.backend.entity;

import jakarta.persistence.*;
import jakarta.persistence.Transient;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "posts")
public class Post {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank
    @Size(max = 200)
    @Column(name = "title", nullable = false)
    private String title;
    
    @NotBlank
    @Column(name = "content", columnDefinition = "TEXT", nullable = false)
    private String content;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id", nullable = false)
    @JsonIgnore
    private User author;
    
    // 프론트엔드에서 필요한 author 정보를 위한 필드들
    @Transient
    private String authorName;
    
    @Transient
    private String authorAvatarUrl;
    
    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Comment> comments = new ArrayList<>();
    
    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<PostLike> likes = new ArrayList<>();
    
    @Column(name = "view_count")
    private Integer viewCount = 0;
    
    @Column(name = "like_count")
    private Integer likeCount = 0;
    
    @Column(name = "comment_count")
    private Integer commentCount = 0;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private PostStatus status = PostStatus.PUBLISHED;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Constructors
    public Post() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    public Post(String title, String content, User author) {
        this();
        this.title = title;
        this.content = content;
        this.author = author;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getContent() {
        return content;
    }
    
    public void setContent(String content) {
        this.content = content;
    }
    
    public User getAuthor() {
        return author;
    }
    
    public void setAuthor(User author) {
        this.author = author;
        if (author != null) {
            this.authorName = author.getDisplayName();
            this.authorAvatarUrl = author.getAvatarUrl();
        }
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
    
    public List<Comment> getComments() {
        return comments;
    }
    
    public void setComments(List<Comment> comments) {
        this.comments = comments;
    }
    
    public List<PostLike> getLikes() {
        return likes;
    }
    
    public void setLikes(List<PostLike> likes) {
        this.likes = likes;
    }
    
    public Integer getViewCount() {
        return viewCount;
    }
    
    public void setViewCount(Integer viewCount) {
        this.viewCount = viewCount;
    }
    
    public Integer getLikeCount() {
        return likeCount;
    }
    
    public void setLikeCount(Integer likeCount) {
        this.likeCount = likeCount;
    }
    
    public Integer getCommentCount() {
        return commentCount;
    }
    
    public void setCommentCount(Integer commentCount) {
        this.commentCount = commentCount;
    }
    
    public PostStatus getStatus() {
        return status;
    }
    
    public void setStatus(PostStatus status) {
        this.status = status;
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
    
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
    
    public enum PostStatus {
        DRAFT,
        PUBLISHED,
        HIDDEN,
        DELETED
    }
}


