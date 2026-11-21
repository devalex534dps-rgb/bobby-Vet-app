package com.bobbyvetcare.api.repository;

import com.bobbyvetcare.api.entity.PatientEntity;
import com.bobbyvetcare.api.entity.enums.Species;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PatientRepository extends JpaRepository<PatientEntity, String> {

    long countByDeletedAtIsNull();

    @EntityGraph(attributePaths = "tutor")
    Optional<PatientEntity> findByIdAndDeletedAtIsNull(String id);

    @EntityGraph(attributePaths = "tutor")
    @Query("""
        SELECT p FROM PatientEntity p
        WHERE p.deletedAt IS NULL
          AND (:species IS NULL OR p.species = :species)
          AND (:clinicalStatus IS NULL OR p.clinicalStatus = :clinicalStatus)
          AND (:q IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :q, '%'))
               OR LOWER(p.breed) LIKE LOWER(CONCAT('%', :q, '%'))
               OR LOWER(p.tutor.fullName) LIKE LOWER(CONCAT('%', :q, '%')))
        ORDER BY p.createdAt DESC
        """)
    Page<PatientEntity> searchPatients(
        @Param("species") Species species,
        @Param("clinicalStatus") String clinicalStatus,
        @Param("q") String q,
        Pageable pageable
    );
}
