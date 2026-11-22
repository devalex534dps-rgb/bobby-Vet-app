-- ============================================================================
-- Bobby VetCare — Datos de Prueba (Al menos 100 registros por tabla principal)
-- Motor: MySQL 8.0+
-- Contraseñas documentadas (BCrypt):
--   ADMIN:       admin@bobbyvetcare.mx    / BobbyAdmin2026!
--   VETERINARIO: vet@bobbyvetcare.mx      / BobbyVet2026!
--   CLIENTE:     cliente@bobbyvetcare.mx  / BobbyClient2026!
-- ============================================================================

USE bobby_vetcare;

-- 1. Roles (3 roles base del sistema)
INSERT IGNORE INTO roles (id, name, description) VALUES
  ('11111111-1111-1111-1111-111111111101', 'ADMIN', 'Acceso total al sistema, gestión de usuarios y módulos'),
  ('11111111-1111-1111-1111-111111111102', 'VETERINARIO', 'Gestión clínica de pacientes, citas y consultas'),
  ('11111111-1111-1111-1111-111111111103', 'CLIENTE', 'Acceso limitado a sus propias mascotas, citas e historial');

-- 2. Usuarios base (10 registros)
INSERT IGNORE INTO usuarios (id, role_id, full_name, email, password_hash, phone, is_active) VALUES
  ('22222222-2222-2222-2222-222222222001', '11111111-1111-1111-1111-111111111101', 'Administrador Bobby', 'admin@bobbyvetcare.mx', '$2a$10$FBtFoLjIwhNWu9szRiGidexjKm367fTcmyeB329WXzz1vV3SYm4.K', '+525510000001', 1),
  ('22222222-2222-2222-2222-222222222002', '11111111-1111-1111-1111-111111111102', 'Dr. Julián Rivera', 'vet@bobbyvetcare.mx', '$2a$10$T7mwu2wONLB94I0NVNDKg.rZfRDcFXWFaJ9tuO911DzVBE/GQeXh.', '+525510000002', 1),
  ('22222222-2222-2222-2222-222222222003', '11111111-1111-1111-1111-111111111102', 'Dra. Sofía Mendoza', 'sofia.mendoza@bobbyvetcare.mx', '$2a$10$T7mwu2wONLB94I0NVNDKg.rZfRDcFXWFaJ9tuO911DzVBE/GQeXh.', '+525510000003', 1),
  ('22222222-2222-2222-2222-222222222004', '11111111-1111-1111-1111-111111111102', 'Dr. Alejandro Castro', 'alejandro.castro@bobbyvetcare.mx', '$2a$10$T7mwu2wONLB94I0NVNDKg.rZfRDcFXWFaJ9tuO911DzVBE/GQeXh.', '+525510000004', 1),
  ('22222222-2222-2222-2222-222222222005', '11111111-1111-1111-1111-111111111103', 'Carlos Ramírez (Cliente)', 'cliente@bobbyvetcare.mx', '$2a$10$I11JWZ95gbyWcF5EwsH8x.qo2HL3Ftn8FiWxImRi/o/nSLBVPoeGi', '+525510000005', 1),
  ('22222222-2222-2222-2222-222222222006', '11111111-1111-1111-1111-111111111103', 'María Fernanda López', 'mafer.lopez@correo.mx', '$2a$10$I11JWZ95gbyWcF5EwsH8x.qo2HL3Ftn8FiWxImRi/o/nSLBVPoeGi', '+525510000006', 1),
  ('22222222-2222-2222-2222-222222222007', '11111111-1111-1111-1111-111111111103', 'Luis Hernández', 'luis.hernandez@correo.mx', '$2a$10$I11JWZ95gbyWcF5EwsH8x.qo2HL3Ftn8FiWxImRi/o/nSLBVPoeGi', '+525510000007', 1),
  ('22222222-2222-2222-2222-222222222008', '11111111-1111-1111-1111-111111111103', 'Ana Paula Torres', 'ana.torres@correo.mx', '$2a$10$I11JWZ95gbyWcF5EwsH8x.qo2HL3Ftn8FiWxImRi/o/nSLBVPoeGi', '+525510000008', 1),
  ('22222222-2222-2222-2222-222222222009', '11111111-1111-1111-1111-111111111103', 'Jorge Morales', 'jorge.morales@correo.mx', '$2a$10$I11JWZ95gbyWcF5EwsH8x.qo2HL3Ftn8FiWxImRi/o/nSLBVPoeGi', '+525510000009', 1),
  ('22222222-2222-2222-2222-222222222010', '11111111-1111-1111-1111-111111111103', 'Lucía Vargas', 'lucia.vargas@correo.mx', '$2a$10$I11JWZ95gbyWcF5EwsH8x.qo2HL3Ftn8FiWxImRi/o/nSLBVPoeGi', '+525510000010', 1);

