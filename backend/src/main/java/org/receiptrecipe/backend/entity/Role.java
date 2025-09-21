package org.receiptrecipe.backend.entity;

import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "roles")
public class Role {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "name", unique = true, nullable = false)
    private RoleName name;
    
    @Column(name = "description")
    private String description;
    
    @ManyToMany(mappedBy = "roles", fetch = FetchType.LAZY)
    @JsonIgnore
    private Set<User> users = new HashSet<>();
    
    // Constructors
    public Role() {}
    
    public Role(RoleName name) {
        this.name = name;
    }
    
    public Role(RoleName name, String description) {
        this.name = name;
        this.description = description;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public RoleName getName() {
        return name;
    }
    
    public void setName(RoleName name) {
        this.name = name;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public Set<User> getUsers() {
        return users;
    }
    
    public void setUsers(Set<User> users) {
        this.users = users;
    }
    
    public enum RoleName {
        ROLE_USER,
        ROLE_ADMIN,
        ROLE_MODERATOR
    }
}


