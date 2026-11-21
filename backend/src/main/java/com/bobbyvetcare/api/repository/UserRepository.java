package com.bobbyvetcare.api.repository;

import com.bobbyvetcare.api.entity.UserEntity;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserRepository extends JpaRepository<UserEntity, String> {

    @EntityGraph(attributePaths = "role")
    Optional<UserEntity> findByEmailIgnoreCase(String email);

    boolean existsByEmailIgnoreCase(String email);

    @EntityGraph(attributePaths = "role")
    List<UserEntity> findByRole_NameIgnoreCaseAndActiveTrueOrderByFullNameAsc(String roleName);

    @EntityGraph(attributePaths = "role")
    @Query("""
        SELECT u FROM UserEntity u
        WHERE (:roleName IS NULL OR UPPER(u.role.name) = UPPER(:roleName))
          AND (:q IS NULL OR LOWER(u.fullName) LIKE LOWER(CONCAT('%', :q, '%'))
               OR LOWER(u.email) LIKE LOWER(CONCAT('%', :q, '%')))
        ORDER BY u.createdAt DESC
        """)
    Page<UserEntity> searchUsers(
        @Param("q") String q,
        @Param("roleName") String roleName,
        Pageable pageable
    );
}
