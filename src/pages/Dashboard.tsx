import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  PawPrint,
  Calendar,
  Stethoscope,
  Users,
  ArrowRight,
  Loader2,
  AlertCircle,
  Clock,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { useUsers } from "@/hooks/useUsers";
import { bobbyApi, type BackendDashboardSummaryDto } from "@/services/bobbyApi";

export const Dashboard: React.FC = () => {
  const { currentUser } = useUsers();
  const [summary, setSummary] = useState<BackendDashboardSummaryDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    bobbyApi
      .getDashboardSummary()
      .then(setSummary)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "No se pudo cargar el resumen.")
      )
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex items-center justify-center gap-2 text-on-surface-variant">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
        <span className="text-sm font-semibold">Cargando resumen clínico...</span>
      </div>
    );
  }

  return (
    <div className="relative w-full space-y-6">
      {/* Ambient Luminous Gradient Mesh */}
      <div
        aria-hidden="true"
        className="absolute -top-24 -left-20 w-96 h-96 rounded-full bg-secondary-container/20 blur-3xl pointer-events-none -z-10"
      />
      <div
        aria-hidden="true"
        className="absolute top-1/3 -right-24 w-[28rem] h-[28rem] rounded-full bg-surface-ice/40 blur-3xl pointer-events-none -z-10"
      />

      {/* Greeting Header */}
      <header className="space-y-1">
        <div className="flex items-center gap-2 flex-wrap">
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
            Bienvenido,{" "}
            <span className="text-primary">{currentUser.firstName}</span>
          </h2>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-primary-fixed text-primary text-[11px] font-bold uppercase tracking-wider">
            {currentUser.role}
          </span>
        </div>
        <p className="text-xs sm:text-sm text-on-surface-variant">
          Resumen operativo de pacientes, citas programadas y consultas médicas.
        </p>
      </header>

      {error && (
        <div className="p-4 rounded-2xl bg-error-container/40 text-error text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 1. Estadísticas (3 KPI Cards reales) */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5 rounded-2xl bg-glass-fill backdrop-blur-xl border border-white/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
              Pacientes Activos
            </span>
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <PawPrint className="w-5 h-5" />
            </div>
          </div>
          <span className="text-3xl font-extrabold text-on-surface tracking-tight">
            {summary?.totalPacientes ?? 0}
          </span>
          <p className="text-xs text-on-surface-variant mt-2">
            Expedientes registrados en clínica
          </p>
        </Card>

        <Card className="p-5 rounded-2xl bg-glass-fill backdrop-blur-xl border border-white/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
              Citas Programadas Hoy
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <span className="text-3xl font-extrabold text-on-surface tracking-tight">
            {summary?.citasHoy ?? 0}
          </span>
          <p className="text-xs text-on-surface-variant mt-2">
            Agenda clínica del día
          </p>
        </Card>

        <Card className="p-5 rounded-2xl bg-glass-fill backdrop-blur-xl border border-white/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
              Consultas Activas
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <Stethoscope className="w-5 h-5" />
            </div>
          </div>
          <span className="text-3xl font-extrabold text-on-surface tracking-tight">
            {summary?.consultasActivas ?? 0}
          </span>
          <p className="text-xs text-on-surface-variant mt-2">
            Atenciones médicas en curso
          </p>
        </Card>
      </section>

      {/* 2. Acciones Rápidas (en medio de estadísticas y datos previos) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Link
          to="/patients"
          className="glass-card rounded-2xl p-4 flex items-center gap-3 hover:bg-white transition-all"
        >
          <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <PawPrint className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-on-surface">Pacientes</p>
            <p className="text-[11px] text-on-surface-variant">Expedientes y tutores</p>
          </div>
        </Link>

        <Link
          to="/citas"
          className="glass-card rounded-2xl p-4 flex items-center gap-3 hover:bg-white transition-all"
        >
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-on-surface">Agenda de Citas</p>
            <p className="text-[11px] text-on-surface-variant">Programar y confirmar</p>
          </div>
        </Link>

        <Link
          to="/consultas"
          className="glass-card rounded-2xl p-4 flex items-center gap-3 hover:bg-white transition-all"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
            <Stethoscope className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-on-surface">Consultas</p>
            <p className="text-[11px] text-on-surface-variant">Diagnóstico y servicios</p>
          </div>
        </Link>

        {currentUser.role === "ADMIN" && (
          <Link
            to="/usuarios"
            className="glass-card rounded-2xl p-4 flex items-center gap-3 hover:bg-white transition-all"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-on-surface">Usuarios</p>
              <p className="text-[11px] text-on-surface-variant">Roles y accesos</p>
            </div>
          </Link>
        )}
      </section>

      {/* 3. Datos Previos: Próximas Citas y Consultas Recientes */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 rounded-3xl bg-glass-fill backdrop-blur-xl border border-white/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-on-surface">Próximas Citas</h3>
            <Link
              to="/citas"
              className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
            >
              <span>Ver agenda</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {summary?.upcomingAppointments.length ? (
            <div className="divide-y divide-slate-200/50">
              {summary.upcomingAppointments.map((c) => (
                <div key={c.id} className="py-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-on-surface">{c.pacienteName}</p>
                    <p className="text-xs text-on-surface-variant flex items-center gap-1.5 mt-0.5">
                      <Clock className="w-3.5 h-3.5 text-primary" />
                      <span>
                        {c.scheduledDate} • {c.startTime.slice(0, 5)} • {c.veterinarioName}
                      </span>
                    </p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-primary/10 text-primary">
                    {c.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-on-surface-variant py-8 text-center">
              No hay citas próximas programadas.
            </p>
          )}
        </Card>

        <Card className="p-6 rounded-3xl bg-glass-fill backdrop-blur-xl border border-white/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-on-surface">Consultas Recientes</h3>
            <Link
              to="/consultas"
              className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
            >
              <span>Ver consultas</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {summary?.recentConsultations.length ? (
            <div className="divide-y divide-slate-200/50">
              {summary.recentConsultations.map((c) => (
                <div key={c.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <Link
                      to={`/patients/${c.pacienteId}`}
                      className="text-sm font-bold text-on-surface hover:text-primary transition-colors"
                    >
                      {c.pacienteName}
                    </Link>
                    <p className="text-xs text-on-surface-variant truncate">
                      {c.reason} {c.diagnosis ? `— ${c.diagnosis}` : ""}
                    </p>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold shrink-0 ${
                      c.status === "active"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    {c.status === "active" ? "Activa" : "Cerrada"}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-on-surface-variant py-8 text-center">
              No hay consultas registradas todavía.
            </p>
          )}
        </Card>
      </section>
    </div>
  );
};

export default Dashboard;
