package com.bobbyvetcare.api.repository;

import com.bobbyvetcare.api.entity.TokenBlacklistEntity;
import java.time.LocalDateTime;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TokenBlacklistRepository extends JpaRepository<TokenBlacklistEntity, String> {

    boolean existsByTokenJti(String tokenJti);

    void deleteByExpiresAtBefore(LocalDateTime cutoff);
}
