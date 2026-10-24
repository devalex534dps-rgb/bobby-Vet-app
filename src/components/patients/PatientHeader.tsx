import React from "react";
import { Download, Plus } from "lucide-react";
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
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 py-2">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
          Gestión de Pacientes
        </h1>
        <p className="text-xs sm:text-sm text-on-surface-variant max-w-2xl leading-relaxed">
          Directorio clínico integral, trazabilidad de historiales y control de
          planes de bienestar preventivo para cada compañero animal.
        </p>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {/* Secondary Export Button */}
        <Button
          type="button"
          variant="outline"
          onClick={onExport}
          className="border-[#2c5eae] text-primary bg-surface-container-lowest/80 backdrop-blur-md shadow-xs hover:bg-surface-container-lowest font-semibold text-xs rounded-xl px-4 py-2"
        >
          <Download className="w-4 h-4 mr-1.5" />
          <span>Exportar directorio</span>
        </Button>

        {/* Primary New Patient Button */}
        <Button
          type="button"
          onClick={onNewPatient}
          className="bg-gradient-to-r from-primary-container to-secondary text-on-primary font-bold text-xs rounded-xl px-5 py-2 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all hover:scale-[1.01] active:scale-[0.99]"
        >
          <Plus className="w-4 h-4 mr-1" />
          <span>Nuevo Paciente</span>
        </Button>
      </div>
    </div>
  );
};
