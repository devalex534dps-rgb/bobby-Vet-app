package com.bobbyvetcare.api.repository;

import com.bobbyvetcare.api.entity.AppointmentEntity;
import com.bobbyvetcare.api.entity.enums.AppointmentStatus;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface AppointmentRepository extends JpaRepository<AppointmentEntity, String> {

    long countByScheduledDate(LocalDate scheduledDate);

    @EntityGraph(attributePaths = {"paciente", "paciente.tutor", "veterinario"})
    Optional<AppointmentEntity> findDetailedById(String id);

    @EntityGraph(attributePaths = {"paciente", "paciente.tutor", "veterinario"})
    Optional<AppointmentEntity> findByFolioIgnoreCase(String folio);

    @EntityGraph(attributePaths = {"veterinario"})
    Optional<AppointmentEntity> findFirstByPaciente_IdAndScheduledDateGreaterThanEqualAndStatusNotOrderByScheduledDateAscStartTimeAsc(
        String pacienteId,
        LocalDate fromDate,
        AppointmentStatus excludedStatus
    );

    @EntityGraph(attributePaths = {"paciente", "veterinario"})
    List<AppointmentEntity> findTop5ByScheduledDateGreaterThanEqualAndStatusNotOrderByScheduledDateAscStartTimeAsc(
        LocalDate fromDate,
        AppointmentStatus excludedStatus
    );

    @EntityGraph(attributePaths = {"paciente", "paciente.tutor", "veterinario"})
    List<AppointmentEntity> findByScheduledDateAndStatusOrderByStartTimeAsc(
        LocalDate scheduledDate,
        AppointmentStatus status
    );

    @EntityGraph(attributePaths = {"paciente", "paciente.tutor", "veterinario"})
    @Query("""
        SELECT a FROM AppointmentEntity a
        WHERE a.status = :status
          AND a.scheduledDate IN :dates
        ORDER BY a.scheduledDate ASC, a.startTime ASC
        """)
    List<AppointmentEntity> findByStatusAndScheduledDateIn(
        @Param("status") AppointmentStatus status,
        @Param("dates") List<LocalDate> dates
    );

    @EntityGraph(attributePaths = {"paciente", "paciente.tutor", "veterinario"})
    @Query("""
        SELECT a FROM AppointmentEntity a
        WHERE (:status IS NULL OR a.status = :status)
          AND (:scheduledDate IS NULL OR a.scheduledDate = :scheduledDate)
          AND (:q IS NULL OR LOWER(a.paciente.name) LIKE LOWER(CONCAT('%', :q, '%'))
               OR LOWER(a.veterinario.fullName) LIKE LOWER(CONCAT('%', :q, '%'))
               OR LOWER(COALESCE(a.folio, '')) LIKE LOWER(CONCAT('%', :q, '%')))
        ORDER BY a.scheduledDate DESC, a.startTime ASC
        """)
    Page<AppointmentEntity> searchAppointments(
        @Param("status") AppointmentStatus status,
        @Param("scheduledDate") LocalDate scheduledDate,
        @Param("q") String q,
        Pageable pageable
    );
}
