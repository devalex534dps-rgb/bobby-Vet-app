import React from "react";
import {
  LayoutDashboard,
  FileSpreadsheet,
  Syringe,
  Pill,
  FlaskConical,
  FolderOpen,
} from "lucide-react";

export type ProfileTabId =
  | "resumen"
  | "historial"
  | "vacunas"
  | "recetas"
  | "laboratorio"
  | "archivos";

interface PatientProfileTabsProps {
  activeTab: ProfileTabId;
  onTabChange: (tab: ProfileTabId) => void;
}

export const PatientProfileTabs: React.FC<PatientProfileTabsProps> = ({
  activeTab,
  onTabChange,
}) => {
  const tabs = [
    {
      id: "resumen" as ProfileTabId,
      label: "Resumen",
      icon: LayoutDashboard,
      badge: null,
      badgeClass: "",
    },
    {
      id: "historial" as ProfileTabId,
      label: "Historial Médico",
      icon: FileSpreadsheet,
      badge: "14 eventos",
      badgeClass: "bg-surface-container-high text-on-surface-variant",
    },
    {
      id: "vacunas" as ProfileTabId,
      label: "Vacunas",
      icon: Syringe,
      badge: "Al día",
      badgeClass: "bg-status-success/20 text-on-surface",
    },
    {
      id: "recetas" as ProfileTabId,
      label: "Recetas",
      icon: Pill,
      badge: "2 activas",
      badgeClass: "bg-primary-fixed text-primary",
    },
    {
      id: "laboratorio" as ProfileTabId,
      label: "Resultados de Laboratorio",
      icon: FlaskConical,
      badge: "Sep 2024",
      badgeClass: "bg-surface-container-high text-on-surface-variant",
    },
    {
      id: "archivos" as ProfileTabId,
      label: "Archivos y Docs",
      icon: FolderOpen,
      badge: "6",
      badgeClass: "bg-surface-container-high text-on-surface-variant",
    },
  ];

  return (
    <div className="mt-6 flex items-center gap-1.5 overflow-x-auto pb-1 bg-surface-container-lowest/70 backdrop-blur-md p-1.5 rounded-xl border border-white/80 shadow-xs">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
              isActive
                ? "bg-primary-container text-white shadow-sm"
                : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/60"
            }`}
          >
            <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-on-surface-variant"}`} />
            <span>{tab.label}</span>
            {tab.badge && (
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  isActive ? "bg-white/20 text-white" : tab.badgeClass
                }`}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default PatientProfileTabs;
