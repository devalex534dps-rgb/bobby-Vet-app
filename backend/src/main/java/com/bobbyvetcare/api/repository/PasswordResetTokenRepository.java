package com.bobbyvetcare.api.repository;

import com.bobbyvetcare.api.entity.PasswordResetTokenEntity;
import java.time.LocalDateTime;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetTokenEntity, String> {

    @EntityGraph(attributePaths = "usuario")
    Optional<PasswordResetTokenEntity> findByToken(String token);

    void deleteByExpiresAtBefore(LocalDateTime cutoff);
}