-- 3. Tutores base (10 registros) + 90 generados = 100 registros
INSERT IGNORE INTO tutores (id, usuario_id, full_name, phone, email, address) VALUES
  ('33333333-3333-3333-3333-333333333001', '22222222-2222-2222-2222-222222222005', 'Carlos Ramírez', '+525510000005', 'cliente@bobbyvetcare.mx', 'Av. Insurgentes Sur 123, CDMX'),
  ('33333333-3333-3333-3333-333333333002', '22222222-2222-2222-2222-222222222006', 'María Fernanda López', '+525510000006', 'mafer.lopez@correo.mx', 'Calle Reforma 45, CDMX'),
  ('33333333-3333-3333-3333-333333333003', '22222222-2222-2222-2222-222222222007', 'Luis Hernández', '+525510000007', 'luis.hernandez@correo.mx', 'Col. Roma Norte 89, CDMX'),
  ('33333333-3333-3333-3333-333333333004', '22222222-2222-2222-2222-222222222008', 'Ana Paula Torres', '+525510000008', 'ana.torres@correo.mx', 'Av. Universidad 310, CDMX'),
  ('33333333-3333-3333-3333-333333333005', '22222222-2222-2222-2222-222222222009', 'Jorge Morales', '+525510000009', 'jorge.morales@correo.mx', 'Col. Del Valle 212, CDMX'),
  ('33333333-3333-3333-3333-333333333006', '22222222-2222-2222-2222-222222222010', 'Lucía Vargas', '+525510000010', 'lucia.vargas@correo.mx', 'Col. Narvarte 55, CDMX'),
  ('33333333-3333-3333-3333-333333333007', NULL, 'Roberto Sánchez', '+525510000011', 'roberto.sanchez@correo.mx', 'Col. Condesa 18, CDMX'),
  ('33333333-3333-3333-3333-333333333008', NULL, 'Patricia Navarro', '+525510000012', 'patricia.navarro@correo.mx', 'Col. Polanco 77, CDMX'),
  ('33333333-3333-3333-3333-333333333009', NULL, 'Fernando Díaz', '+525510000013', 'fernando.diaz@correo.mx', 'Col. Coyoacán 92, CDMX'),
  ('33333333-3333-3333-3333-333333333010', NULL, 'Gabriela Ortiz', '+525510000014', 'gabriela.ortiz@correo.mx', 'Col. Nápoles 140, CDMX');

INSERT IGNORE INTO tutores (id, usuario_id, full_name, phone, email, address)
WITH RECURSIVE seq AS (
  SELECT 11 AS n
  UNION ALL
  SELECT n + 1 FROM seq WHERE n < 100
)
SELECT
  CONCAT('33333333-3333-3333-3333-333333333', LPAD(n, 3, '0')),
  NULL,
  CONCAT(
    ELT(((n - 11) % 10) + 1,
      'Elena', 'Mateo', 'Valeria', 'Sebastián', 'Camila',
      'Diego', 'Renata', 'Daniel', 'Mariana', 'Andrés'),
    ' ',
    ELT(FLOOR((n - 11) / 10) + 1,
      'García', 'Martínez', 'López', 'González', 'Pérez',
      'Sánchez', 'Ramírez', 'Flores', 'Castillo')
  ),
  CONCAT('+52552000', LPAD(n, 4, '0')),
  CONCAT('tutor', LPAD(n, 3, '0'), '@correo.mx'),
  CONCAT('Calle ', ELT((n % 6) + 1, 'Reforma', 'Insurgentes', 'Juárez', 'Hidalgo', 'Morelos', 'Madero'), ' ', n * 10, ', Oaxaca')
