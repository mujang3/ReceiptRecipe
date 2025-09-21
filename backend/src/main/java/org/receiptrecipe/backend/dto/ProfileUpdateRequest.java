package org.receiptrecipe.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

public class ProfileUpdateRequest {
    
    @Size(max = 50, message = "표시명은 50자 이하여야 합니다")
    private String displayName;
    
    @Size(max = 50)
    @Email(message = "올바른 이메일 형식이 아닙니다")
    private String email;
    
    private String avatarUrl;
    
    private String preferences;
    
    // Constructors
    public ProfileUpdateRequest() {}
    
    public ProfileUpdateRequest(String displayName, String email, String avatarUrl, String preferences) {
        this.displayName = displayName;
        this.email = email;
        this.avatarUrl = avatarUrl;
        this.preferences = preferences;
    }
    
    // Getters and Setters
    public String getDisplayName() {
        return displayName;
    }
    
    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getAvatarUrl() {
        return avatarUrl;
    }
    
    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }
    
    public String getPreferences() {
        return preferences;
    }
    
    public void setPreferences(String preferences) {
        this.preferences = preferences;
    }
}


