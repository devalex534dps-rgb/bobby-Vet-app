import React from "react";
import {
  Search,
  PawPrint,
  SlidersHorizontal,
  HeartPulse,
  UserSquare,
  X,
  Table as TableIcon,
  LayoutGrid,
  ChevronDown,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
    <Card className="flex flex-col gap-3 mt-6 rounded-2xl bg-glass-fill backdrop-blur-xl p-4 shadow-sm border border-white/80">
      {/* Top Row: Segmented Filter Tabs & Search Bar */}
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
            Todos{" "}
            <span className="ml-1 text-on-surface-variant font-normal">
              (4,829)
            </span>
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
            Citas pendientes{" "}
            <span className="ml-1 font-normal text-on-surface-variant">
              (38)
            </span>
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
            Vacunas por aplicar{" "}
            <span className="ml-1 font-bold text-status-warning">(142)</span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange("nuevos")}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer",
              currentTab === "nuevos"
                ? "bg-surface-container-lowest text-primary shadow-xs"
                : "text-on-surface-variant hover:text-on-surface"
            )}
          >
            Nuevos ingresos{" "}
            <span className="ml-1 font-normal text-on-surface-variant">
              (148)
            </span>
          </button>
        </div>

        {/* Global Search Input with Keyboard Shortcut */}
        <div className="relative flex-1 lg:max-w-md">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-on-surface-variant pointer-events-none" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por nombre, microchip, tutor o teléfono..."
            className="w-full pl-9 pr-14 py-2 rounded-xl bg-surface-container-lowest text-on-surface text-xs placeholder:text-on-surface-variant border-0 shadow-xs focus-visible:ring-1 focus-visible:ring-primary transition-all"
          />
          <div className="absolute right-2.5 top-2 px-1.5 py-0.5 rounded bg-surface-container-high text-on-surface-variant text-[10px] font-mono font-bold select-none">
            ⌘K
          </div>
        </div>
      </div>

      {/* Bottom Row: Filter Dropdowns, Reset Action, and View Mode Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100/60">
        <div className="flex flex-wrap items-center gap-2">
          {/* Species Filter */}
          <div className="relative">
            <select
              value={speciesFilter}
              onChange={(e) => onSpeciesFilterChange(e.target.value)}
              className="appearance-none flex items-center gap-1.5 pl-8 pr-7 py-1.5 rounded-xl bg-surface-container-low hover:bg-surface-container-high text-on-surface text-xs font-medium transition-colors cursor-pointer border border-white/60 focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="all">Especie: Todas</option>
              <option value="Canino">Canino</option>
              <option value="Felino">Felino</option>
            </select>
            <PawPrint className="w-3.5 h-3.5 text-primary absolute left-2.5 top-2.5 pointer-events-none" />
            <ChevronDown className="w-3.5 h-3.5 text-on-surface-variant absolute right-2.5 top-2.5 pointer-events-none" />
          </div>

          {/* Breed Filter */}
          <div className="relative">
            <button
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-container-low hover:bg-surface-container-high text-on-surface text-xs font-medium transition-colors border border-white/60 cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-on-surface-variant" />
              <span>Raza: Todas</span>
              <ChevronDown className="w-3.5 h-3.5 text-on-surface-variant ml-1" />
            </button>
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              className="appearance-none flex items-center gap-1.5 pl-8 pr-7 py-1.5 rounded-xl bg-surface-container-low hover:bg-surface-container-high text-on-surface text-xs font-medium transition-colors cursor-pointer border border-white/60 focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="all">Estado clínico: Todos</option>
              <option value="Al día">Al día</option>
              <option value="En tratamiento">En tratamiento</option>
              <option value="En seguimiento">En seguimiento</option>
              <option value="Vacuna pendiente">Vacuna pendiente</option>
              <option value="En recuperación">En recuperación</option>
            </select>
            <HeartPulse className="w-3.5 h-3.5 text-on-surface-variant absolute left-2.5 top-2.5 pointer-events-none" />
            <ChevronDown className="w-3.5 h-3.5 text-on-surface-variant absolute right-2.5 top-2.5 pointer-events-none" />
          </div>

          {/* Owner Filter */}
          <div className="relative">
            <button
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-container-low hover:bg-surface-container-high text-on-surface text-xs font-medium transition-colors border border-white/60 cursor-pointer"
            >
              <UserSquare className="w-3.5 h-3.5 text-on-surface-variant" />
              <span>Propietario / Tutor</span>
              <ChevronDown className="w-3.5 h-3.5 text-on-surface-variant ml-1" />
            </button>
          </div>

          {/* Reset Filters */}
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

        {/* View Switcher */}
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
