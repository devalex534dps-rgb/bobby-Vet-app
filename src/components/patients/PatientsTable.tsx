import React, { useState } from "react";
import {
  FolderOpen,
  Calendar,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  PawPrint,
  Cat,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Patient } from "./types";
import { cn } from "@/lib/utils";

interface PatientsTableProps {
  patients: Patient[];
  viewMode?: "table" | "grid";
}

export const PatientsTable: React.FC<PatientsTableProps> = ({
  patients,
  viewMode = "table",
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState("10");

  const toggleSelectAll = () => {
    if (selectedIds.length === patients.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(patients.map((p) => p.id));
    }
  };

  const toggleSelectRow = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const getStatusBadge = (status: Patient["status"]) => {
    switch (status) {
      case "Al día":
        return (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-status-success/10 text-status-success text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-status-success" />
            <span>Al día</span>
          </div>
        );
      case "En tratamiento":
        return (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-status-warning/15 text-status-warning text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-status-warning animate-pulse" />
            <span>En tratamiento</span>
          </div>
        );
      case "En seguimiento":
        return (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-high text-primary text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span>En seguimiento</span>
          </div>
        );
      case "Vacuna pendiente":
        return (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-highest text-secondary text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
            <span>Vacuna pendiente</span>
          </div>
        );
      case "En recuperación":
        return (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-ice text-secondary text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
            <span>En recuperación</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="mt-4 rounded-2xl bg-glass-fill backdrop-blur-xl shadow-sm border border-white/80 overflow-hidden flex flex-col">
      {viewMode === "table" ? (
        <div className="overflow-x-auto w-full">
          <Table>
            {/* Table Header */}
            <TableHeader>
              <TableRow className="bg-surface-container-low/70 hover:bg-surface-container-low/70 border-b border-slate-200/50">
                <TableHead className="py-3.5 pl-4 pr-2 w-10">
                  <input
                    type="checkbox"
                    checked={
                      patients.length > 0 &&
                      selectedIds.length === patients.length
                    }
                    onChange={toggleSelectAll}
                    className="rounded bg-surface-container-lowest text-primary focus:ring-0 cursor-pointer"
                    aria-label="Seleccionar todos"
                  />
                </TableHead>
                <TableHead className="py-3.5 px-3">Paciente</TableHead>
                <TableHead className="py-3.5 px-3">Especie & Raza</TableHead>
                <TableHead className="py-3.5 px-3">Edad & Sexo</TableHead>
                <TableHead className="py-3.5 px-3">Propietario / Tutor</TableHead>
                <TableHead className="py-3.5 px-3">Última Visita</TableHead>
                <TableHead className="py-3.5 px-3">Estado</TableHead>
                <TableHead className="py-3.5 pl-3 pr-4 text-right">
                  Acciones
                </TableHead>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody>
              {patients.map((patient, index) => {
                const isSelected = selectedIds.includes(patient.id);
                const isAlt = index % 2 === 1;

                return (
                  <TableRow
                    key={patient.id}
                    className={cn(
                      "hover:bg-surface-container-lowest/70 transition-colors border-b border-slate-100 last:border-0",
                      isAlt && "bg-surface-container-low/20",
                      isSelected && "bg-primary-fixed/20"
                    )}
                  >
                    {/* Checkbox */}
                    <TableCell className="py-3 pl-4 pr-2">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectRow(patient.id)}
                        className="rounded bg-surface-container-lowest text-primary focus:ring-0 cursor-pointer"
                        aria-label={`Seleccionar ${patient.name}`}
                      />
                    </TableCell>

                    {/* Patient Photo, Name & Chip ID */}
                    <TableCell className="py-3 px-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 shadow-xs border border-white/80 bg-slate-100">
                          <img
                            src={patient.imagen || patient.photoUrl}
                            alt={patient.nombre || patient.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = "none";
                            }}
                          />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-bold text-on-surface hover:text-primary transition-colors cursor-pointer truncate">
                            {patient.nombre || patient.name}
                          </span>
                          <span className="text-[11px] font-mono text-on-surface-variant tracking-wider">
                            {patient.chipId || `#CHIP-${patient.id.slice(0, 4)}`}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    {/* Species & Breed */}
                    <TableCell className="py-3 px-3">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <Badge
                          variant={
                            (patient.especie || patient.species) === "Canino"
                              ? "ice"
                              : "secondary"
                          }
                          className="font-semibold text-xs px-2 py-0.5"
                        >
                          {patient.especie || patient.species}
                        </Badge>
                        <span className="text-xs text-on-surface-variant font-medium">
                          {patient.raza || patient.breed}
                        </span>
                      </div>
                    </TableCell>

                    {/* Age & Gender */}
                    <TableCell className="py-3 px-3 text-xs text-on-surface font-medium whitespace-nowrap">
                      {patient.edad || patient.age}
                      {patient.gender ? ` • ${patient.gender}` : ""}
                    </TableCell>

                    {/* Owner Name & Contact */}
                    <TableCell className="py-3 px-3">
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-on-surface">
                          {patient.propietario || patient.ownerName}
                        </span>
                        <span className="text-[11px] text-on-surface-variant">
                          {patient.ownerContact || "+34 600 000 000"}
                        </span>
                      </div>
                    </TableCell>

                    {/* Last Visit */}
                    <TableCell className="py-3 px-3">
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-on-surface">
                          {patient.lastVisit || "Reciente"}
                        </span>
                        <span className="text-[11px] text-on-surface-variant">
                          {patient.lastVisitType || "Chequeo"}
                        </span>
                      </div>
                    </TableCell>

                    {/* Status Badge */}
                    <TableCell className="py-3 px-3 whitespace-nowrap">
                      {getStatusBadge((patient.estado as any) || patient.status)}
                    </TableCell>

                    {/* Action Buttons */}
                    <TableCell className="py-3 pl-3 pr-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          className="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors cursor-pointer"
                          title="Ver Historial"
                          aria-label="Ver Historial"
                        >
                          <FolderOpen className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          className="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors cursor-pointer"
                          title="Agendar Cita"
                          aria-label="Agendar Cita"
                        >
                          <Calendar className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
                          title="Más opciones"
                          aria-label="Más opciones"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      ) : (
        /* Alternative Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
          {patients.map((patient) => (
            <Card
              key={patient.id}
              className="p-4 rounded-2xl bg-surface-container-lowest/80 border border-white/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 shadow-xs border border-white bg-slate-100">
                    <img
                      src={patient.imagen || patient.photoUrl}
                      alt={patient.nombre || patient.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-on-surface truncate">
                      {patient.nombre || patient.name}
                    </h4>
                    <p className="text-[11px] font-mono text-on-surface-variant">
                      {patient.chipId || `#CHIP-${patient.id.slice(0, 4)}`}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      {(patient.especie || patient.species) === "Canino" ? (
                        <PawPrint className="w-3 h-3 text-primary" />
                      ) : (
                        <Cat className="w-3 h-3 text-secondary" />
                      )}
                      <span className="text-[11px] text-on-surface-variant truncate">
                        {patient.raza || patient.breed}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-on-surface-variant space-y-1 py-2 border-t border-slate-100">
                  <div className="flex justify-between">
                    <span>Edad:</span>
                    <strong className="text-on-surface">
                      {patient.edad || patient.age}
                      {patient.gender ? ` • ${patient.gender}` : ""}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Tutor:</span>
                    <strong className="text-on-surface truncate max-w-[120px]">
                      {patient.propietario || patient.ownerName}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Última visita:</span>
                    <span className="text-on-surface font-medium">
                      {patient.lastVisit || "Reciente"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                {getStatusBadge((patient.estado as any) || patient.status)}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    className="p-1 rounded-lg text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                  >
                    <FolderOpen className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    className="p-1 rounded-lg text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                  >
                    <Calendar className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Table Footer with Pagination Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 bg-surface-container-low/50 border-t border-slate-200/50">
        <div className="flex items-center gap-4 text-xs text-on-surface-variant">
          <span>
            Mostrando <strong className="text-on-surface">1–8</strong> de{" "}
            <strong className="text-on-surface">4,829</strong> pacientes
          </span>
          <div className="h-4 w-px bg-surface-container-highest hidden sm:block" />
          <div className="flex items-center gap-1.5 text-xs text-on-surface-variant">
            <span>Filas por página:</span>
            <select
              value={rowsPerPage}
              onChange={(e) => setRowsPerPage(e.target.value)}
              className="bg-surface-container-lowest rounded-md px-2 py-0.5 text-on-surface text-xs focus:outline-none cursor-pointer border border-slate-200/60 shadow-xs"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
          </div>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-lowest transition-colors text-xs font-semibold disabled:opacity-50 cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Anterior</span>
          </button>
          <button
            type="button"
            className="w-7 h-7 rounded-lg bg-primary-container text-white text-xs font-bold flex items-center justify-center shadow-xs"
          >
            1
          </button>
          <button
            type="button"
            className="w-7 h-7 rounded-lg text-on-surface-variant hover:bg-surface-container-lowest text-xs font-medium flex items-center justify-center transition-colors cursor-pointer"
          >
            2
          </button>
          <button
            type="button"
            className="w-7 h-7 rounded-lg text-on-surface-variant hover:bg-surface-container-lowest text-xs font-medium flex items-center justify-center transition-colors cursor-pointer"
          >
            3
          </button>
          <span className="px-1 text-on-surface-variant text-xs font-bold">
            ...
          </span>
          <button
            type="button"
            className="w-7 h-7 rounded-lg text-on-surface-variant hover:bg-surface-container-lowest text-xs font-medium flex items-center justify-center transition-colors cursor-pointer"
          >
            604
          </button>
          <button
            type="button"
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-lowest transition-colors text-xs font-semibold cursor-pointer"
          >
            <span>Siguiente</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Card>
  );
};
