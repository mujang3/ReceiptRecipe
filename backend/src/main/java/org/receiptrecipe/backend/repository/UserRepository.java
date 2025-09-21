package org.receiptrecipe.backend.repository;

import org.receiptrecipe.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByUsername(String username);
    
    Optional<User> findByEmail(String email);
    
    boolean existsByUsername(String username);
    
    boolean existsByEmail(String email);
    
    @Query("SELECT u FROM User u LEFT JOIN FETCH u.receipts LEFT JOIN FETCH u.recipes WHERE u.id = :id")
    Optional<User> findByIdWithRelations(@Param("id") Long id);
    
    @Query("SELECT u FROM User u LEFT JOIN FETCH u.roles WHERE u.username = :usernameOrEmail OR u.email = :usernameOrEmail")
    Optional<User> findByUsernameOrEmail(@Param("usernameOrEmail") String usernameOrEmail, @Param("usernameOrEmail") String email);
}