FROM seq;

-- 4. Pacientes base (12 registros) + 88 generados = 100 registros
INSERT IGNORE INTO pacientes (id, tutor_id, name, species, breed, gender, age_label, weight_kg, clinical_status) VALUES
  ('44444444-4444-4444-4444-444444444001', '33333333-3333-3333-3333-333333333001', 'Bobby', 'Canino', 'Golden Retriever', 'Macho', '3 años', 28.50, 'Al día'),
  ('44444444-4444-4444-4444-444444444002', '33333333-3333-3333-3333-333333333001', 'Mishi', 'Felino', 'Siamés', 'Hembra', '2 años', 4.10, 'Vacuna pendiente'),
  ('44444444-4444-4444-4444-444444444003', '33333333-3333-3333-3333-333333333002', 'Luna', 'Canino', 'Husky Siberiano', 'Hembra', '4 años', 22.00, 'En tratamiento'),
  ('44444444-4444-4444-4444-444444444004', '33333333-3333-3333-3333-333333333003', 'Max', 'Canino', 'Labrador', 'Macho', '5 años', 31.20, 'Al día'),
  ('44444444-4444-4444-4444-444444444005', '33333333-3333-3333-3333-333333333004', 'Nala', 'Felino', 'Persa', 'Hembra', '1 año', 3.50, 'Al día'),
  ('44444444-4444-4444-4444-444444444006', '33333333-3333-3333-3333-333333333005', 'Rocky', 'Canino', 'Bulldog Francés', 'Macho', '3 años', 12.40, 'En seguimiento'),
  ('44444444-4444-4444-4444-444444444007', '33333333-3333-3333-3333-333333333006', 'Kira', 'Canino', 'Pastor Alemán', 'Hembra', '6 años', 30.00, 'En recuperación'),
  ('44444444-4444-4444-4444-444444444008', '33333333-3333-3333-3333-333333333007', 'Simba', 'Felino', 'Maine Coon', 'Macho', '2 años', 6.80, 'Al día'),
  ('44444444-4444-4444-4444-444444444009', '33333333-3333-3333-3333-333333333008', 'Coco', 'Canino', 'Poodle', 'Macho', '4 años', 7.20, 'Vacuna pendiente'),
  ('44444444-4444-4444-4444-444444444010', '33333333-3333-3333-3333-333333333009', 'Toby', 'Canino', 'Beagle', 'Macho', '2 años', 11.50, 'Al día'),
  ('44444444-4444-4444-4444-444444444011', '33333333-3333-3333-3333-333333333010', 'Mia', 'Felino', 'Bengalí', 'Hembra', '3 años', 4.40, 'Al día'),
  ('44444444-4444-4444-4444-444444444012', '33333333-3333-3333-3333-333333333002', 'Thor', 'Canino', 'Boxer', 'Macho', '5 años', 29.00, 'En tratamiento');

INSERT IGNORE INTO pacientes (id, tutor_id, name, species, breed, gender, age_label, weight_kg, clinical_status)
WITH RECURSIVE seq AS (
  SELECT 13 AS n
  UNION ALL
  SELECT n + 1 FROM seq WHERE n < 100
)
SELECT
  CONCAT('44444444-4444-4444-4444-444444444', LPAD(n, 3, '0')),
  CONCAT('33333333-3333-3333-3333-333333333', LPAD(((n - 1) % 100) + 1, 3, '0')),
  ELT(n - 12,
    'Bruno','Canela','Zeus','Lola','Milo','Nina','Lucas','Kiara','Otis','Maya',
    'Apolo','Chispa','Dante','Frida','Gala','Hachiko','Iris','Jack','Koda','Lía',
    'Moka','Nemo','Oreo','Paco','Queen','Rocco','Sasha','Tango','Uma','Vito',
    'Wanda','Xena','Yago','Zoe','Akira','Baloo','Cleo','Duke','Echo','Félix',
    'Ginger','Hugo','Iker','Juno','Kiko','Lulu','Mango','Nube','Olaf','Pepe',
    'Quira','Rex','Sol','Tito','Ulises','Vega','Willow','Xolo','Yuki','Zorro',
    'Archie','Bimba','César','Daisy','Elvis','Fiona','Gus','Hera','Indy','Jazz',
    'Kairo','Loki','Bongo','Nero','Opal','Pipo','Rambo','Sami','Teo','Uva',
    'Valiente','Wally','Yoda','Zafiro','Atlas','Bella','Chanel','Draco'
  ),
  IF(n % 3 = 0, 'Felino', 'Canino'),
  IF(n % 3 = 0,
     ELT((n % 5) + 1, 'Siamés', 'Persa', 'Maine Coon', 'Bengalí', 'Doméstico'),
     ELT((n % 6) + 1, 'Golden Retriever', 'Labrador', 'Beagle', 'Poodle', 'Chihuahua', 'Pastor Alemán')),
  IF(n % 2 = 0, 'Macho', 'Hembra'),
  CONCAT((n % 9) + 1, ' años'),
  IF(n % 3 = 0, ROUND(3.0 + (n % 5), 2), ROUND(8.0 + (n % 25), 2)),
  ELT((n % 5) + 1, 'Al día', 'En tratamiento', 'En seguimiento', 'Vacuna pendiente', 'En recuperación')
