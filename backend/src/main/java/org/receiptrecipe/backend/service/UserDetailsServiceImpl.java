package org.receiptrecipe.backend.service;

import org.receiptrecipe.backend.entity.User;
import org.receiptrecipe.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    
    @Autowired
    UserRepository userRepository;
    
    @Override
    @Transactional
    public UserDetails loadUserByUsername(String usernameOrEmail) throws UsernameNotFoundException {
        User user = userRepository.findByUsernameOrEmail(usernameOrEmail, usernameOrEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found with username or email: " + usernameOrEmail));
        
        return UserPrincipal.create(user);
    }
    
    @Transactional
    public UserDetails loadUserById(Long id) {
        User user = userRepository.findById(id).orElseThrow(
                () -> new UsernameNotFoundException("User not found with id: " + id)
        );
        
        return UserPrincipal.create(user);
    }
    
    public static class UserPrincipal implements UserDetails {
        private Long id;
        private String username;
        private String email;
        private String password;
        private Boolean isEnabled;
        private Collection<? extends GrantedAuthority> authorities;
        
        public UserPrincipal(Long id, String username, String email, String password, 
                           Boolean isEnabled, Collection<? extends GrantedAuthority> authorities) {
            this.id = id;
            this.username = username;
            this.email = email;
            this.password = password;
            this.isEnabled = isEnabled;
            this.authorities = authorities;
        }
        
        public static UserPrincipal create(User user) {
            List<GrantedAuthority> authorities = user.getRoles().stream().map(role ->
                    new SimpleGrantedAuthority(role.getName().name())
            ).collect(Collectors.toList());
            
            return new UserPrincipal(
                    user.getId(),
                    user.getUsername(),
                    user.getEmail(),
                    user.getPassword(),
                    user.getIsEnabled(),
                    authorities
            );
        }
        
        public Long getId() {
            return id;
        }
        
        public String getEmail() {
            return email;
        }
        
        @Override
        public String getUsername() {
            return username;
        }
        
        @Override
        public String getPassword() {
            return password;
        }
        
        @Override
        public Collection<? extends GrantedAuthority> getAuthorities() {
            return authorities;
        }
        
        @Override
        public boolean isAccountNonExpired() {
            return true;
        }
        
        @Override
        public boolean isAccountNonLocked() {
            return true;
        }
        
        @Override
        public boolean isCredentialsNonExpired() {
            return true;
        }
        
        @Override
        public boolean isEnabled() {
            return isEnabled;
        }
    }
}


