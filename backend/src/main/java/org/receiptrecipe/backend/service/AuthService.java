package org.receiptrecipe.backend.service;

import org.receiptrecipe.backend.config.JwtUtils;
import org.receiptrecipe.backend.dto.JwtResponse;
import org.receiptrecipe.backend.dto.LoginRequest;
import org.receiptrecipe.backend.dto.SignupRequest;
import org.receiptrecipe.backend.entity.Role;
import org.receiptrecipe.backend.entity.User;
import org.receiptrecipe.backend.repository.RoleRepository;
import org.receiptrecipe.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AuthService {
    
    @Autowired
    AuthenticationManager authenticationManager;
    
    @Autowired
    UserRepository userRepository;
    
    @Autowired
    RoleRepository roleRepository;
    
    @Autowired
    PasswordEncoder encoder;
    
    @Autowired
    private JwtUtils jwtUtils;
    
    public JwtResponse authenticateUser(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsernameOrEmail(), loginRequest.getPassword()));
        
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);
        
        UserDetailsServiceImpl.UserPrincipal userPrincipal = (UserDetailsServiceImpl.UserPrincipal) authentication.getPrincipal();
        List<String> roles = userPrincipal.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());
        
        User user = userRepository.findByUsernameOrEmail(loginRequest.getUsernameOrEmail(), loginRequest.getUsernameOrEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return new JwtResponse(jwt,
                userPrincipal.getId(),
                userPrincipal.getUsername(),
                userPrincipal.getEmail(),
                user.getDisplayName(),
                roles);
    }
    
    public User registerUser(SignupRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            throw new RuntimeException("이미 사용 중인 사용자명입니다!");
        }
        
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            throw new RuntimeException("이미 사용 중인 이메일입니다!");
        }
        
        // Create new user's account
        User user = new User(signUpRequest.getUsername(),
                signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword()));
        
        user.setDisplayName(signUpRequest.getDisplayName() != null ? signUpRequest.getDisplayName() : signUpRequest.getUsername());
        
        Set<Role> roles = new HashSet<>();
        Role userRole = roleRepository.findByName(Role.RoleName.ROLE_USER)
                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
        roles.add(userRole);
        
        user.setRoles(roles);
        return userRepository.save(user);
    }
    
    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }
}