FROM seq;

-- 5. Servicios base (10 registros) + 90 generados = 100 registros
INSERT IGNORE INTO servicios (id, name, category, price, description) VALUES
  ('55555555-5555-5555-5555-555555555001', 'Consulta General', 'Consulta', 450.00, 'Valoración clínica completa y signos vitales'),
  ('55555555-5555-5555-5555-555555555002', 'Vacuna Antirrábica', 'Vacunación', 350.00, 'Aplicación de vacuna antirrábica anual'),
  ('55555555-5555-5555-5555-555555555003', 'Vacuna Séxtuple Canina', 'Vacunación', 520.00, 'Protección múltiple para perros'),
  ('55555555-5555-5555-5555-555555555004', 'Vacuna Triple Felina', 'Vacunación', 480.00, 'Protección viral para gatos'),
  ('55555555-5555-5555-5555-555555555005', 'Desparasitación Interna', 'Prevención', 280.00, 'Tratamiento antiparasitario oral'),
  ('55555555-5555-5555-5555-555555555006', 'Limpieza Dental', 'Odontología', 1200.00, 'Profilaxis dental con ultrasonido'),
  ('55555555-5555-5555-5555-555555555007', 'Curación de Heridas', 'Procedimiento', 380.00, 'Limpieza y vendaje de heridas superficiales'),
  ('55555555-5555-5555-5555-555555555008', 'Baño Medicado', 'Estética', 420.00, 'Baño dermatológico terapéutico'),
  ('55555555-5555-5555-5555-555555555009', 'Control de Peso y Nutrición', 'Consulta', 320.00, 'Evaluación nutricional y plan alimenticio'),
  ('55555555-5555-5555-5555-555555555010', 'Revisión Post-Operatoria', 'Seguimiento', 300.00, 'Retiro de puntos y control de cicatrización');

INSERT IGNORE INTO servicios (id, name, category, price, description)
WITH RECURSIVE seq AS (
  SELECT 11 AS n
  UNION ALL
  SELECT n + 1 FROM seq WHERE n < 100
)
SELECT
  CONCAT('55555555-5555-5555-5555-555555555', LPAD(n, 3, '0')),
  CONCAT(
    ELT(((n - 11) % 10) + 1,
      'Consulta', 'Vacuna', 'Terapia', 'Perfil', 'Cirugía',
      'Limpieza', 'Radiografía', 'Ecografía', 'Control', 'Curación'),
    ' ',
    ELT(FLOOR((n - 11) / 10) + 1,
      'Básica Canina', 'Básica Felina', 'Especializada Canina',
      'Especializada Felina', 'Preventiva Integral', 'Dermatológica',
      'Oftalmológica', 'Ortopédica', 'Geriátrica')
  ),
  ELT((n % 6) + 1, 'Consulta', 'Vacunación', 'Prevención', 'Odontología', 'Procedimiento', 'Estética'),
  ROUND(250.00 + (n * 12.50), 2),
  CONCAT('Servicio veterinario especializado código ', LPAD(n, 3, '0'))
FROM seq;

