package org.receiptrecipe.backend.controller;

import org.receiptrecipe.backend.entity.Comment;
import org.receiptrecipe.backend.dto.CommentRequest;
import org.receiptrecipe.backend.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/comments")
@CrossOrigin(origins = "*")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @GetMapping("/post/{postId}")
    public ResponseEntity<List<Comment>> getCommentsByPostId(@PathVariable Long postId) {
        try {
            List<Comment> comments = commentService.getCommentsByPostId(postId);
            return ResponseEntity.ok(comments);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping
    public ResponseEntity<?> createComment(@RequestBody CommentRequest commentRequest) {
        try {
            Comment savedComment = commentService.createComment(commentRequest);
            return ResponseEntity.ok(savedComment);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "댓글 생성에 실패했습니다: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Comment> updateComment(@PathVariable Long id, @RequestBody Comment comment) {
        try {
            Comment updatedComment = commentService.updateComment(id, comment);
            return updatedComment != null ? ResponseEntity.ok(updatedComment) : ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long id) {
        try {
            commentService.deleteComment(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<Map<String, Object>> likeComment(@PathVariable Long id) {
        try {
            Comment comment = commentService.likeComment(id);
            Map<String, Object> response = new HashMap<>();
            response.put("likeCount", comment.getLikeCount());
            response.put("message", "댓글에 좋아요를 눌렀습니다.");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "좋아요 처리에 실패했습니다: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}
