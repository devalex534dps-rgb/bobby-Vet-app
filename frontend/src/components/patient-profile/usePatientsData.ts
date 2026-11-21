import { useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { bobbyApi, type BackendPatientDto } from "@/services/bobbyApi";
import type { Patient, PatientStatus, PatientSpecies } from "@/components/patients/types";

export const getStatusVariant = (
  estado: string
): "success" | "warning" | "primary" | "secondary" | "ice" => {
  switch (estado) {
    case "Al día":
      return "success";
    case "En tratamiento":
      return "warning";
    case "En seguimiento":
      return "primary";
    case "Vacuna pendiente":
      return "secondary";
    default:
      return "ice";
  }
};

const mapDtoToPatient = (dto: BackendPatientDto): Patient => {
  const estado = (dto.clinicalStatus || "Al día") as PatientStatus;
  const especie = (dto.species || "Canino") as PatientSpecies;
  const fallbackPhoto =
    especie === "Felino"
      ? "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=300&q=80"
      : "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=300&q=80";

  return {
    id: dto.id,
    nombre: dto.name,
    especie,
    raza: dto.breed,
    propietario: dto.ownerName,
    edad: dto.ageLabel || "1 año",
    estado,
    imagen: dto.photoUrl || fallbackPhoto,
    name: dto.name,
    species: especie,
    breed: dto.breed,
    ownerName: dto.ownerName,
    age: dto.ageLabel || "1 año",
    gender: dto.gender || "Macho",
    status: estado,
    statusVariant: getStatusVariant(estado),
    photoUrl: dto.photoUrl || fallbackPhoto,
    chipId: `VET-${dto.id.slice(0, 6).toUpperCase()}`,
    ownerContact: dto.ownerContact,
    lastVisit: "Reciente",
    lastVisitType: "Control clínico",
  };
};

export interface PatientsQueryParams {
  species?: string;
  status?: string;
  q?: string;
  page?: number;
  size?: number;
}

export const usePatientsData = (params?: PatientsQueryParams) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["patients", params?.species || "", params?.status || "", params?.q || "", params?.page ?? 0, params?.size ?? 10],
    queryFn: () =>
      bobbyApi.getPatients({
        species: params?.species && params.species !== "all" ? params.species : undefined,
        status: params?.status && params.status !== "all" ? params.status : undefined,
        q: params?.q || undefined,
        page: params?.page ?? 0,
        size: params?.size ?? 10,
      }),
    staleTime: 1000 * 30,
  });

  const patients: Patient[] = (query.data?.items ?? []).map(mapDtoToPatient);

  const getPatientById = useCallback(
    (id?: string): Patient | undefined => {
      if (!id) return undefined;
      return patients.find((p) => p.id === id || p.id.toLowerCase() === id.toLowerCase());
    },
    [patients]
  );

  const createPatient = useCallback(
    async (data: Partial<Patient>) => {
      const created = await bobbyApi.createPatient({
        name: data.nombre || data.name || "Nueva Mascota",
        species: ((data.especie || data.species || "Canino") as "Canino" | "Felino"),
        breed: data.raza || data.breed || "Mestizo",
        gender: data.gender || "Macho",
        ageLabel: data.edad || data.age || "1 año",
        clinicalStatus: data.estado || data.status || "Al día",
        ownerName: data.propietario || data.ownerName || "Propietario",
        ownerPhone: data.ownerContact || "+52 55 0000 0000",
        photoUrl: data.imagen || data.photoUrl,
      });
      await queryClient.invalidateQueries({ queryKey: ["patients"] });
      return mapDtoToPatient(created);
    },
    [queryClient]
  );

  const updatePatient = useCallback(
    async (id: string, updates: Partial<Patient>) => {
      const updated = await bobbyApi.updatePatient(id, {
        name: updates.nombre || updates.name || "Mascota",
        species: ((updates.especie || updates.species || "Canino") as "Canino" | "Felino"),
        breed: updates.raza || updates.breed || "Mestizo",
        gender: updates.gender,
        ageLabel: updates.edad || updates.age,
        clinicalStatus: updates.estado || updates.status,
        photoUrl: updates.imagen || updates.photoUrl,
        ownerName: updates.propietario || updates.ownerName,
      });
      await queryClient.invalidateQueries({ queryKey: ["patients"] });
      return mapDtoToPatient(updated);
    },
    [queryClient]
  );

  const deletePatient = useCallback(
    async (id: string) => {
      await bobbyApi.deletePatient(id);
      await queryClient.invalidateQueries({ queryKey: ["patients"] });
      return true;
    },
    [queryClient]
  );

  return {
    patients,
    totalItems: query.data?.totalItems ?? patients.length,
    totalPages: query.data?.totalPages ?? 1,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    getPatientById,
    createPatient,
    updatePatient,
    deletePatient,
  };
};

export default usePatientsData;
