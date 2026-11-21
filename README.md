# Bobby VetCare

## Estudiantes
- Edwin Alexis Esperanza Chavez
- Felix Eliel Olivera Jimenez

---

## Descripción del Proyecto
**Bobby VetCare** es una aplicación web frontend para la **gestión clínica veterinaria** (portal público para tutores, control de pacientes, agenda de citas, consultas médicas, reporte clínico y administración de usuarios), desarrollada con React 19, TypeScript y Tailwind CSS.

### Ventanas y Módulos del Sistema
- **Portal de Pacientes (`/`):** Landing pública para tutores con consulta de seguimiento clínico mediante folio.
- **Acceso Staff (`/login`):** Inicio de sesión para personal clínico (`ADMIN`, `VETERINARIO`).
- **Dashboard (`/dashboard`):** Resumen operativo con métricas clínicas y accesos rápidos.
- **Gestión de Pacientes (`/patients`):** Directorio clínico con filtros, búsqueda y exportación.
- **Perfil del Paciente (`/patients/:id`):** Expediente detallado con historial, citas y edición de datos.
- **Agenda de Citas (`/citas`):** Programación, filtrado por estado y seguimiento de citas.
- **Consultas Médicas (`/consultas`):** Registro y gestión de consultas veterinarias.
- **Reporte de Consulta (`/consultas/:id/reporte`):** Vista clínica para documentar hallazgos, diagnóstico, tratamiento y resumen del expediente en pantalla.
- **Gestión de Usuarios (`/usuarios`):** Administración de cuentas y roles del sistema.
- **Perfil de Usuario (`/perfil`):** Información de la sesión activa.

---

## Tecnologías Utilizadas
- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4
- **Navegación y Estado:** React Router DOM v7, TanStack Query v5
- **Formularios y Validación:** React Hook Form, Zod
- **UI y Experiencia:** Lucide React, Framer Motion, Three.js, SweetAlert2
- **Despliegue:** Docker, Nginx, Hostinger VPS

---

## Instalación y Ejecución Local

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo
npm run dev

# 3. Compilar para producción
npm run build
```

La aplicación estará disponible en `http://localhost:5173`.

---

## Enlaces del Proyecto
- **Diseño en Figma:** https://www.figma.com/design/YXihT06njml4nVc5ZWtTG5/Mock-Up-A7?node-id=0-1&t=fq5T3sHevdfVPiwW-1
- **Proyecto Desplegado:** http://179.197.81.104/t3_act8_eq13/
