import { apiRequest } from "./apiClient";

export interface BackendPage<T> {
  items: T[];
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
}

export interface BackendUserDto {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: "ADMIN" | "VETERINARIO" | "CLIENTE";
  avatarUrl?: string;
  active: boolean;
}

export interface BackendTutorDto {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
}

export interface BackendPatientDto {
  id: string;
  tutorId: string;
  name: string;
  species: "Canino" | "Felino";
  breed: string;
  gender?: string;
  ageLabel?: string;
  weightKg?: number;
  clinicalStatus: string;
  photoUrl?: string;
  ownerName: string;
  ownerContact: string;
}

export interface BackendAppointmentDto {
  id: string;
  folio?: string;
  pacienteId: string;
  pacienteName: string;
  species: string;
  breed: string;
  tutorName: string;
  veterinarioId: string;
  veterinarioName: string;
  scheduledDate: string;
  startTime: string;
  endTime: string;
  specialty: "general" | "vacuna" | "cirugia" | "estetica" | "guardia";
  status: "pending" | "confirmed" | "in_progress" | "completed" | "cancelled";
  notes?: string;
}

export interface BackendServiceDto {
  id: string;
  name: string;
  category: string;
  price: number;
  description?: string;
}

export interface BackendConsultationDto {
  id: string;
  citaId?: string;
  pacienteId: string;
  pacienteName: string;
  veterinarioId: string;
  veterinarioName: string;
  status: "active" | "closed";
  reason: string;
  diagnosis?: string;
  treatment?: string;
  vitals?: string;
  startedAt: string;
  finishedAt?: string;
  servicios: BackendServiceDto[];
}

export interface BackendFolioLookupDto {
  folio: string;
  pacienteName: string;
  species: string;
  breed: string;
  tutorName: string;
  nextAppointment?: {
    scheduledDate: string;
    startTime: string;
    endTime: string;
    veterinarioName: string;
    specialty: string;
    status: string;
  } | null;
  consultations: Array<{
    id: string;
    startedAt: string;
    reason: string;
    diagnosis?: string;
    treatment?: string;
    veterinarioName: string;
    servicios: string[];
  }>;
}

export interface BackendDashboardSummaryDto {
  totalPacientes: number;
  citasHoy: number;
  consultasActivas: number;
  upcomingAppointments: Array<{
    id: string;
    pacienteName: string;
    veterinarioName: string;
    scheduledDate: string;
    startTime: string;
    specialty: string;
    status: string;
  }>;
  recentConsultations: Array<{
    id: string;
    pacienteId: string;
    pacienteName: string;
    reason: string;
    diagnosis?: string;
    status: string;
    startedAt: string;
  }>;
}

// ============================================================================
// Mock fallback data para previsualizar el diseño sin backend activo
// ============================================================================
const isNetworkError = (err: unknown) =>
  err instanceof Error &&
  (err.message.includes("Failed to fetch") ||
    err.message.includes("NetworkError") ||
    err.message.includes("ERR_CONNECTION_REFUSED"));

const mockServices: BackendServiceDto[] = [
  { id: "srv-1", name: "Consulta General", category: "Consulta", price: 450 },
  { id: "srv-2", name: "Vacuna Antirrábica", category: "Vacunación", price: 350 },
  { id: "srv-3", name: "Vacuna Séxtuple Canina", category: "Vacunación", price: 520 },
  { id: "srv-4", name: "Vacuna Triple Felina", category: "Vacunación", price: 480 },
  { id: "srv-5", name: "Desparasitación Interna", category: "Prevención", price: 280 },
  { id: "srv-6", name: "Limpieza Dental", category: "Odontología", price: 1200 },
];

let mockUsers: BackendUserDto[] = [
  { id: "22222222-2222-2222-2222-222222222201", fullName: "Administrador Bobby", email: "admin@bobbyvetcare.mx", phone: "+525510000001", role: "ADMIN", active: true },
  { id: "22222222-2222-2222-2222-222222222202", fullName: "Dr. Julián Rivera", email: "vet@bobbyvetcare.mx", phone: "+525510000002", role: "VETERINARIO", active: true },
  { id: "22222222-2222-2222-2222-222222222203", fullName: "Dra. Sofía Mendoza", email: "sofia.mendoza@bobbyvetcare.mx", phone: "+525510000003", role: "VETERINARIO", active: true },
  { id: "22222222-2222-2222-2222-222222222205", fullName: "Carlos Ramírez", email: "cliente@bobbyvetcare.mx", phone: "+525510000005", role: "CLIENTE", active: true },
];

