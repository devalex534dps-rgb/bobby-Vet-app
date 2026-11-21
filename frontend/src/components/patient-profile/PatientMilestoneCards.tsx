import React from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, Stethoscope, CheckCircle2 } from "lucide-react";
import type { BackendAppointmentDto, BackendConsultationDto } from "@/services/bobbyApi";

interface PatientMilestoneCardsProps {
  nextAppointment?: BackendAppointmentDto | null;
  lastConsultation?: BackendConsultationDto | null;
}

export const PatientMilestoneCards: React.FC<PatientMilestoneCardsProps> = ({
  nextAppointment,
  lastConsultation,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          {nextAppointment ? (
            <>
              <div className="text-base font-bold text-on-surface">
                {nextAppointment.scheduledDate}
              </div>
              <div className="inline-flex items-center gap-1.5 text-secondary text-xs font-semibold mt-1">
                <Clock className="w-3.5 h-3.5" />
                <span>
                  {nextAppointment.startTime.slice(0, 5)} -{" "}
                  {nextAppointment.endTime.slice(0, 5)}
                </span>
              </div>
              <p className="text-xs text-on-surface-variant mt-2 capitalize font-medium">
                {nextAppointment.specialty} {nextAppointment.notes ? `• ${nextAppointment.notes}` : ""}
              </p>
            </>
          ) : (
            <p className="text-sm text-on-surface-variant py-3">
              Sin citas próximas programadas.
            </p>
          )}
        </div>

        <div className="pt-4 mt-3 flex items-center justify-between border-t border-slate-100/80">
          <div className="text-[11px] leading-tight">
            <p className="font-semibold text-on-surface">
              {nextAppointment ? nextAppointment.veterinarioName : "Agenda abierta"}
            </p>
            <p className="text-on-surface-variant">
              {nextAppointment ? `Estado: ${nextAppointment.status}` : "Disponible para agendar"}
            </p>
          </div>

          <Link
            to="/citas"
            className="px-3 py-1.5 rounded-lg bg-surface-container-high hover:bg-primary hover:text-white text-on-surface text-xs font-semibold transition-colors"
          >
            Ver Citas
          </Link>
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

          {lastConsultation ? (
            <>
              <div className="text-base font-bold text-on-surface">
                {new Date(lastConsultation.startedAt).toLocaleDateString()}
              </div>
              <p className="text-xs text-on-surface-variant mt-1 font-medium">
                {lastConsultation.reason}
              </p>
              {lastConsultation.diagnosis && (
                <div className="p-2.5 rounded-xl bg-surface-container-low/70 mt-2 border border-slate-200/50">
                  <p className="text-xs text-on-surface line-clamp-2 leading-relaxed">
                    <span className="font-semibold">Diagnóstico:</span>{" "}
                    {lastConsultation.diagnosis}
                  </p>
                </div>
              )}
            </>
          ) : (
            <p className="text-sm text-on-surface-variant py-3">
              Sin consultas registradas aún.
            </p>
          )}
        </div>

        <div className="pt-4 mt-3 flex items-center justify-between text-xs border-t border-slate-100/80">
          {lastConsultation ? (
            <>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-status-success/15 text-status-success text-[11px] font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {lastConsultation.status === "active" ? "En curso" : "Cerrada"}
              </span>
              <span className="text-on-surface-variant">
                {lastConsultation.veterinarioName}
              </span>
            </>
          ) : (
            <Link to="/consultas" className="text-xs font-semibold text-primary hover:underline">
              Ir a Consultas →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
