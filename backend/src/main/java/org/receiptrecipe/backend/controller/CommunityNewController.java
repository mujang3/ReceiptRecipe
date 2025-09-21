package org.receiptrecipe.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/community-new")
@CrossOrigin(origins = "*")
public class CommunityNewController {

    @Autowired
    private DataSource dataSource;

    @GetMapping("/posts")
    public ResponseEntity<?> getAllPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            List<Map<String, Object>> posts = new ArrayList<>();
            
            // 직접 SQL 쿼리로 데이터 가져오기 (Jackson 직렬화 문제 회피)
            String sql = "SELECT p.id, p.title, p.content, p.created_at, p.updated_at, " +
                        "p.view_count, p.like_count, p.comment_count, p.status, " +
                        "u.display_name as author_name, u.avatar_url as author_avatar " +
                        "FROM posts p " +
                        "JOIN users u ON p.author_id = u.id " +
                        "WHERE p.status = 'PUBLISHED' " +
                        "ORDER BY p.created_at DESC " +
                        "LIMIT ? OFFSET ?";
            
            try (Connection conn = dataSource.getConnection();
                 PreparedStatement stmt = conn.prepareStatement(sql)) {
                
                stmt.setInt(1, size);
                stmt.setInt(2, page * size);
                
                try (ResultSet rs = stmt.executeQuery()) {
                    while (rs.next()) {
                        Map<String, Object> post = new HashMap<>();
                        post.put("id", rs.getLong("id"));
                        post.put("title", rs.getString("title"));
                        post.put("content", rs.getString("content"));
                        post.put("createdAt", rs.getTimestamp("created_at"));
                        post.put("updatedAt", rs.getTimestamp("updated_at"));
                        post.put("viewCount", rs.getInt("view_count"));
                        post.put("likeCount", rs.getInt("like_count"));
                        post.put("commentCount", rs.getInt("comment_count"));
                        post.put("status", rs.getString("status"));
                        post.put("authorName", rs.getString("author_name"));
                        post.put("authorAvatarUrl", rs.getString("author_avatar"));
                        
                        posts.add(post);
                    }
                }
            }
            
            // 총 개수 조회
            String countSql = "SELECT COUNT(*) FROM posts WHERE status = 'PUBLISHED'";
            long totalElements = 0;
            try (Connection conn = dataSource.getConnection();
                 PreparedStatement stmt = conn.prepareStatement(countSql);
                 ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    totalElements = rs.getLong(1);
                }
            }
            
            // Page 형태로 응답 구성
            Map<String, Object> response = new HashMap<>();
            response.put("content", posts);
            response.put("pageable", Map.of(
                "pageNumber", page,
                "pageSize", size,
                "offset", page * size
            ));
            response.put("totalElements", totalElements);
            response.put("totalPages", (totalElements + size - 1) / size);
            response.put("last", (page + 1) * size >= totalElements);
            response.put("first", page == 0);
            response.put("numberOfElements", posts.size());
            response.put("size", size);
            response.put("number", page);
            response.put("empty", posts.isEmpty());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "게시글을 불러오는데 실패했습니다: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}
