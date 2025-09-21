package org.receiptrecipe.backend.dto;

import jakarta.validation.constraints.NotBlank;

public class LoginRequest {
    
    @NotBlank(message = "사용자명 또는 이메일은 필수입니다")
    private String usernameOrEmail;
    
    @NotBlank(message = "비밀번호는 필수입니다")
    private String password;
    
    // username 필드도 추가 (프론트엔드 호환성)
    private String username;
    
    // Constructors
    public LoginRequest() {}
    
    public LoginRequest(String usernameOrEmail, String password) {
        this.usernameOrEmail = usernameOrEmail;
        this.password = password;
    }
    
    public LoginRequest(String username, String usernameOrEmail, String password) {
        this.username = username;
        this.usernameOrEmail = usernameOrEmail;
        this.password = password;
    }
    
    // Getters and Setters
    public String getUsernameOrEmail() {
        return usernameOrEmail;
    }
    
    public void setUsernameOrEmail(String usernameOrEmail) {
        this.usernameOrEmail = usernameOrEmail;
    }
    
    public String getPassword() {
        return password;
    }
    
    public void setPassword(String password) {
        this.password = password;
    }
    
    public String getUsername() {
        return username;
    }
    
    public void setUsername(String username) {
        this.username = username;
    }
}


