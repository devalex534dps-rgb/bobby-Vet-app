import React from "react";
import {
  Calendar,
  Clock,
  Stethoscope,
  CheckCircle2,
  ShieldCheck,
  BellRing,
} from "lucide-react";
import type { Patient } from "@/components/patients/types";

interface PatientMilestoneCardsProps {
  patient: Patient;
}

export const PatientMilestoneCards: React.FC<PatientMilestoneCardsProps> = ({
  patient,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Card 1: Próxima Cita */}
      <div className="p-5 rounded-2xl bg-glass-fill backdrop-blur-xl border border-white/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-secondary-container/10 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-secondary" />
              Próxima Cita
            </span>
            <span className="w-8 h-8 rounded-lg bg-secondary-fixed/50 flex items-center justify-center text-secondary">
              <Calendar className="w-4 h-4" />
            </span>
          </div>

          <div className="text-base font-bold text-on-surface">
            Jueves, 7 de Noviembre
          </div>

          <div className="inline-flex items-center gap-1.5 text-secondary text-xs font-semibold mt-1">
            <Clock className="w-3.5 h-3.5" />
            <span>10:30 AM (45 min)</span>
          </div>

          <p className="text-xs text-on-surface-variant mt-2 line-clamp-1 font-medium">
            Limpieza dental preventiva y revisión anual
          </p>
        </div>

        <div className="pt-4 mt-2 flex items-center justify-between border-t border-slate-100/80">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-primary-fixed text-primary text-xs flex items-center justify-center font-bold">
              JR
            </div>
            <div className="text-[11px] leading-tight">
              <p className="font-semibold text-on-surface">Dr. Julian Rivera</p>
              <p className="text-on-surface-variant">Box 2 • Odontología</p>
            </div>
          </div>

          <button
            type="button"
            className="px-2.5 py-1.5 rounded-lg bg-surface-container-high hover:bg-primary hover:text-white text-on-surface text-xs font-semibold transition-colors cursor-pointer"
          >
            Gestionar Cita
          </button>
        </div>
      </div>

      {/* Card 2: Última Consulta */}
      <div className="p-5 rounded-2xl bg-glass-fill backdrop-blur-xl border border-white/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-status-success" />
              Última Consulta
            </span>
            <span className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
              <Stethoscope className="w-4 h-4" />
            </span>
          </div>

          <div className="text-base font-bold text-on-surface">
            {patient.lastVisit || "Hace 3 días (21 Oct 2024)"}
          </div>

          <p className="text-xs text-on-surface-variant mt-1 font-medium">
            {patient.lastVisitType || "Chequeo de bienestar general y citología de control"}
          </p>

          <div className="p-2.5 rounded-xl bg-surface-container-low/70 mt-2 border border-slate-200/50">
            <p className="text-xs text-on-surface line-clamp-2 leading-relaxed">
              <span className="font-semibold">Diagnóstico:</span> Sin anomalías dérmicas, peso óptimo, condición corporal 5/9 normal.
            </p>
          </div>
        </div>

        <div className="pt-4 mt-2 flex items-center justify-between text-xs border-t border-slate-100/80">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-status-success/15 text-status-success text-[11px] font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" /> Facturada y Cerrada
          </span>
          <span className="text-base font-bold text-on-surface">$185.00</span>
        </div>
      </div>

      {/* Card 3: Estado de Vacunación */}
      <div className="p-5 rounded-2xl bg-glass-fill backdrop-blur-xl border border-white/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-status-success/10 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-status-success" />
              Inmunización Preventiva
            </span>
            <span className="w-8 h-8 rounded-lg bg-status-success/20 flex items-center justify-center text-status-success">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-base font-bold text-on-surface">100% Al día</div>
            <span className="px-2 py-0.5 rounded-full bg-status-success text-white text-[10px] font-bold">
              Protegida
            </span>
          </div>

          <div className="mt-2 space-y-1 text-xs">
            <p className="text-on-surface-variant">
              <strong className="font-semibold text-on-surface">Última:</strong> Séxtuple DHPP (hace 2 meses)
            </p>
            <p className="text-on-surface-variant">
              <strong className="font-semibold text-on-surface">Próximo hito:</strong> Rabia anual en{" "}
              <span className="text-secondary font-bold">68 días</span> (15 Ene 2026)
            </p>
          </div>
        </div>

        <div className="pt-4 mt-2 flex items-center gap-2 text-xs bg-secondary-fixed/40 px-3 py-1.5 rounded-lg text-on-secondary-fixed-variant border border-secondary-fixed/60">
          <BellRing className="w-3.5 h-3.5 text-secondary shrink-0" />
          <span className="text-[11px] font-medium truncate">
            Recordatorio por WhatsApp programado (-15 días)
          </span>
        </div>
      </div>
    </div>
  );
};

export default PatientMilestoneCards;
