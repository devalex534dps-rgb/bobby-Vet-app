import type { ReactNode } from "react";

export interface KpiMetric {
  id: string;
  title: string;
  value: string;
  unit?: string;
  delta: string;
  deltaDirection?: "up" | "down" | "neutral";
  deltaText?: string;
  subtitle: string;
  badgeType: "success" | "secondary" | "subtle";
  icon: ReactNode;
  iconBg: string;
  iconColor: string;
}

export type ConsultationStatus = "Completada" | "En consulta" | "Confirmada" | "Programada";

export interface Consultation {
  id: string;
  patientName: string;
  species: string;
  age: string;
  ownerName: string;
  service: string;
  status: ConsultationStatus;
  statusColor: string;
  statusDotBg?: string;
  isPulsing?: boolean;
  avatarBg: string;
  avatarColor: string;
  isFeline?: boolean;
  fee: string;
}

export type StockStatusType = "healthy" | "warning" | "danger";

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  quantity: string;
  statusText: string;
  statusType: StockStatusType;
  icon: ReactNode;
  iconColor: string;
}

export interface CapacitySegment {
  id: string;
  label: string;
  percentage: number;
  turns: number;
  colorBg: string;
}

export interface VaccineMetric {
  id: string;
  name: string;
  percentage: number;
  countCurrent: number;
  countTotal: number;
  barColor: string;
  textColor: string;
}

export interface QuickActionItem {
  id: string;
  title: string;
  subtitle: string;
  icon: ReactNode;
  iconBg: string;
  iconColor: string;
  onClick?: () => void;
}

export interface ActivityItem {
  id: string;
  title: string;
  timeAgo: string;
  description: ReactNode;
  icon: ReactNode;
  iconBg: string;
  iconColor: string;
}
