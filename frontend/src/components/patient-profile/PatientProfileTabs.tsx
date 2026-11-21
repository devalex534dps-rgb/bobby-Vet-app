import React from "react";
import { LayoutDashboard, Stethoscope } from "lucide-react";

export type ProfileTabId = "resumen" | "historial";

interface PatientProfileTabsProps {
  activeTab: ProfileTabId;
  onTabChange: (tab: ProfileTabId) => void;
  consultationsCount?: number;
}

export const PatientProfileTabs: React.FC<PatientProfileTabsProps> = ({
  activeTab,
  onTabChange,
  consultationsCount = 0,
}) => {
  const tabs = [
    {
      id: "resumen" as ProfileTabId,
      label: "Resumen del Expediente",
      icon: LayoutDashboard,
      badge: null as string | null,
    },
    {
      id: "historial" as ProfileTabId,
      label: "Historial de Consultas",
      icon: Stethoscope,
      badge: `${consultationsCount}`,
    },
  ];

  return (
    <div className="mt-6 flex items-center gap-1.5 overflow-x-auto pb-1 bg-surface-container-lowest/70 backdrop-blur-md p-1.5 rounded-xl border border-white/80 shadow-xs w-fit">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
              isActive
                ? "bg-primary-container text-white shadow-sm"
                : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/60"
            }`}
          >
            <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-on-surface-variant"}`} />
            <span>{tab.label}</span>
            {tab.badge !== null && (
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  isActive ? "bg-white/20 text-white" : "bg-surface-container-high text-on-surface-variant"
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