-- 6. Citas base (10 registros) + 90 generados = 100 registros
INSERT IGNORE INTO citas (id, folio, paciente_id, veterinario_id, scheduled_date, start_time, end_time, specialty, status, notes) VALUES
  ('66666666-6666-6666-6666-666666666001', 'BVC-2026-0001', '44444444-4444-4444-4444-444444444001', '22222222-2222-2222-2222-222222222002', CURDATE(), '09:00:00', '09:30:00', 'general', 'confirmed', 'Chequeo general anual'),
  ('66666666-6666-6666-6666-666666666002', 'BVC-2026-0002', '44444444-4444-4444-4444-444444444002', '22222222-2222-2222-2222-222222222003', CURDATE(), '10:00:00', '10:30:00', 'vacuna', 'pending', 'Refuerzo triple felina'),
  ('66666666-6666-6666-6666-666666666003', 'BVC-2026-0003', '44444444-4444-4444-4444-444444444003', '22222222-2222-2222-2222-222222222002', CURDATE(), '11:00:00', '11:45:00', 'general', 'in_progress', 'Revisión dermatológica'),
  ('66666666-6666-6666-6666-666666666004', 'BVC-2026-0004', '44444444-4444-4444-4444-444444444004', '22222222-2222-2222-2222-222222222004', DATE_ADD(CURDATE(), INTERVAL 1 DAY), '09:30:00', '10:00:00', 'vacuna', 'confirmed', 'Vacuna antirrábica'),
  ('66666666-6666-6666-6666-666666666005', 'BVC-2026-0005', '44444444-4444-4444-4444-444444444005', '22222222-2222-2222-2222-222222222003', DATE_ADD(CURDATE(), INTERVAL 1 DAY), '12:00:00', '12:30:00', 'estetica', 'confirmed', 'Baño medicado'),
  ('66666666-6666-6666-6666-666666666006', 'BVC-2026-0006', '44444444-4444-4444-4444-444444444006', '22222222-2222-2222-2222-222222222002', DATE_ADD(CURDATE(), INTERVAL 2 DAY), '10:30:00', '11:00:00', 'general', 'confirmed', 'Control respiratorio'),
  ('66666666-6666-6666-6666-666666666007', 'BVC-2026-0007', '44444444-4444-4444-4444-444444444007', '22222222-2222-2222-2222-222222222004', DATE_SUB(CURDATE(), INTERVAL 1 DAY), '16:00:00', '16:45:00', 'cirugia', 'completed', 'Revisión post-operatoria'),
  ('66666666-6666-6666-6666-666666666008', 'BVC-2026-0008', '44444444-4444-4444-4444-444444444008', '22222222-2222-2222-2222-222222222003', DATE_SUB(CURDATE(), INTERVAL 2 DAY), '11:30:00', '12:00:00', 'general', 'completed', 'Desparasitación'),
  ('66666666-6666-6666-6666-666666666009', 'BVC-2026-0009', '44444444-4444-4444-4444-444444444009', '22222222-2222-2222-2222-222222222002', DATE_ADD(CURDATE(), INTERVAL 3 DAY), '13:00:00', '13:30:00', 'vacuna', 'pending', 'Vacuna séxtuple'),
  ('66666666-6666-6666-6666-666666666010', 'BVC-2026-0010', '44444444-4444-4444-4444-444444444010', '22222222-2222-2222-2222-222222222004', DATE_ADD(CURDATE(), INTERVAL 4 DAY), '15:00:00', '15:30:00', 'general', 'cancelled', 'Reagendada por tutor');

INSERT IGNORE INTO citas (id, folio, paciente_id, veterinario_id, scheduled_date, start_time, end_time, specialty, status, notes)
WITH RECURSIVE seq AS (
  SELECT 11 AS n
  UNION ALL
  SELECT n + 1 FROM seq WHERE n < 100
)
SELECT
  CONCAT('66666666-6666-6666-6666-666666666', LPAD(n, 3, '0')),
  CONCAT('BVC-2026-', LPAD(n, 4, '0')),
  CONCAT('44444444-4444-4444-4444-444444444', LPAD(n, 3, '0')),
  ELT((n % 3) + 1,
    '22222222-2222-2222-2222-222222222002',
    '22222222-2222-2222-2222-222222222003',
    '22222222-2222-2222-2222-222222222004'),
  DATE_ADD(CURDATE(), INTERVAL ((n % 20) - 10) DAY),
  MAKETIME(9 + (n % 8), (n % 2) * 30, 0),
  MAKETIME(9 + (n % 8), ((n % 2) * 30) + 29, 0),
  ELT((n % 5) + 1, 'general', 'vacuna', 'cirugia', 'estetica', 'guardia'),
  ELT((n % 5) + 1, 'pending', 'confirmed', 'in_progress', 'completed', 'cancelled'),
  CONCAT('Seguimiento clínico programado #', n)