const mockTutors: BackendTutorDto[] = [
  { id: "tut-1", fullName: "Carlos Ramírez", phone: "+52 55 1000 0005", email: "cliente@bobbyvetcare.mx" },
  { id: "tut-2", fullName: "María Fernanda López", phone: "+52 55 1000 0006", email: "mafer@correo.mx" },
  { id: "tut-3", fullName: "Luis Hernández", phone: "+52 55 1000 0007", email: "luis@correo.mx" },
];

let mockPatients: BackendPatientDto[] = [
  { id: "44444444-4444-4444-4444-444444444401", tutorId: "tut-1", name: "Bobby", species: "Canino", breed: "Golden Retriever", gender: "Macho", ageLabel: "3 años", weightKg: 28.5, clinicalStatus: "Al día", ownerName: "Carlos Ramírez", ownerContact: "+52 55 1000 0005", photoUrl: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=300&q=80" },
  { id: "44444444-4444-4444-4444-444444444402", tutorId: "tut-1", name: "Mishi", species: "Felino", breed: "Siamés", gender: "Hembra", ageLabel: "2 años", weightKg: 4.1, clinicalStatus: "Vacuna pendiente", ownerName: "Carlos Ramírez", ownerContact: "+52 55 1000 0005", photoUrl: "https://images.unsplash.com/photo-1513245543132-31f507417b26?auto=format&fit=crop&w=300&q=80" },
  { id: "44444444-4444-4444-4444-444444444403", tutorId: "tut-2", name: "Luna", species: "Canino", breed: "Husky Siberiano", gender: "Hembra", ageLabel: "4 años", weightKg: 22.0, clinicalStatus: "En tratamiento", ownerName: "María Fernanda López", ownerContact: "+52 55 1000 0006", photoUrl: "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=300&q=80" },
  { id: "44444444-4444-4444-4444-444444444404", tutorId: "tut-3", name: "Max", species: "Canino", breed: "Labrador", gender: "Macho", ageLabel: "5 años", weightKg: 31.2, clinicalStatus: "Al día", ownerName: "Luis Hernández", ownerContact: "+52 55 1000 0007", photoUrl: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=300&q=80" },
  { id: "44444444-4444-4444-4444-444444444405", tutorId: "tut-2", name: "Nala", species: "Felino", breed: "Persa", gender: "Hembra", ageLabel: "1 año", weightKg: 3.5, clinicalStatus: "Al día", ownerName: "María Fernanda López", ownerContact: "+52 55 1000 0006", photoUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=300&q=80" },
];

let mockAppointments: BackendAppointmentDto[] = [
  { id: "cit-1", folio: "BOB-2026-001", pacienteId: mockPatients[0].id, pacienteName: "Bobby", species: "Canino", breed: "Golden Retriever", tutorName: "Carlos Ramírez", veterinarioId: mockUsers[1].id, veterinarioName: "Dr. Julián Rivera", scheduledDate: new Date().toISOString().slice(0, 10), startTime: "09:00:00", endTime: "09:30:00", specialty: "general", status: "confirmed", notes: "Chequeo general anual" },
  { id: "cit-2", folio: "BOB-2026-002", pacienteId: mockPatients[1].id, pacienteName: "Mishi", species: "Felino", breed: "Siamés", tutorName: "Carlos Ramírez", veterinarioId: mockUsers[2].id, veterinarioName: "Dra. Sofía Mendoza", scheduledDate: new Date().toISOString().slice(0, 10), startTime: "10:30:00", endTime: "11:00:00", specialty: "vacuna", status: "pending", notes: "Refuerzo triple felina" },
  { id: "cit-3", folio: "BOB-2026-003", pacienteId: mockPatients[2].id, pacienteName: "Luna", species: "Canino", breed: "Husky Siberiano", tutorName: "María Fernanda López", veterinarioId: mockUsers[1].id, veterinarioName: "Dr. Julián Rivera", scheduledDate: new Date().toISOString().slice(0, 10), startTime: "12:00:00", endTime: "12:45:00", specialty: "general", status: "in_progress", notes: "Revisión dermatológica" },
];

let mockConsultations: BackendConsultationDto[] = [
  { id: "con-1", pacienteId: mockPatients[2].id, pacienteName: "Luna", veterinarioId: mockUsers[1].id, veterinarioName: "Dr. Julián Rivera", status: "active", reason: "Prurito y enrojecimiento en piel", diagnosis: "Dermatitis alérgica estacional", treatment: "Baño medicado semanal", vitals: "Temp: 38.7°C | FC: 95 lpm | Peso: 22.0 kg", startedAt: new Date().toISOString(), servicios: [mockServices[0]] },
  { id: "con-2", pacienteId: mockPatients[0].id, pacienteName: "Bobby", veterinarioId: mockUsers[1].id, veterinarioName: "Dr. Julián Rivera", status: "closed", reason: "Vacunación anual", diagnosis: "Apto para vacunación", treatment: "Vacuna antirrábica aplicada", vitals: "Temp: 38.3°C | FC: 85 lpm | Peso: 28.5 kg", startedAt: new Date(Date.now() - 86400000).toISOString(), finishedAt: new Date(Date.now() - 82800000).toISOString(), servicios: [mockServices[1], mockServices[2]] },
];

function paginate<T>(items: T[], page = 0, size = 10): BackendPage<T> {
  const start = page * size;
  return {
    items: items.slice(start, start + size),
    page,
    size,
    totalItems: items.length,
    totalPages: Math.max(1, Math.ceil(items.length / size)),
  };
}

export const bobbyApi = {
  getDashboardSummary: async (): Promise<BackendDashboardSummaryDto> => {
    try {
      return await apiRequest<BackendDashboardSummaryDto>("/dashboard/summary");
    } catch (err) {
      if (!isNetworkError(err)) throw err;
      return {
        totalPacientes: mockPatients.length,
        citasHoy: mockAppointments.length,
        consultasActivas: mockConsultations.filter((c) => c.status === "active").length,
        upcomingAppointments: mockAppointments.slice(0, 5).map((a) => ({
          id: a.id,
          pacienteName: a.pacienteName,
          veterinarioName: a.veterinarioName,
          scheduledDate: a.scheduledDate,
          startTime: a.startTime,
          specialty: a.specialty,
          status: a.status,
        })),
        recentConsultations: mockConsultations.slice(0, 5).map((c) => ({
          id: c.id,
          pacienteId: c.pacienteId,
          pacienteName: c.pacienteName,
          reason: c.reason,
          diagnosis: c.diagnosis,
          status: c.status,
          startedAt: c.startedAt,
        })),
      };
    }
  },

  getUsers: async (params?: { q?: string; role?: string; page?: number; size?: number }) => {
    const qs = new URLSearchParams();
    if (params?.q) qs.set("q", params.q);
    if (params?.role) qs.set("role", params.role);
    qs.set("page", String(params?.page ?? 0));
    qs.set("size", String(params?.size ?? 10));
    try {
      return await apiRequest<BackendPage<BackendUserDto>>(`/users?${qs.toString()}`);
    } catch (err) {
      if (!isNetworkError(err)) throw err;
      const filtered = mockUsers.filter((u) => {
        const matchQ = !params?.q || u.fullName.toLowerCase().includes(params.q.toLowerCase()) || u.email.toLowerCase().includes(params.q.toLowerCase());
        const matchR = !params?.role || u.role === params.role;
        return matchQ && matchR;
      });
      return paginate(filtered, params?.page ?? 0, params?.size ?? 10);
    }
  },

  createUser: async (body: { fullName: string; email: string; password: string; phone?: string; roleName: string }) => {
    try {
      return await apiRequest<BackendUserDto>("/users", { method: "POST", body: JSON.stringify(body) });
    } catch (err) {
      if (!isNetworkError(err)) throw err;
      const created: BackendUserDto = {
        id: `usr-${Date.now()}`,
        fullName: body.fullName,
        email: body.email,
        phone: body.phone,
        role: body.roleName as BackendUserDto["role"],
        active: true,
      };
      mockUsers = [created, ...mockUsers];
      return created;
    }
  },

  updateUser: async (id: string, body: { fullName: string; phone?: string; roleName: string; active?: boolean }) => {
    try {
      return await apiRequest<BackendUserDto>(`/users/${id}`, { method: "PUT", body: JSON.stringify(body) });
    } catch (err) {
      if (!isNetworkError(err)) throw err;
      mockUsers = mockUsers.map((u) => (u.id === id ? { ...u, fullName: body.fullName, phone: body.phone, role: body.roleName as BackendUserDto["role"] } : u));
      return mockUsers.find((u) => u.id === id)!;
    }
  },

  deleteUser: async (id: string) => {
    try {
      return await apiRequest<void>(`/users/${id}`, { method: "DELETE" });
    } catch (err) {
      if (!isNetworkError(err)) throw err;
      mockUsers = mockUsers.map((u) => (u.id === id ? { ...u, active: false } : u));
    }
  },

  getVeterinarians: async () => {
    try {
      return await apiRequest<BackendUserDto[]>("/users/veterinarians");
    } catch (err) {
      if (!isNetworkError(err)) throw err;
      return mockUsers.filter((u) => u.role === "VETERINARIO" && u.active);
    }
  },

  getPatients: async (params?: { species?: string; status?: string; q?: string; page?: number; size?: number }) => {
    const qs = new URLSearchParams();
    if (params?.species) qs.set("species", params.species);
    if (params?.status) qs.set("status", params.status);
    if (params?.q) qs.set("q", params.q);
    qs.set("page", String(params?.page ?? 0));
    qs.set("size", String(params?.size ?? 10));
    try {
      return await apiRequest<BackendPage<BackendPatientDto>>(`/patients?${qs.toString()}`);
    } catch (err) {
      if (!isNetworkError(err)) throw err;
      const filtered = mockPatients.filter((p) => {
        const mS = !params?.species || p.species === params.species;
        const mSt = !params?.status || p.clinicalStatus === params.status;
        const mQ = !params?.q || p.name.toLowerCase().includes(params.q.toLowerCase()) || p.breed.toLowerCase().includes(params.q.toLowerCase()) || p.ownerName.toLowerCase().includes(params.q.toLowerCase());
        return mS && mSt && mQ;
      });
      return paginate(filtered, params?.page ?? 0, params?.size ?? 10);
    }
  },

  getPatientById: async (id: string) => {
    try {
      return await apiRequest<BackendPatientDto>(`/patients/${id}`);
    } catch (err) {
      if (!isNetworkError(err)) throw err;
      const found = mockPatients.find((p) => p.id === id);
      if (!found) throw new Error("Paciente no encontrado");
      return found;
    }
  },

  createPatient: async (body: { tutorId?: string; ownerName?: string; ownerPhone?: string; ownerEmail?: string; name: string; species: "Canino" | "Felino"; breed: string; gender?: string; ageLabel?: string; weightKg?: number; clinicalStatus?: string }) => {
    try {
      return await apiRequest<BackendPatientDto>("/patients", { method: "POST", body: JSON.stringify(body) });
    } catch (err) {
      if (!isNetworkError(err)) throw err;
      const tutor = mockTutors.find((t) => t.id === body.tutorId);
      const created: BackendPatientDto = {
        id: `pac-${Date.now()}`,
        tutorId: body.tutorId || "tut-new",
        name: body.name,
        species: body.species,
        breed: body.breed,
        gender: body.gender || "Macho",
        ageLabel: body.ageLabel || "1 año",
        weightKg: body.weightKg,
        clinicalStatus: body.clinicalStatus || "Al día",
        ownerName: tutor?.fullName || body.ownerName || "Tutor Demo",
        ownerContact: tutor?.phone || body.ownerPhone || "+52 55 0000 0000",
      };
      mockPatients = [created, ...mockPatients];
      return created;
    }
  },

  updatePatient: async (id: string, body: { name: string; species: "Canino" | "Felino"; breed: string; gender?: string; ageLabel?: string; weightKg?: number; clinicalStatus?: string }) => {
    try {
      return await apiRequest<BackendPatientDto>(`/patients/${id}`, { method: "PUT", body: JSON.stringify(body) });
    } catch (err) {
      if (!isNetworkError(err)) throw err;
      mockPatients = mockPatients.map((p) => (p.id === id ? { ...p, ...body } : p));
      return mockPatients.find((p) => p.id === id)!;
    }
  },

  deletePatient: async (id: string) => {
    try {
      return await apiRequest<void>(`/patients/${id}`, { method: "DELETE" });
    } catch (err) {
      if (!isNetworkError(err)) throw err;
      mockPatients = mockPatients.filter((p) => p.id !== id);
    }
  },

  getTutors: async (q?: string) => {
    const qs = new URLSearchParams();
    if (q) qs.set("q", q);
    try {
      return await apiRequest<BackendTutorDto[]>(`/tutores?${qs.toString()}`);
    } catch (err) {
      if (!isNetworkError(err)) throw err;
      return mockTutors;
    }
  },

  getAppointments: async (params?: { status?: string; date?: string; q?: string; page?: number; size?: number }) => {
    const qs = new URLSearchParams();
    if (params?.status) qs.set("status", params.status);
    if (params?.date) qs.set("date", params.date);
    if (params?.q) qs.set("q", params.q);
    qs.set("page", String(params?.page ?? 0));
    qs.set("size", String(params?.size ?? 10));
    try {
      return await apiRequest<BackendPage<BackendAppointmentDto>>(`/appointments?${qs.toString()}`);
    } catch (err) {
      if (!isNetworkError(err)) throw err;
      const filtered = mockAppointments.filter((a) => {
        const mS = !params?.status || a.status === params.status;
        const mQ = !params?.q || a.pacienteName.toLowerCase().includes(params.q.toLowerCase()) || a.veterinarioName.toLowerCase().includes(params.q.toLowerCase());
        return mS && mQ;
      });
      return paginate(filtered, params?.page ?? 0, params?.size ?? 10);
    }
  },

  createAppointment: async (body: { pacienteId: string; veterinarioId: string; scheduledDate: string; startTime: string; endTime: string; specialty: string; notes?: string }) => {
    try {
      return await apiRequest<BackendAppointmentDto>("/appointments", { method: "POST", body: JSON.stringify(body) });
    } catch (err) {
      if (!isNetworkError(err)) throw err;
      const p = mockPatients.find((x) => x.id === body.pacienteId) || mockPatients[0];
      const v = mockUsers.find((x) => x.id === body.veterinarioId) || mockUsers[1];
      const folio = `BOB-2026-${String(mockAppointments.length + 1).padStart(3, "0")}`;
      const created: BackendAppointmentDto = {
        id: `cit-${Date.now()}`,
        folio,
        pacienteId: p.id,
        pacienteName: p.name,
        species: p.species,
        breed: p.breed,
        tutorName: p.ownerName,
        veterinarioId: v.id,
        veterinarioName: v.fullName,
        scheduledDate: body.scheduledDate,
        startTime: body.startTime,
        endTime: body.endTime,
        specialty: body.specialty as BackendAppointmentDto["specialty"],
        status: "confirmed",
        notes: body.notes,
      };
      mockAppointments = [created, ...mockAppointments];
      return created;
    }
  },

  updateAppointmentStatus: async (id: string, status: string) => {
    try {
      return await apiRequest<BackendAppointmentDto>(`/appointments/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) });
    } catch (err) {
      if (!isNetworkError(err)) throw err;
      mockAppointments = mockAppointments.map((a) => (a.id === id ? { ...a, status: status as BackendAppointmentDto["status"] } : a));
      return mockAppointments.find((a) => a.id === id)!;
    }
  },

  deleteAppointment: async (id: string) => {
    try {
      return await apiRequest<void>(`/appointments/${id}`, { method: "DELETE" });
    } catch (err) {
      if (!isNetworkError(err)) throw err;
      mockAppointments = mockAppointments.filter((a) => a.id !== id);
    }
  },

  getConsultations: async (params?: { pacienteId?: string; status?: string; q?: string; page?: number; size?: number }) => {
    const qs = new URLSearchParams();
    if (params?.pacienteId) qs.set("pacienteId", params.pacienteId);
    if (params?.status) qs.set("status", params.status);
    if (params?.q) qs.set("q", params.q);
    qs.set("page", String(params?.page ?? 0));
    qs.set("size", String(params?.size ?? 10));
    try {
      return await apiRequest<BackendPage<BackendConsultationDto>>(`/consultations?${qs.toString()}`);
    } catch (err) {
      if (!isNetworkError(err)) throw err;
      const filtered = mockConsultations.filter((c) => {
        const mP = !params?.pacienteId || c.pacienteId === params.pacienteId;
        const mS = !params?.status || c.status === params.status;
        const mQ = !params?.q || c.pacienteName.toLowerCase().includes(params.q.toLowerCase()) || c.reason.toLowerCase().includes(params.q.toLowerCase());
        return mP && mS && mQ;
      });
      return paginate(filtered, params?.page ?? 0, params?.size ?? 10);
    }
  },

  getConsultationById: async (id: string) => {
    try {
      return await apiRequest<BackendConsultationDto>(`/consultations/${id}`);
    } catch (err) {
      if (!isNetworkError(err)) throw err;
      const found = mockConsultations.find((c) => c.id === id);
      if (!found) throw new Error("Consulta no encontrada");
      return found;
    }
  },

  startConsultation: async (body: { citaId?: string; pacienteId: string; reason: string; diagnosis?: string; treatment?: string; vitals?: string; servicioIds?: string[] }) => {
    try {
      return await apiRequest<BackendConsultationDto>("/consultations", { method: "POST", body: JSON.stringify(body) });
    } catch (err) {
      if (!isNetworkError(err)) throw err;
      const p = mockPatients.find((x) => x.id === body.pacienteId) || mockPatients[0];
      const created: BackendConsultationDto = {
        id: `con-${Date.now()}`,
        pacienteId: p.id,
        pacienteName: p.name,
        veterinarioId: mockUsers[1].id,
        veterinarioName: mockUsers[1].fullName,
        status: "active",
        reason: body.reason,
        diagnosis: body.diagnosis,
        treatment: body.treatment,
        vitals: body.vitals,
        startedAt: new Date().toISOString(),
        servicios: mockServices.filter((s) => body.servicioIds?.includes(s.id)),
      };
      mockConsultations = [created, ...mockConsultations];
      return created;
    }
  },

  closeConsultation: async (id: string, body: { diagnosis: string; treatment?: string; vitals?: string; servicioIds?: string[] }) => {
    try {
      return await apiRequest<BackendConsultationDto>(`/consultations/${id}/close`, { method: "PUT", body: JSON.stringify(body) });
    } catch (err) {
      if (!isNetworkError(err)) throw err;
      mockConsultations = mockConsultations.map((c) =>
        c.id === id
          ? {
              ...c,
              status: "closed",
              diagnosis: body.diagnosis,
              treatment: body.treatment,
              vitals: body.vitals,
              finishedAt: new Date().toISOString(),
              servicios: body.servicioIds ? mockServices.filter((s) => body.servicioIds!.includes(s.id)) : c.servicios,
            }
          : c
      );
      return mockConsultations.find((c) => c.id === id)!;
    }
  },

  updateConsultationReport: async (
    id: string,
    body: { reason?: string; diagnosis: string; treatment?: string; vitals?: string; servicioIds?: string[]; close?: boolean }
  ) => {
    try {
      const endpoint = body.close ? `/consultations/${id}/close` : `/consultations/${id}`;
      return await apiRequest<BackendConsultationDto>(endpoint, { method: "PUT", body: JSON.stringify(body) });
    } catch (err) {
      if (!isNetworkError(err)) throw err;
      mockConsultations = mockConsultations.map((c) =>
        c.id === id
          ? {
              ...c,
              reason: body.reason ?? c.reason,
              diagnosis: body.diagnosis,
              treatment: body.treatment,
              vitals: body.vitals,
              status: body.close ? "closed" : c.status,
              finishedAt: body.close ? new Date().toISOString() : c.finishedAt,
              servicios: body.servicioIds ? mockServices.filter((s) => body.servicioIds!.includes(s.id)) : c.servicios,
            }
          : c
      );
      return mockConsultations.find((c) => c.id === id)!;
    }
  },

  getServices: async () => {
    try {
      return await apiRequest<BackendServiceDto[]>("/services");
    } catch (err) {
      if (!isNetworkError(err)) throw err;
      return mockServices;
    }
  },

  lookupByFolio: async (folio: string): Promise<BackendFolioLookupDto> => {
    const normalized = folio.trim().toUpperCase();
    try {
      return await apiRequest<BackendFolioLookupDto>(`/public/folio/${encodeURIComponent(normalized)}`);
    } catch (err) {
      if (!isNetworkError(err)) throw err;
      const folioMap: Record<string, BackendFolioLookupDto> = {
        "BOB-2026-001": {
          folio: "BOB-2026-001",
          pacienteName: "Bobby",
          species: "Canino",
          breed: "Golden Retriever",
          tutorName: "Carlos Ramírez",
          nextAppointment: {
            scheduledDate: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 10),
            startTime: "09:00:00",
            endTime: "09:30:00",
            veterinarioName: "Dr. Julián Rivera",
            specialty: "general",
            status: "confirmed",
          },
          consultations: [
            {
              id: "con-2",
              startedAt: new Date(Date.now() - 86400000 * 14).toISOString(),
              reason: "Vacunación anual",
              diagnosis: "Apto para vacunación",
              treatment: "Vacuna antirrábica y séxtuple aplicadas",
              veterinarioName: "Dr. Julián Rivera",
              servicios: ["Vacuna Antirrábica", "Vacuna Séxtuple Canina"],
            },
          ],
        },
        "BOB-2026-002": {
          folio: "BOB-2026-002",
          pacienteName: "Mishi",
          species: "Felino",
          breed: "Siamés",
          tutorName: "Carlos Ramírez",
          nextAppointment: {
            scheduledDate: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
            startTime: "10:30:00",
            endTime: "11:00:00",
            veterinarioName: "Dra. Sofía Mendoza",
            specialty: "vacuna",
            status: "pending",
          },
          consultations: [
            {
              id: "con-m1",
              startedAt: new Date(Date.now() - 86400000 * 30).toISOString(),
              reason: "Control preventivo y desparasitación",
              diagnosis: "Paciente sano",
              treatment: "Antiparasitario oral dosis única",
              veterinarioName: "Dra. Sofía Mendoza",
              servicios: ["Consulta General", "Desparasitación Interna"],
            },
          ],
        },
        "BOB-2026-003": {
          folio: "BOB-2026-003",
          pacienteName: "Luna",
          species: "Canino",
          breed: "Husky Siberiano",
          tutorName: "María Fernanda López",
          nextAppointment: null,
          consultations: [
            {
              id: "con-1",
              startedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
              reason: "Prurito y enrojecimiento en piel",
              diagnosis: "Dermatitis alérgica estacional",
              treatment: "Baño medicado semanal y antihistamínico",
              veterinarioName: "Dr. Julián Rivera",
              servicios: ["Consulta General"],
            },
          ],
        },
      };
      const dynamicAppt = mockAppointments.find((a) => a.folio?.toUpperCase() === normalized);
      const found = folioMap[normalized] || (dynamicAppt ? {
        folio: dynamicAppt.folio || normalized,
        pacienteName: dynamicAppt.pacienteName,
        species: dynamicAppt.species,
        breed: dynamicAppt.breed,
        tutorName: dynamicAppt.tutorName,
        nextAppointment: {
          scheduledDate: dynamicAppt.scheduledDate,
          startTime: dynamicAppt.startTime,
          endTime: dynamicAppt.endTime,
          veterinarioName: dynamicAppt.veterinarioName,
          specialty: dynamicAppt.specialty,
          status: dynamicAppt.status,
        },
        consultations: mockConsultations
          .filter((c) => c.pacienteId === dynamicAppt.pacienteId)
          .map((c) => ({
            id: c.id,
            startedAt: c.startedAt,
            reason: c.reason,
            diagnosis: c.diagnosis,
            treatment: c.treatment,
            veterinarioName: c.veterinarioName,
            servicios: c.servicios.map((s) => s.name),
          })),
      } : undefined);
      if (!found) {
        throw new Error(`No se encontró ningún expediente con el folio "${normalized}".`);
      }
      return found;
    }
  },
};
