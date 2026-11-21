package com.bobbyvetcare.api.repository;

import com.bobbyvetcare.api.entity.ConsultationEntity;
import com.bobbyvetcare.api.entity.enums.ConsultationStatus;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ConsultationRepository extends JpaRepository<ConsultationEntity, String> {

    long countByStatus(ConsultationStatus status);

    boolean existsByCita_Id(String citaId);

    @EntityGraph(attributePaths = {"cita", "paciente", "veterinario", "servicios"})
    Optional<ConsultationEntity> findDetailedById(String id);

    @EntityGraph(attributePaths = {"veterinario", "servicios"})
    List<ConsultationEntity> findByPaciente_IdOrderByStartedAtDesc(String pacienteId);

    @EntityGraph(attributePaths = {"paciente"})
    List<ConsultationEntity> findTop5ByOrderByStartedAtDesc();

    @EntityGraph(attributePaths = {"cita", "paciente", "veterinario", "servicios"})
    @Query("""
        SELECT c FROM ConsultationEntity c
        WHERE (:pacienteId IS NULL OR c.paciente.id = :pacienteId)
          AND (:status IS NULL OR c.status = :status)
          AND (:q IS NULL OR LOWER(c.paciente.name) LIKE LOWER(CONCAT('%', :q, '%'))
               OR LOWER(c.reason) LIKE LOWER(CONCAT('%', :q, '%'))
               OR LOWER(c.veterinario.fullName) LIKE LOWER(CONCAT('%', :q, '%')))
        ORDER BY c.startedAt DESC
        """)
    Page<ConsultationEntity> searchConsultations(
        @Param("pacienteId") String pacienteId,
        @Param("status") ConsultationStatus status,
        @Param("q") String q,
        Pageable pageable
    );
}
