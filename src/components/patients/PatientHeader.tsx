import React from "react";
import { Download, Plus, PawPrint } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PatientHeaderProps {
  onNewPatient?: () => void;
  onExport?: () => void;
}

export const PatientHeader: React.FC<PatientHeaderProps> = ({
  onNewPatient,
  onExport,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-1">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2c5ead] to-[#1591dc] text-white flex items-center justify-center shadow-sm shrink-0">
          <PawPrint className="w-5 h-5" />
        </div>
        <div>
          <h2 className="font-display text-lg sm:text-xl font-extrabold tracking-tight bg-gradient-to-r from-[#0c1b33] to-[#2c5ead] bg-clip-text text-transparent">
            Directorio clínico de pacientes, tutores y estado médico actual.
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {/* Botón Exportar directorio con animación hover de relleno de color */}
        <button
          type="button"
          onClick={onExport}
          className="relative overflow-hidden group inline-flex items-center justify-center border border-[#024594] text-[#024594] bg-surface-container-lowest/80 backdrop-blur-md shadow-xs font-semibold text-xs rounded-xl px-4 py-2.5 transition-colors duration-300 cursor-pointer"
        >
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-[#024594] to-[#1591dc] -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"
          />
          <Download className="w-4 h-4 mr-1.5 relative z-10 transition-colors duration-300 group-hover:text-white" />
          <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
            Exportar directorio
          </span>
        </button>

        {/* Primary New Patient Button */}
        <Button
          type="button"
          onClick={onNewPatient}
          className="bg-gradient-to-r from-primary-container to-secondary text-on-primary font-bold text-xs rounded-xl px-5 py-2.5 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all hover:scale-[1.01] active:scale-[0.99]"
        >
          <Plus className="w-4 h-4 mr-1" />
          <span>Nuevo Paciente</span>
        </Button>
      </div>
    </div>
  );
};
