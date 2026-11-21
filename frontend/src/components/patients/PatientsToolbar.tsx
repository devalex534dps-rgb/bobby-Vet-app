import React from "react";
import {
  Search,
  PawPrint,
  HeartPulse,
  X,
  Table as TableIcon,
  LayoutGrid,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { StyledSelect } from "@/components/ui/StyledSelect";
import type { PatientFilterTab } from "./types";
import { cn } from "@/lib/utils";

interface PatientsToolbarProps {
  currentTab: PatientFilterTab;
  onTabChange: (tab: PatientFilterTab) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  speciesFilter: string;
  onSpeciesFilterChange: (species: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  onResetFilters: () => void;
  viewMode: "table" | "grid";
  onViewModeChange: (mode: "table" | "grid") => void;
}

export const PatientsToolbar: React.FC<PatientsToolbarProps> = ({
  currentTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  speciesFilter,
  onSpeciesFilterChange,
  statusFilter,
  onStatusFilterChange,
  onResetFilters,
  viewMode,
  onViewModeChange,
}) => {
  return (
    <Card className="flex flex-col gap-3 mt-4 rounded-2xl bg-glass-fill backdrop-blur-xl p-4 shadow-sm border border-white/80">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Quick Segmented Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto p-1 rounded-xl bg-surface-container-low max-w-full">
          <button
            type="button"
            onClick={() => onTabChange("todos")}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer",
              currentTab === "todos"
                ? "bg-surface-container-lowest text-primary shadow-xs"
                : "text-on-surface-variant hover:text-on-surface"
            )}
          >
            Todos
          </button>

          <button
            type="button"
            onClick={() => onTabChange("citas-pendientes")}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer",
              currentTab === "citas-pendientes"
                ? "bg-surface-container-lowest text-primary shadow-xs"
                : "text-on-surface-variant hover:text-on-surface"
            )}
          >
            En seguimiento / tratamiento
          </button>

          <button
            type="button"
            onClick={() => onTabChange("vacunas")}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer",
              currentTab === "vacunas"
                ? "bg-surface-container-lowest text-primary shadow-xs"
                : "text-on-surface-variant hover:text-on-surface"
            )}
          >
            Vacuna pendiente
          </button>
        </div>

        {/* Search Input */}
        <div className="relative flex-1 lg:max-w-md">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-on-surface-variant pointer-events-none" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por nombre, raza o tutor..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-surface-container-lowest text-on-surface text-xs placeholder:text-on-surface-variant border-0 shadow-xs focus-visible:ring-1 focus-visible:ring-primary transition-all"
          />
        </div>
      </div>

      {/* Bottom Row: Filter Dropdowns & View Mode Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100/60">
        <div className="flex flex-wrap items-center gap-2">
          <StyledSelect
            value={speciesFilter}
            onChange={onSpeciesFilterChange}
            icon={<PawPrint className="w-3.5 h-3.5" />}
            buttonClassName="py-1.5 text-xs"
            options={[
              { value: "all", label: "Especie: Todas" },
              { value: "Canino", label: "Canino" },
              { value: "Felino", label: "Felino" },
            ]}
          />

          <StyledSelect
            value={statusFilter}
            onChange={onStatusFilterChange}
            icon={<HeartPulse className="w-3.5 h-3.5" />}
            buttonClassName="py-1.5 text-xs"
            options={[
              { value: "all", label: "Estado clínico: Todos" },
              { value: "Al día", label: "Al día" },
              { value: "En tratamiento", label: "En tratamiento" },
              { value: "En seguimiento", label: "En seguimiento" },
              { value: "Vacuna pendiente", label: "Vacuna pendiente" },
              { value: "En recuperación", label: "En recuperación" },
            ]}
          />

          {(speciesFilter !== "all" ||
            statusFilter !== "all" ||
            searchQuery.length > 0 ||
            currentTab !== "todos") && (
            <button
              type="button"
              onClick={onResetFilters}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-on-surface-variant hover:text-error text-xs font-medium transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Limpiar filtros</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-1 p-1 rounded-xl bg-surface-container-low border border-white/60">
          <button
            type="button"
            onClick={() => onViewModeChange("table")}
            className={cn(
              "p-1.5 rounded-lg transition-all cursor-pointer",
              viewMode === "table"
                ? "bg-surface-container-lowest text-primary shadow-xs"
                : "text-on-surface-variant hover:text-on-surface"
            )}
            title="Vista en tabla"
          >
            <TableIcon className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange("grid")}
            className={cn(
              "p-1.5 rounded-lg transition-all cursor-pointer",
              viewMode === "grid"
                ? "bg-surface-container-lowest text-primary shadow-xs"
                : "text-on-surface-variant hover:text-on-surface"
            )}
            title="Vista en cuadrícula"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Card>
  );
};
