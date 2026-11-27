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
  address?: string;
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
  ownerEmail?: string;
  ownerAddress?: string;
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

export const bobbyApi = {
  getDashboardSummary: (): Promise<BackendDashboardSummaryDto> =>
    apiRequest<BackendDashboardSummaryDto>("/dashboard/summary"),

  getUsers: (params?: { q?: string; role?: string; page?: number; size?: number }) => {
    const qs = new URLSearchParams();
    if (params?.q) qs.set("q", params.q);
    if (params?.role) qs.set("role", params.role);
    qs.set("page", String(params?.page ?? 0));
    qs.set("size", String(params?.size ?? 10));
    return apiRequest<BackendPage<BackendUserDto>>(`/users?${qs.toString()}`);
  },

  getUserById: (id: string) =>
    apiRequest<BackendUserDto>(`/users/${id}`),

  createUser: (body: {
    fullName: string;
    email: string;
    password: string;
    phone?: string;
    roleName: string;
  }) =>
    apiRequest<BackendUserDto>("/users", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  updateUser: (
    id: string,
    body: { fullName: string; phone?: string; roleName: string; active?: boolean }
  ) =>
    apiRequest<BackendUserDto>(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  deleteUser: (id: string) =>
    apiRequest<void>(`/users/${id}`, { method: "DELETE" }),

  getVeterinarians: () =>
    apiRequest<BackendUserDto[]>("/users/veterinarians"),

  getPatients: (params?: {
    species?: string;
    status?: string;
    q?: string;
    page?: number;
    size?: number;
  }) => {
    const qs = new URLSearchParams();
    if (params?.species) qs.set("species", params.species);
    if (params?.status) qs.set("status", params.status);
    if (params?.q) qs.set("q", params.q);
    qs.set("page", String(params?.page ?? 0));
    qs.set("size", String(params?.size ?? 10));
    return apiRequest<BackendPage<BackendPatientDto>>(`/patients?${qs.toString()}`);
  },

  getPatientById: (id: string) =>
    apiRequest<BackendPatientDto>(`/patients/${id}`),

  createPatient: (body: {
    tutorId?: string;
    ownerName?: string;
    ownerPhone?: string;
    ownerEmail?: string;
    ownerAddress?: string;
    name: string;
    species: "Canino" | "Felino";
    breed: string;
    gender?: string;
    ageLabel?: string;
    weightKg?: number;
    clinicalStatus?: string;
    photoUrl?: string;
  }) =>
    apiRequest<BackendPatientDto>("/patients", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  updatePatient: (
    id: string,
    body: {
      name: string;
      species: "Canino" | "Felino";
      breed: string;
      gender?: string;
      ageLabel?: string;
      weightKg?: number;
      clinicalStatus?: string;
      photoUrl?: string;
      ownerName?: string;
      ownerPhone?: string;
      ownerEmail?: string;
      ownerAddress?: string;
    }
  ) =>
    apiRequest<BackendPatientDto>(`/patients/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  deletePatient: (id: string) =>
    apiRequest<void>(`/patients/${id}`, { method: "DELETE" }),

  getTutors: (q?: string) => {
    const qs = new URLSearchParams();
    if (q) qs.set("q", q);
    const query = qs.toString();
    return apiRequest<BackendTutorDto[]>(query ? `/tutors?${query}` : "/tutors");
  },

  getTutorById: (id: string) =>
    apiRequest<BackendTutorDto>(`/tutors/${id}`),

  createTutor: (body: {
    usuarioId?: string;
    fullName: string;
    phone: string;
    email?: string;
    address?: string;
  }) =>
    apiRequest<BackendTutorDto>("/tutors", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  updateTutor: (
    id: string,
    body: {
      usuarioId?: string;
      fullName: string;
      phone: string;
      email?: string;
      address?: string;
    }
  ) =>
    apiRequest<BackendTutorDto>(`/tutors/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  deleteTutor: (id: string) =>
    apiRequest<void>(`/tutors/${id}`, { method: "DELETE" }),

  getAppointments: (params?: {
    status?: string;
    date?: string;
    q?: string;
    page?: number;
    size?: number;
  }) => {
    const qs = new URLSearchParams();
    if (params?.status) qs.set("status", params.status);
    if (params?.date) qs.set("date", params.date);
    if (params?.q) qs.set("q", params.q);
    qs.set("page", String(params?.page ?? 0));
    qs.set("size", String(params?.size ?? 10));
    return apiRequest<BackendPage<BackendAppointmentDto>>(
      `/appointments?${qs.toString()}`
    );
  },

  getAppointmentById: (id: string) =>
    apiRequest<BackendAppointmentDto>(`/appointments/${id}`),

  createAppointment: (body: {
    pacienteId: string;
    veterinarioId: string;
    scheduledDate: string;
    startTime: string;
    endTime: string;
    specialty: string;
    notes?: string;
  }) =>
    apiRequest<BackendAppointmentDto>("/appointments", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  updateAppointmentStatus: (id: string, status: string) =>
    apiRequest<BackendAppointmentDto>(`/appointments/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),

  deleteAppointment: (id: string) =>
    apiRequest<void>(`/appointments/${id}`, { method: "DELETE" }),

  getConsultations: (params?: {
    pacienteId?: string;
    status?: string;
    q?: string;
    page?: number;
    size?: number;
  }) => {
    const qs = new URLSearchParams();
    if (params?.pacienteId) qs.set("pacienteId", params.pacienteId);
    if (params?.status) qs.set("status", params.status);
    if (params?.q) qs.set("q", params.q);
    qs.set("page", String(params?.page ?? 0));
    qs.set("size", String(params?.size ?? 10));
    return apiRequest<BackendPage<BackendConsultationDto>>(
      `/consultations?${qs.toString()}`
    );
  },

  getConsultationById: (id: string) =>
    apiRequest<BackendConsultationDto>(`/consultations/${id}`),

  startConsultation: (body: {
    citaId?: string;
    pacienteId: string;
    reason: string;
    diagnosis?: string;
    treatment?: string;
    vitals?: string;
    servicioIds?: string[];
  }) =>
    apiRequest<BackendConsultationDto>("/consultations", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  closeConsultation: (
    id: string,
    body: {
      reason?: string;
      diagnosis: string;
      treatment?: string;
      vitals?: string;
      servicioIds?: string[];
    }
  ) =>
    apiRequest<BackendConsultationDto>(`/consultations/${id}/close`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  updateConsultationReport: (
    id: string,
    body: {
      reason?: string;
      diagnosis: string;
      treatment?: string;
      vitals?: string;
      servicioIds?: string[];
      close?: boolean;
    }
  ) => {
    const endpoint = body.close
      ? `/consultations/${id}/close`
      : `/consultations/${id}`;
    return apiRequest<BackendConsultationDto>(endpoint, {
      method: "PUT",
      body: JSON.stringify({
        reason: body.reason,
        diagnosis: body.diagnosis,
        treatment: body.treatment,
        vitals: body.vitals,
        servicioIds: body.servicioIds,
      }),
    });
  },

  getServices: () =>
    apiRequest<BackendServiceDto[]>("/services"),

  createService: (body: {
    name: string;
    category: string;
    price: number;
    description?: string;
  }) =>
    apiRequest<BackendServiceDto>("/services", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  updateService: (
    id: string,
    body: {
      name: string;
      category: string;
      price: number;
      description?: string;
    }
  ) =>
    apiRequest<BackendServiceDto>(`/services/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  deleteService: (id: string) =>
    apiRequest<void>(`/services/${id}`, { method: "DELETE" }),

  lookupByFolio: (folio: string): Promise<BackendFolioLookupDto> => {
    const normalized = folio.trim().toUpperCase();
    return apiRequest<BackendFolioLookupDto>(
      `/public/folio/${encodeURIComponent(normalized)}`
    );
  },
};
