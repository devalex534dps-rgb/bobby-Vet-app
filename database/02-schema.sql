-- ============================================================================
-- Bobby VetCare — Esquema Simplificado (MySQL 8.0+)
-- Proyecto Escolar: Gestión de Clínica Veterinaria
-- ============================================================================

DROP DATABASE IF EXISTS bobby_vetcare;
CREATE DATABASE bobby_vetcare
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE bobby_vetcare;

CREATE TABLE IF NOT EXISTS roles (
  id          CHAR(36) NOT NULL,
  name        VARCHAR(30) NOT NULL,
  description VARCHAR(150) NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_roles_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS usuarios (
  id            CHAR(36) NOT NULL,
  role_id       CHAR(36) NOT NULL,
  full_name     VARCHAR(120) NOT NULL,
  email         VARCHAR(150) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  phone         VARCHAR(30) NULL,
  avatar_url    TEXT NULL,
  is_active     TINYINT(1) NOT NULL DEFAULT 1,
  created_at    DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  UNIQUE KEY uq_usuarios_email (email),
  CONSTRAINT fk_usuarios_rol FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS tutores (
  id          CHAR(36) NOT NULL,
  usuario_id  CHAR(36) NULL,
  full_name   VARCHAR(120) NOT NULL,
  phone       VARCHAR(30) NOT NULL,
  email       VARCHAR(150) NULL,
  address     TEXT NULL,
  created_at  DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  deleted_at  DATETIME(3) NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_tutores_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS pacientes (
  id              CHAR(36) NOT NULL,
  tutor_id        CHAR(36) NOT NULL,
  name            VARCHAR(80) NOT NULL,
  species         ENUM('Canino', 'Felino') NOT NULL,
  breed           VARCHAR(80) NOT NULL,
  gender          ENUM('Macho', 'Hembra') NULL,
  age_label       VARCHAR(40) NULL,
  weight_kg       DECIMAL(6, 2) NULL,
  clinical_status ENUM('Al día', 'En tratamiento', 'En seguimiento', 'Vacuna pendiente', 'En recuperación') NOT NULL DEFAULT 'Al día',
  photo_url       TEXT NULL,
  created_at      DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  deleted_at      DATETIME(3) NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_pacientes_tutor FOREIGN KEY (tutor_id) REFERENCES tutores(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS citas (
  id              CHAR(36) NOT NULL,
  folio           VARCHAR(30) NULL,
  paciente_id     CHAR(36) NOT NULL,
  veterinario_id  CHAR(36) NOT NULL,
  scheduled_date  DATE NOT NULL,
  start_time      TIME NOT NULL,
  end_time        TIME NOT NULL,
  specialty       ENUM('general', 'vacuna', 'cirugia', 'estetica', 'guardia') NOT NULL DEFAULT 'general',
  status          ENUM('pending', 'confirmed', 'in_progress', 'completed', 'cancelled') NOT NULL DEFAULT 'confirmed',
  notes           TEXT NULL,
  created_at      DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  UNIQUE KEY uq_citas_folio (folio),
  CONSTRAINT fk_citas_paciente FOREIGN KEY (paciente_id) REFERENCES pacientes(id) ON DELETE RESTRICT,
  CONSTRAINT fk_citas_veterinario FOREIGN KEY (veterinario_id) REFERENCES usuarios(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS consultas (
  id              CHAR(36) NOT NULL,
  cita_id         CHAR(36) NULL,
  paciente_id     CHAR(36) NOT NULL,
  veterinario_id  CHAR(36) NOT NULL,
  status          ENUM('active', 'closed') NOT NULL DEFAULT 'active',
  reason          VARCHAR(255) NOT NULL,
  diagnosis       TEXT NULL,
  treatment       TEXT NULL,
  vitals          VARCHAR(255) NULL,
  started_at      DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  finished_at     DATETIME(3) NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_consultas_cita FOREIGN KEY (cita_id) REFERENCES citas(id) ON DELETE SET NULL,
  CONSTRAINT fk_consultas_paciente FOREIGN KEY (paciente_id) REFERENCES pacientes(id) ON DELETE RESTRICT,
  CONSTRAINT fk_consultas_veterinario FOREIGN KEY (veterinario_id) REFERENCES usuarios(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS servicios (
  id          CHAR(36) NOT NULL,
  name        VARCHAR(120) NOT NULL,
  category    VARCHAR(60) NOT NULL,
  price       DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  description VARCHAR(255) NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Relación N:M entre consultas y servicios
CREATE TABLE IF NOT EXISTS consulta_servicios (
  consulta_id CHAR(36) NOT NULL,
  servicio_id CHAR(36) NOT NULL,
  PRIMARY KEY (consulta_id, servicio_id),
  CONSTRAINT fk_cs_consulta FOREIGN KEY (consulta_id) REFERENCES consultas(id) ON DELETE CASCADE,
  CONSTRAINT fk_cs_servicio FOREIGN KEY (servicio_id) REFERENCES servicios(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS token_blacklist (
  id         CHAR(36) NOT NULL,
  token_jti  VARCHAR(120) NOT NULL,
  expires_at DATETIME(3) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_blacklist_jti (token_jti)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id         CHAR(36) NOT NULL,
  usuario_id CHAR(36) NOT NULL,
  token      VARCHAR(120) NOT NULL,
  expires_at DATETIME(3) NOT NULL,
  used       TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  UNIQUE KEY uq_prt_token (token),
  CONSTRAINT fk_prt_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
