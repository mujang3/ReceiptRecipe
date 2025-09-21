package org.receiptrecipe.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CommentRequest {
    
    @NotBlank(message = "댓글 내용은 필수입니다")
    private String content;
    
    @NotNull(message = "포스트 ID는 필수입니다")
    private Long postId;
    
    @NotNull(message = "작성자 ID는 필수입니다")
    private Long authorId;
    
    private Long parentCommentId;
    
    // Constructors
    public CommentRequest() {}
    
    public CommentRequest(String content, Long postId, Long authorId) {
        this.content = content;
        this.postId = postId;
        this.authorId = authorId;
    }
    
    // Getters and Setters
    public String getContent() {
        return content;
    }
    
    public void setContent(String content) {
        this.content = content;
    }
    
    public Long getPostId() {
        return postId;
    }
    
    public void setPostId(Long postId) {
        this.postId = postId;
    }
    
    public Long getAuthorId() {
        return authorId;
    }
    
    public void setAuthorId(Long authorId) {
        this.authorId = authorId;
    }
    
    public Long getParentCommentId() {
        return parentCommentId;
    }
    
    public void setParentCommentId(Long parentCommentId) {
        this.parentCommentId = parentCommentId;
    }
}