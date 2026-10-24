import type { ReactNode } from "react";

export type PatientSpecies = "Canino" | "Felino";

export type PatientStatus =
  | "Al día"
  | "En tratamiento"
  | "En seguimiento"
  | "Vacuna pendiente"
  | "En recuperación";

export interface Patient {
  id: string;
  name: string;
  chipId: string;
  photoUrl: string;
  species: PatientSpecies;
  breed: string;
  age: string;
  gender: string;
  ownerName: string;
  ownerContact: string;
  lastVisit: string;
  lastVisitType: string;
  status: PatientStatus;
  statusVariant: "success" | "warning" | "primary" | "secondary" | "ice";
}

export interface PatientsKpiItem {
  id: string;
  title: string;
  value: string;
  deltaText: string;
  deltaType: "success" | "warning" | "secondary";
  subtitle: string;
  icon: ReactNode;
  iconBg: string;
}

export type PatientFilterTab =
  | "todos"
  | "citas-pendientes"
  | "vacunas"
  | "nuevos";
