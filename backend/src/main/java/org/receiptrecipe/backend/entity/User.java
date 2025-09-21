package org.receiptrecipe.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "users")
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull
    @Column(name = "username", unique = true)
    private String username;
    
    @Email
    @Column(name = "email", unique = true)
    private String email;
    
    @Column(name = "password")
    private String password;
    
    @Column(name = "display_name")
    private String displayName;
    
    @Column(name = "avatar_url")
    private String avatarUrl;
    
    @Column(name = "preferences", columnDefinition = "JSON")
    @JsonIgnore
    private String preferences; // JSON string for user preferences
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Receipt> receipts;
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Recipe> recipes;
    
    @OneToMany(mappedBy = "author", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Post> posts;
    
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "user_roles",
               joinColumns = @JoinColumn(name = "user_id"),
               inverseJoinColumns = @JoinColumn(name = "role_id"))
    @JsonIgnore
    private Set<Role> roles = new HashSet<>();
    
    @Column(name = "is_enabled")
    private Boolean isEnabled = true;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Constructors
    public User() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    public User(String username, String email, String password) {
        this();
        this.username = username;
        this.email = email;
        this.password = password;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
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
    
    public List<Receipt> getReceipts() {
        return receipts;
    }
    
    public void setReceipts(List<Receipt> receipts) {
        this.receipts = receipts;
    }
    
    public List<Recipe> getRecipes() {
        return recipes;
    }
    
    public void setRecipes(List<Recipe> recipes) {
        this.recipes = recipes;
    }
    
    public List<Post> getPosts() {
        return posts;
    }
    
    public void setPosts(List<Post> posts) {
        this.posts = posts;
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
    
    public Set<Role> getRoles() {
        return roles;
    }
    
    public void setRoles(Set<Role> roles) {
        this.roles = roles;
    }
    
    public Boolean getIsEnabled() {
        return isEnabled;
    }
    
    public void setIsEnabled(Boolean isEnabled) {
        this.isEnabled = isEnabled;
    }
    
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
