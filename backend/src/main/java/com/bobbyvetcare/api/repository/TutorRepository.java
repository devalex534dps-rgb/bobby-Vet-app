package com.bobbyvetcare.api.repository;

import com.bobbyvetcare.api.entity.TutorEntity;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TutorRepository extends JpaRepository<TutorEntity, String> {

    Optional<TutorEntity> findByIdAndDeletedAtIsNull(String id);

    Optional<TutorEntity> findByUsuario_IdAndDeletedAtIsNull(String usuarioId);

    @Query("""
        SELECT t FROM TutorEntity t
        WHERE t.deletedAt IS NULL
          AND (:q IS NULL OR LOWER(t.fullName) LIKE LOWER(CONCAT('%', :q, '%'))
               OR LOWER(t.phone) LIKE LOWER(CONCAT('%', :q, '%'))
               OR LOWER(COALESCE(t.email, '')) LIKE LOWER(CONCAT('%', :q, '%')))
        ORDER BY t.fullName ASC
        """)
    List<TutorEntity> searchActiveTutors(@Param("q") String q);
}
