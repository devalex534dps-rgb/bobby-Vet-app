import React from "react";
import {
  PawPrint,
  UserCheck,
  Activity,
  Syringe,
} from "lucide-react";
import type { PatientsKpiItem } from "./types";

export const patientsKpiData: PatientsKpiItem[] = [
  {
    id: "kpi-total-patients",
    title: "Total Pacientes",
    value: "4,829",
    deltaText: "+12.4% vs mes ant.",
    deltaType: "success",
    subtitle: "100% sincronizados",
    icon: React.createElement(PawPrint, { className: "w-5 h-5 text-primary" }),
    iconBg: "bg-surface-ice/60",
  },
  {
    id: "kpi-new-this-month",
    title: "Nuevos este mes",
    value: "148",
    deltaText: "+18.2% crecimiento",
    deltaType: "success",
    subtitle: "14 esta semana",
    icon: React.createElement(UserCheck, { className: "w-5 h-5 text-primary" }),
    iconBg: "bg-primary-fixed/60",
  },
  {
    id: "kpi-active-patients",
    title: "Pacientes Activos",
    value: "4,210",
    deltaText: "87.2% recurrencia",
    deltaType: "secondary",
    subtitle: "Últimos 6 meses",
    icon: React.createElement(Activity, { className: "w-5 h-5 text-secondary" }),
    iconBg: "bg-surface-container-high",
  },
  {
    id: "kpi-upcoming-vaccines",
    title: "Próximas Vacunas",
    value: "142",
    deltaText: "Prevención crítica",
    deltaType: "warning",
    subtitle: "88 SMS enviados",
    icon: React.createElement(Syringe, { className: "w-5 h-5 text-status-warning" }),
    iconBg: "bg-surface-container-high",
  },
];
