import React, { useEffect, useState, useCallback } from "react";
import { Plus, Search, Check, X as XIcon, Trash2, Loader2, AlertCircle, X, Calendar, Clock, CheckCircle2, Filter } from "lucide-react";
import { StyledSelect } from "@/components/ui/StyledSelect";
import {
  bobbyApi,
  type BackendAppointmentDto,
  type BackendPatientDto,
  type BackendUserDto,
} from "@/services/bobbyApi";
import { useUsers } from "@/hooks/useUsers";
import { confirmDeleteAlert, showToast } from "@/lib/sweetalert";
import { validateRequired } from "@/lib/formValidation";

export const Appointments: React.FC = () => {
  const { currentUser } = useUsers();
  const isClient = currentUser.role === "CLIENTE";

  const [appointments, setAppointments] = useState<BackendAppointmentDto[]>([]);
  const [patients, setPatients] = useState<BackendPatientDto[]>([]);
  const [vets, setVets] = useState<BackendUserDto[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string | null>>({});

  const [pacienteId, setPacienteId] = useState("");
  const [veterinarioId, setVeterinarioId] = useState("");
  const [scheduledDate, setScheduledDate] = useState(new Date().toISOString().slice(0, 10));
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("10:30");
  const [specialty, setSpecialty] = useState("general");
  const [notes, setNotes] = useState("");

  const loadAppointments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await bobbyApi.getAppointments({ q, status: statusFilter, page, size: 8 });
      setAppointments(res.items);
      setTotalPages(res.totalPages);
      setTotalItems(res.totalItems);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error cargando citas.");
    } finally {
      setLoading(false);
    }
  }, [q, statusFilter, page]);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  const openModal = async () => {
    setModalError(null);
    setFieldErrors({});
    try {
      const [pRes, vRes] = await Promise.all([
        bobbyApi.getPatients({ page: 0, size: 50 }),
        bobbyApi.getVeterinarians(),
      ]);
      setPatients(pRes.items);
      setVets(vRes);
      if (pRes.items[0]) setPacienteId(pRes.items[0].id);
      if (vRes[0]) setVeterinarioId(vRes[0].id);
    } catch {
      // ignore
    }
    setShowModal(true);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);
    const nextErrs: Record<string, string | null> = {
      pacienteId: validateRequired(pacienteId, "El paciente"),
      veterinarioId: validateRequired(veterinarioId, "El veterinario"),
      scheduledDate: validateRequired(scheduledDate, "La fecha"),
      startTime: validateRequired(startTime, "La hora de inicio"),
      endTime: !endTime
        ? "La hora de fin es obligatoria."
        : endTime <= startTime
        ? "La hora de fin debe ser posterior a la de inicio."
        : null,
    };
    setFieldErrors(nextErrs);
    if (Object.values(nextErrs).some(Boolean)) return;

    setSaving(true);
    try {
      await bobbyApi.createAppointment({
        pacienteId,
        veterinarioId,
        scheduledDate,
        startTime: `${startTime}:00`,
        endTime: `${endTime}:00`,
        specialty,
        notes: notes.trim() || undefined,
      });
      setShowModal(false);
      setNotes("");
      showToast("success", "Cita agendada");
      loadAppointments();
    } catch (err) {
      setModalError(err instanceof Error ? err.message : "No se pudo agendar la cita.");
    } finally {
      setSaving(false);
    }
  };

  const handleStatus = async (id: string, status: string) => {
    if (status === "cancelled") {
      const confirmed = await confirmDeleteAlert("esta cita (se marcará como cancelada)");
      if (!confirmed) return;
    }
    try {
      await bobbyApi.updateAppointmentStatus(id, status);
      showToast("success", "Estado actualizado");
      loadAppointments();
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "No se pudo actualizar.");
    }
  };

  const handleDelete = async (c: BackendAppointmentDto) => {
    const confirmed = await confirmDeleteAlert(`la cita de ${c.pacienteName}`);
    if (!confirmed) return;
    try {
      await bobbyApi.deleteAppointment(c.id);
      showToast("success", "Cita eliminada");
      loadAppointments();
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "No se pudo eliminar.");
    }
  };

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      confirmed: "bg-emerald-100 text-emerald-700 border-emerald-200",
      pending: "bg-amber-100 text-amber-700 border-amber-200",
      in_progress: "bg-sky-100 text-sky-700 border-sky-200",
      completed: "bg-indigo-100 text-indigo-700 border-indigo-200",
      cancelled: "bg-red-100 text-red-700 border-red-200",
    };
    return map[status] || "bg-slate-100 text-slate-700";
  };

  return (
    <div className="relative w-full space-y-6">
      <div aria-hidden="true" className="pointer-events-none absolute -top-12 right-12 w-96 h-96 rounded-full bg-surface-ice/40 blur-[120px] -z-10" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
            Agenda Clínica
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
            Gestión de Citas
          </h1>
          <p className="text-sm text-on-surface-variant">
            Programa y administra citas médicas con notificaciones automáticas ({totalItems} registros).
          </p>
        </div>
        <button
          type="button"
          onClick={openModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#2c5ead] to-[#1591dc] text-white text-sm font-bold shadow-md shadow-[#2c5ead]/20 hover:opacity-95 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Agendar Cita
        </button>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card rounded-2xl p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-on-surface-variant">Total Citas</p>
            <p className="text-2xl font-extrabold text-on-surface">{totalItems}</p>
          </div>
        </div>
        <div className="glass-card rounded-2xl p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-on-surface-variant">Confirmadas</p>
            <p className="text-2xl font-extrabold text-on-surface">
              {appointments.filter((a) => a.status === "confirmed").length}
            </p>
          </div>
        </div>
        <div className="glass-card rounded-2xl p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-on-surface-variant">Pendientes</p>
            <p className="text-2xl font-extrabold text-on-surface">
              {appointments.filter((a) => a.status === "pending").length}
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card rounded-2xl p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-on-surface-variant absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={q}
            onChange={(e) => {
              setPage(0);
              setQ(e.target.value);
            }}
            placeholder="Buscar por mascota o veterinario..."
            className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-200/80 bg-white/90 text-sm focus:outline-none focus:ring-2 focus:ring-primary/25"
          />
        </div>
        <StyledSelect
          value={statusFilter}
          onChange={(val) => {
            setPage(0);
            setStatusFilter(val);
          }}
          icon={<Filter className="w-3.5 h-3.5" />}
          className="min-w-[185px]"
          options={[
            { value: "", label: "Estado: Todos" },
            { value: "pending", label: "Pendiente" },
            { value: "confirmed", label: "Confirmada" },
            { value: "in_progress", label: "En curso" },
            { value: "completed", label: "Completada" },
            { value: "cancelled", label: "Cancelada" },
          ]}
        />
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-error-container/40 text-error text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4" /> {error}
        </div>
      )}

      {/* Table */}
      <div className="glass-card rounded-2xl overflow-x-auto">
        {loading ? (
          <div className="py-12 flex justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="bg-surface-container-low/70 text-[11px] uppercase tracking-wider font-bold text-on-surface-variant">
              <tr>
                <th className="px-5 py-3.5">Fecha y Hora</th>
                <th className="px-5 py-3.5">Paciente / Tutor</th>
                <th className="px-5 py-3.5">Veterinario</th>
                <th className="px-5 py-3.5">Especialidad</th>
                <th className="px-5 py-3.5">Estado</th>
                <th className="px-5 py-3.5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/50">
              {appointments.map((c) => (
                <tr key={c.id} className="hover:bg-white/60 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="font-bold text-on-surface">{c.scheduledDate}</div>
                    <div className="text-xs text-on-surface-variant">
                      {c.startTime.slice(0, 5)} - {c.endTime.slice(0, 5)}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="font-bold text-on-surface">{c.pacienteName}</div>
                    <div className="text-xs text-on-surface-variant">
                      {c.tutorName} {c.folio ? `• ${c.folio}` : ""}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-on-surface-variant font-medium">{c.veterinarioName}</td>
                  <td className="px-5 py-3.5 capitalize text-on-surface-variant">{c.specialty}</td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${statusBadge(c.status)}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right space-x-1">
                    {!isClient && c.status === "pending" && (
                      <button
                        type="button"
                        onClick={() => handleStatus(c.id, "confirmed")}
                        className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 cursor-pointer"
                        title="Confirmar cita"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                    {c.status !== "cancelled" && c.status !== "completed" && (
                      <button
                        type="button"
                        onClick={() => handleStatus(c.id, "cancelled")}
                        className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50 cursor-pointer"
                        title="Cancelar cita"
                      >
                        <XIcon className="w-4 h-4" />
                      </button>
                    )}
                    {!isClient && (
                      <button
                        type="button"
                        onClick={() => handleDelete(c)}
                        className="p-1.5 rounded-lg text-on-surface-variant hover:text-error hover:bg-error-container/30 cursor-pointer"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {appointments.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-on-surface-variant">
                    No se encontraron citas registradas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 rounded-2xl glass-card text-xs text-on-surface-variant">
          <span>Página {page + 1} de {totalPages}</span>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-semibold disabled:opacity-50 cursor-pointer"
            >
              Anterior
            </button>
            <button
              type="button"
              disabled={page + 1 >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-semibold disabled:opacity-50 cursor-pointer"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/45 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl w-full max-w-lg p-6 sm:p-7 shadow-2xl border border-white/80 relative overflow-hidden space-y-5">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#2c5ead] via-[#1591dc] to-[#4bb8fa]" />

            <div className="flex items-center justify-between pt-1">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                  Nueva Reserva
                </span>
                <h2 className="font-display text-xl font-extrabold text-on-surface">
                  Agendar Cita Médica
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-2 rounded-xl text-on-surface-variant hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {modalError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                {modalError}
              </div>
            )}

            <form onSubmit={handleCreate} className="space-y-4" noValidate>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Paciente</label>
                <StyledSelect
                  value={pacienteId}
                  onChange={setPacienteId}
                  placeholder="Selecciona una mascota"
                  options={patients.map((p) => ({
                    value: p.id,
                    label: `${p.name} (${p.species})`,
                  }))}
                />
                {fieldErrors.pacienteId && <p className="text-xs text-red-500 font-medium mt-1">{fieldErrors.pacienteId}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Veterinario</label>
                <StyledSelect
                  value={veterinarioId}
                  onChange={setVeterinarioId}
                  placeholder="Selecciona un veterinario"
                  options={vets.map((v) => ({
                    value: v.id,
                    label: v.fullName,
                  }))}
                />
                {fieldErrors.veterinarioId && <p className="text-xs text-red-500 font-medium mt-1">{fieldErrors.veterinarioId}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Fecha</label>
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/25"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Inicio</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/25"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Fin</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/25"
                  />
                </div>
              </div>
              {fieldErrors.endTime && <p className="text-xs text-red-500 font-medium">{fieldErrors.endTime}</p>}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Especialidad</label>
                <StyledSelect
                  value={specialty}
                  onChange={setSpecialty}
                  options={[
                    { value: "general", label: "Consulta General" },
                    { value: "vacuna", label: "Vacunación" },
                    { value: "cirugia", label: "Cirugía" },
                    { value: "estetica", label: "Estética" },
                    { value: "guardia", label: "Urgencia" },
                  ]}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Notas (opcional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder="Indicaciones o motivo breve..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/25"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#2c5ead] via-[#1d4586] to-[#1591dc] text-white text-xs font-bold shadow-md shadow-[#2c5ead]/20 flex items-center gap-2 disabled:opacity-60 cursor-pointer"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  Agendar Cita
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;
