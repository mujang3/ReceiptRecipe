package org.receiptrecipe.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class SignupRequest {
    
    @NotBlank(message = "사용자명은 필수입니다")
    @Size(min = 3, max = 20, message = "사용자명은 3자 이상 20자 이하여야 합니다")
    private String username;
    
    @NotBlank(message = "이메일은 필수입니다")
    @Size(max = 50)
    @Email(message = "올바른 이메일 형식이 아닙니다")
    private String email;
    
    @NotBlank(message = "비밀번호는 필수입니다")
    @Size(min = 6, max = 40, message = "비밀번호는 6자 이상 40자 이하여야 합니다")
    private String password;
    
    @Size(max = 50, message = "표시명은 50자 이하여야 합니다")
    private String displayName;
    
    @NotBlank(message = "비밀번호 확인은 필수입니다")
    private String confirmPassword;
    
    // Constructors
    public SignupRequest() {}
    
    public SignupRequest(String username, String email, String password, String displayName, String confirmPassword) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.displayName = displayName;
        this.confirmPassword = confirmPassword;
    }
    
    // Getters and Setters
    public String getUsername() {
        return username;
    }
    
    public void setUsername(String username) {
        this.username = username;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getPassword() {
        return password;
    }
    
    public void setPassword(String password) {
        this.password = password;
    }
    
    public String getDisplayName() {
        return displayName;
    }
    
    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }
    
    public String getConfirmPassword() {
        return confirmPassword;
    }
    
    public void setConfirmPassword(String confirmPassword) {
        this.confirmPassword = confirmPassword;
    }
}


