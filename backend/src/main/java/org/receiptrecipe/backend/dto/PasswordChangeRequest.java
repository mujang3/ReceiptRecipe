package org.receiptrecipe.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class PasswordChangeRequest {
    
    @NotBlank(message = "현재 비밀번호는 필수입니다")
    private String currentPassword;
    
    @NotBlank(message = "새 비밀번호는 필수입니다")
    @Size(min = 6, max = 40, message = "새 비밀번호는 6자 이상 40자 이하여야 합니다")
    private String newPassword;
    
    @NotBlank(message = "비밀번호 확인은 필수입니다")
    private String confirmPassword;
    
    // Constructors
    public PasswordChangeRequest() {}
    
    public PasswordChangeRequest(String currentPassword, String newPassword, String confirmPassword) {
        this.currentPassword = currentPassword;
        this.newPassword = newPassword;
        this.confirmPassword = confirmPassword;
    }
    
    // Getters and Setters
    public String getCurrentPassword() {
        return currentPassword;
    }
    
    public void setCurrentPassword(String currentPassword) {
        this.currentPassword = currentPassword;
    }
    
    public String getNewPassword() {
        return newPassword;
    }
    
    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
    
    public String getConfirmPassword() {
        return confirmPassword;
    }
    
    public void setConfirmPassword(String confirmPassword) {
        this.confirmPassword = confirmPassword;
    }
}