FROM seq;

-- 7. Consultas base (10 registros) + 90 generados = 100 registros
INSERT IGNORE INTO consultas (id, cita_id, paciente_id, veterinario_id, status, reason, diagnosis, treatment, vitals) VALUES
  ('77777777-7777-7777-7777-777777777001', '66666666-6666-6666-6666-666666666007', '44444444-4444-4444-4444-444444444007', '22222222-2222-2222-2222-222222222004', 'closed', 'Revisión post-operatoria', 'Cicatrización adecuada sin infección', 'Retiro de puntos y limpieza tópica', 'Temp: 38.4°C | FC: 88 lpm | Peso: 30.0 kg'),
  ('77777777-7777-7777-7777-777777777002', '66666666-6666-6666-6666-666666666008', '44444444-4444-4444-4444-444444444008', '22222222-2222-2222-2222-222222222003', 'closed', 'Control preventivo y desparasitación', 'Paciente sano', 'Antiparasitario oral dosis única', 'Temp: 38.6°C | FC: 120 lpm | Peso: 6.8 kg'),
  ('77777777-7777-7777-7777-777777777003', '66666666-6666-6666-6666-666666666003', '44444444-4444-4444-4444-444444444003', '22222222-2222-2222-2222-222222222002', 'active', 'Prurito y enrojecimiento en piel', 'Dermatitis alérgica estacional', 'Baño medicado semanal y antihistamínico', 'Temp: 38.7°C | FC: 95 lpm | Peso: 22.0 kg'),
  ('77777777-7777-7777-7777-777777777004', NULL, '44444444-4444-4444-4444-444444444001', '22222222-2222-2222-2222-222222222002', 'closed', 'Vacunación anual', 'Apto para vacunación', 'Vacuna antirrábica y séxtuple', 'Temp: 38.3°C | FC: 85 lpm | Peso: 28.5 kg'),
  ('77777777-7777-7777-7777-777777777005', NULL, '44444444-4444-4444-4444-444444444004', '22222222-2222-2222-2222-222222222004', 'closed', 'Limpieza dental preventiva', 'Sarro dental grado I', 'Profilaxis dental con ultrasonido', 'Temp: 38.2°C | FC: 80 lpm | Peso: 31.2 kg'),
  ('77777777-7777-7777-7777-777777777006', NULL, '44444444-4444-4444-4444-444444444005', '22222222-2222-2222-2222-222222222003', 'closed', 'Control de peso', 'Peso ideal para su edad', 'Dieta balanceada de mantenimiento', 'Temp: 38.5°C | FC: 130 lpm | Peso: 3.5 kg'),
  ('77777777-7777-7777-7777-777777777007', NULL, '44444444-4444-4444-4444-444444444006', '22222222-2222-2222-2222-222222222002', 'active', 'Estornudos frecuentes', 'Irritación leve de vías altas', 'Observación y ambiente libre de polvo', 'Temp: 38.8°C | FC: 102 lpm | Peso: 12.4 kg'),
  ('77777777-7777-7777-7777-777777777008', NULL, '44444444-4444-4444-4444-444444444010', '22222222-2222-2222-2222-222222222004', 'closed', 'Herida leve en pata trasera', 'Laceración superficial', 'Curación y vendaje protector', 'Temp: 38.5°C | FC: 92 lpm | Peso: 11.5 kg'),
  ('77777777-7777-7777-7777-777777777009', NULL, '44444444-4444-4444-4444-444444444011', '22222222-2222-2222-2222-222222222003', 'closed', 'Vacunación anual felina', 'Paciente sano', 'Vacuna triple felina', 'Temp: 38.4°C | FC: 125 lpm | Peso: 4.4 kg'),
  ('77777777-7777-7777-7777-777777777010', NULL, '44444444-4444-4444-4444-444444444012', '22222222-2222-2222-2222-222222222002', 'active', 'Otitis externa', 'Otitis leve en oído derecho', 'Gotas óticas cada 12 horas por 7 días', 'Temp: 38.6°C | FC: 90 lpm | Peso: 29.0 kg');

