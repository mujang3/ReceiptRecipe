package org.receiptrecipe.backend.controller;

import org.receiptrecipe.backend.dto.JwtResponse;
import org.receiptrecipe.backend.dto.LoginRequest;
import org.receiptrecipe.backend.dto.SignupRequest;
import org.receiptrecipe.backend.entity.User;
import org.receiptrecipe.backend.service.AuthService;
import org.receiptrecipe.backend.service.UserDetailsServiceImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    @Autowired
    AuthenticationManager authenticationManager;
    
    @Autowired
    AuthService authService;
    
    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            // username 필드가 있으면 usernameOrEmail에 설정
            if (loginRequest.getUsername() != null && !loginRequest.getUsername().isEmpty()) {
                loginRequest.setUsernameOrEmail(loginRequest.getUsername());
            }
            
            JwtResponse jwtResponse = authService.authenticateUser(loginRequest);
            return ResponseEntity.ok(jwtResponse);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "로그인에 실패했습니다: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        try {
            // 비밀번호 확인 검증
            if (!signUpRequest.getPassword().equals(signUpRequest.getConfirmPassword())) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "비밀번호와 비밀번호 확인이 일치하지 않습니다.");
                return ResponseEntity.badRequest().body(error);
            }
            
            User user = authService.registerUser(signUpRequest);
            Map<String, String> response = new HashMap<>();
            response.put("message", "사용자가 성공적으로 등록되었습니다!");
            response.put("username", user.getUsername());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @PostMapping("/signout")
    public ResponseEntity<?> logoutUser() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "로그아웃되었습니다!");
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        if (authentication == null) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "인증되지 않은 사용자입니다.");
            return ResponseEntity.status(401).body(error);
        }
        
        UserDetailsServiceImpl.UserPrincipal userPrincipal = (UserDetailsServiceImpl.UserPrincipal) authentication.getPrincipal();
        
        // 사용자 정보를 데이터베이스에서 가져와서 완전한 정보 제공
        User user = authService.getUserById(userPrincipal.getId());
        if (user == null) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "사용자 정보를 찾을 수 없습니다.");
            return ResponseEntity.status(404).body(error);
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("id", user.getId());
        response.put("username", user.getUsername());
        response.put("email", user.getEmail());
        response.put("displayName", user.getDisplayName());
        
        // 역할 정보 추가
        List<String> roles = user.getRoles().stream()
            .map(role -> role.getName().name())
            .collect(Collectors.toList());
        response.put("roles", roles);
        
        return ResponseEntity.ok(response);
    }
}


