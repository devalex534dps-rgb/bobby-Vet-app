package com.bobbyvetcare.api.entity;

import com.bobbyvetcare.api.entity.enums.Gender;
import com.bobbyvetcare.api.entity.enums.Species;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "pacientes")
public class PatientEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", length = 36, nullable = false, updatable = false, columnDefinition = "CHAR(36)")
    private String id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "tutor_id", nullable = false)
    private TutorEntity tutor;

    @Column(name = "name", length = 80, nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(name = "species", nullable = false, columnDefinition = "ENUM('Canino', 'Felino')")
    private Species species;

    @Column(name = "breed", length = 80, nullable = false)
    private String breed;

    @Enumerated(EnumType.STRING)
    @Column(name = "gender", columnDefinition = "ENUM('Macho', 'Hembra')")
    private Gender gender;

    @Column(name = "age_label", length = 40)
    private String ageLabel;

    @Column(name = "weight_kg", precision = 6, scale = 2)
    private BigDecimal weightKg;

    @Column(
        name = "clinical_status",
        nullable = false,
        columnDefinition = "ENUM('Al día', 'En tratamiento', 'En seguimiento', 'Vacuna pendiente', 'En recuperación')"
    )
    private String clinicalStatus = "Al día";

    @Column(name = "photo_url", columnDefinition = "TEXT")
    private String photoUrl;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    @OneToMany(mappedBy = "paciente", fetch = FetchType.LAZY)
    private List<AppointmentEntity> citas = new ArrayList<>();

    @OneToMany(mappedBy = "paciente", fetch = FetchType.LAZY)
    private List<ConsultationEntity> consultas = new ArrayList<>();

    public PatientEntity() {
    }

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        if (this.clinicalStatus == null || this.clinicalStatus.isBlank()) {
            this.clinicalStatus = "Al día";
        }
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public TutorEntity getTutor() {
        return tutor;
    }

    public void setTutor(TutorEntity tutor) {
        this.tutor = tutor;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Species getSpecies() {
        return species;
    }

    public void setSpecies(Species species) {
        this.species = species;
    }

    public String getBreed() {
        return breed;
    }

    public void setBreed(String breed) {
        this.breed = breed;
    }

    public Gender getGender() {
        return gender;
    }

    public void setGender(Gender gender) {
        this.gender = gender;
    }

    public String getAgeLabel() {
        return ageLabel;
    }

    public void setAgeLabel(String ageLabel) {
        this.ageLabel = ageLabel;
    }

    public BigDecimal getWeightKg() {
        return weightKg;
    }

    public void setWeightKg(BigDecimal weightKg) {
        this.weightKg = weightKg;
    }

    public String getClinicalStatus() {
        return clinicalStatus;
    }

    public void setClinicalStatus(String clinicalStatus) {
        this.clinicalStatus = clinicalStatus;
    }

    public String getPhotoUrl() {
        return photoUrl;
    }

    public void setPhotoUrl(String photoUrl) {
        this.photoUrl = photoUrl;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getDeletedAt() {
        return deletedAt;
    }

    public void setDeletedAt(LocalDateTime deletedAt) {
        this.deletedAt = deletedAt;
    }

    public List<AppointmentEntity> getCitas() {
        return citas;
    }

    public void setCitas(List<AppointmentEntity> citas) {
        this.citas = citas;
    }

    public List<ConsultationEntity> getConsultas() {
        return consultas;
    }

    public void setConsultas(List<ConsultationEntity> consultas) {
        this.consultas = consultas;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof PatientEntity that)) return false;
        return id != null && Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