INSERT IGNORE INTO consultas (id, cita_id, paciente_id, veterinario_id, status, reason, diagnosis, treatment, vitals)
WITH RECURSIVE seq AS (
  SELECT 11 AS n
  UNION ALL
  SELECT n + 1 FROM seq WHERE n < 100
)
SELECT
  CONCAT('77777777-7777-7777-7777-777777777', LPAD(n, 3, '0')),
  CONCAT('66666666-6666-6666-6666-666666666', LPAD(n, 3, '0')),
  CONCAT('44444444-4444-4444-4444-444444444', LPAD(n, 3, '0')),
  ELT((n % 3) + 1,
    '22222222-2222-2222-2222-222222222002',
    '22222222-2222-2222-2222-222222222003',
    '22222222-2222-2222-2222-222222222004'),
  IF(n % 4 = 0, 'active', 'closed'),
  ELT((n % 5) + 1, 'Chequeo general preventivo', 'Refuerzo de vacunación', 'Revisión dermatológica', 'Control gastrointestinal', 'Evaluación nutricional'),
  ELT((n % 5) + 1, 'Paciente sano sin hallazgos', 'Apto para esquema preventivo', 'Irritación dérmica leve', 'Gastritis leve en remisión', 'Condición corporal óptima'),
  ELT((n % 5) + 1, 'Observación y seguimiento anual', 'Aplicación de vacuna correspondiente', 'Baño medicado cada 7 días', 'Dieta blanda por 5 días', 'Plan de mantenimiento preventivo'),
  CONCAT('Temp: 38.', n % 9, '°C | FC: ', 85 + (n % 35), ' lpm | Peso: ', 5 + (n % 25), '.0 kg')
FROM seq;

-- 8. Relación N:M consulta_servicios (>= 100 registros)
INSERT IGNORE INTO consulta_servicios (consulta_id, servicio_id) VALUES
  ('77777777-7777-7777-7777-777777777001', '55555555-5555-5555-5555-555555555010'),
  ('77777777-7777-7777-7777-777777777002', '55555555-5555-5555-5555-555555555001'),
  ('77777777-7777-7777-7777-777777777002', '55555555-5555-5555-5555-555555555005'),
  ('77777777-7777-7777-7777-777777777003', '55555555-5555-5555-5555-555555555001'),
  ('77777777-7777-7777-7777-777777777003', '55555555-5555-5555-5555-555555555008'),
  ('77777777-7777-7777-7777-777777777004', '55555555-5555-5555-5555-555555555002'),
  ('77777777-7777-7777-7777-777777777004', '55555555-5555-5555-5555-555555555003'),
  ('77777777-7777-7777-7777-777777777005', '55555555-5555-5555-5555-555555555006'),
  ('77777777-7777-7777-7777-777777777006', '55555555-5555-5555-5555-555555555009'),
  ('77777777-7777-7777-7777-777777777007', '55555555-5555-5555-5555-555555555001'),
  ('77777777-7777-7777-7777-777777777008', '55555555-5555-5555-5555-555555555007'),
  ('77777777-7777-7777-7777-777777777009', '55555555-5555-5555-5555-555555555004'),
  ('77777777-7777-7777-7777-777777777010', '55555555-5555-5555-5555-555555555001');

INSERT IGNORE INTO consulta_servicios (consulta_id, servicio_id)
WITH RECURSIVE seq AS (
  SELECT 11 AS n
  UNION ALL
  SELECT n + 1 FROM seq WHERE n < 100
)
SELECT
  CONCAT('77777777-7777-7777-7777-777777777', LPAD(n, 3, '0')),
  CONCAT('55555555-5555-5555-5555-555555555', LPAD(((n - 1) % 100) + 1, 3, '0'))
FROM seq;
