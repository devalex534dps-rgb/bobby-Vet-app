import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, CheckCircle2, Loader2, AlertCircle, X, Stethoscope, Activity, Filter, FileText } from "lucide-react";
import { StyledSelect } from "@/components/ui/StyledSelect";
import {
  bobbyApi,
  type BackendConsultationDto,
  type BackendPatientDto,
  type BackendServiceDto,
} from "@/services/bobbyApi";
import { useUsers } from "@/hooks/useUsers";
import { showToast } from "@/lib/sweetalert";
import { validateRequired } from "@/lib/formValidation";

export const Consultations: React.FC = () => {
  const { currentUser } = useUsers();
  const canWrite = currentUser.role === "ADMIN" || currentUser.role === "VETERINARIO";

  const [consultations, setConsultations] = useState<BackendConsultationDto[]>([]);
  const [patients, setPatients] = useState<BackendPatientDto[]>([]);
  const [services, setServices] = useState<BackendServiceDto[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [closingTarget, setClosingTarget] = useState<BackendConsultationDto | null>(null);
  const [saving, setSaving] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string | null>>({});

  const [pacienteId, setPacienteId] = useState("");
  const [reason, setReason] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [treatment, setTreatment] = useState("");
  const [vitals, setVitals] = useState("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const loadConsultations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await bobbyApi.getConsultations({ q, status: statusFilter, page, size: 8 });
      setConsultations(res.items);
      setTotalPages(res.totalPages);
      setTotalItems(res.totalItems);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error cargando consultas.");
    } finally {
      setLoading(false);
    }
  }, [q, statusFilter, page]);

  useEffect(() => {
    loadConsultations();
  }, [loadConsultations]);

  const preloadOptions = async () => {
    try {
      const [pRes, sRes] = await Promise.all([
        bobbyApi.getPatients({ page: 0, size: 50 }),
        bobbyApi.getServices(),
      ]);
      setPatients(pRes.items);
      setServices(sRes);
      if (pRes.items[0] && !pacienteId) setPacienteId(pRes.items[0].id);
    } catch {
      // ignore
    }
  };

  const openStartModal = async () => {
    setClosingTarget(null);
    setReason("");
    setDiagnosis("");
    setTreatment("");
    setVitals("");
    setSelectedServices([]);
    setFieldErrors({});
    setModalError(null);
    await preloadOptions();
    setShowModal(true);
  };

  const openCloseModal = async (c: BackendConsultationDto) => {
    setClosingTarget(c);
    setDiagnosis(c.diagnosis || "");
    setTreatment(c.treatment || "");
    setVitals(c.vitals || "");
    setSelectedServices(c.servicios.map((s) => s.id));
    setFieldErrors({});
    setModalError(null);
    await preloadOptions();
    setShowModal(true);
  };

  const toggleService = (id: string) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);

    const nextErrs: Record<string, string | null> = {};
    if (closingTarget) {
      nextErrs.diagnosis = validateRequired(diagnosis, "El diagnóstico");
    } else {
      nextErrs.pacienteId = validateRequired(pacienteId, "El paciente");
      nextErrs.reason = validateRequired(reason, "El motivo");
    }
    setFieldErrors(nextErrs);
    if (Object.values(nextErrs).some(Boolean)) return;

    setSaving(true);
    try {
      if (closingTarget) {
        await bobbyApi.closeConsultation(closingTarget.id, {
          diagnosis: diagnosis.trim(),
          treatment: treatment.trim() || undefined,
          vitals: vitals.trim() || undefined,
          servicioIds: selectedServices,
        });
        showToast("success", "Consulta cerrada correctamente");
      } else {
        await bobbyApi.startConsultation({
          pacienteId,
          reason: reason.trim(),
          diagnosis: diagnosis.trim() || undefined,
          treatment: treatment.trim() || undefined,
          vitals: vitals.trim() || undefined,
          servicioIds: selectedServices,
        });
        showToast("success", "Consulta iniciada");
      }
      setShowModal(false);
      loadConsultations();
    } catch (err) {
      setModalError(err instanceof Error ? err.message : "No se pudo guardar la consulta.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="relative w-full space-y-6">
      <div aria-hidden="true" className="pointer-events-none absolute -top-12 right-12 w-96 h-96 rounded-full bg-surface-ice/40 blur-[120px] -z-10" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
            Atención Clínica
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
            Consultas Médicas
          </h1>
          <p className="text-sm text-on-surface-variant">
            Historial clínico, signos vitales y servicios aplicados ({totalItems} registros).
          </p>
        </div>
        {canWrite && (
          <button
            type="button"
            onClick={openStartModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#2c5ead] to-[#1591dc] text-white text-sm font-bold shadow-md shadow-[#2c5ead]/20 hover:opacity-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Nueva Consulta
          </button>
        )}
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="glass-card rounded-2xl p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-on-surface-variant">Total Consultas</p>
            <p className="text-2xl font-extrabold text-on-surface">{totalItems}</p>
          </div>
        </div>
        <div className="glass-card rounded-2xl p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-on-surface-variant">En Curso (Activas)</p>
            <p className="text-2xl font-extrabold text-on-surface">
              {consultations.filter((c) => c.status === "active").length}
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
            placeholder="Buscar por mascota, motivo o diagnóstico..."
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
          className="min-w-[180px]"
          options={[
            { value: "", label: "Estado: Todos" },
            { value: "active", label: "Activa" },
            { value: "closed", label: "Cerrada" },
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
                <th className="px-5 py-3.5">Paciente</th>
                <th className="px-5 py-3.5">Motivo / Diagnóstico</th>
                <th className="px-5 py-3.5">Servicios (N:M)</th>
                <th className="px-5 py-3.5">Veterinario</th>
                <th className="px-5 py-3.5">Estado</th>
                {canWrite && <th className="px-5 py-3.5 text-right">Acciones</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/50">
              {consultations.map((c) => (
                <tr key={c.id} className="hover:bg-white/60 transition-colors">
                  <td className="px-5 py-3.5 font-bold text-on-surface">{c.pacienteName}</td>
                  <td className="px-5 py-3.5">
                    <div className="font-semibold text-on-surface">{c.reason}</div>
                    {c.diagnosis && <div className="text-xs text-on-surface-variant">{c.diagnosis}</div>}
                    {c.vitals && <div className="text-[11px] text-primary font-medium mt-0.5">{c.vitals}</div>}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex flex-wrap gap-1">
                      {c.servicios.map((s) => (
                        <span key={s.id} className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[11px] font-semibold">
                          {s.name}
                        </span>
                      ))}
                      {c.servicios.length === 0 && <span className="text-xs text-on-surface-variant">—</span>}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-on-surface-variant font-medium">{c.veterinarioName}</td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        c.status === "active"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {c.status === "active" ? "Activa" : "Cerrada"}
                    </span>
                  </td>
                  {canWrite && (
                    <td className="px-5 py-3.5 text-right">
                      <div className="inline-flex items-center justify-end gap-1.5">
                        <Link
                          to={`/consultas/${c.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-primary/10 text-primary text-xs font-bold hover:bg-primary hover:text-white transition-colors"
                          title="Reportar lo observado en consulta"
                        >
                          <FileText className="w-3.5 h-3.5" /> Reportar
                        </Link>
                        {c.status === "active" && (
                          <button
                            type="button"
                            onClick={() => openCloseModal(c)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold hover:bg-emerald-100 cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> Cerrar
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
              {consultations.length === 0 && (
                <tr>
                  <td colSpan={canWrite ? 6 : 5} className="py-10 text-center text-on-surface-variant">
                    No se encontraron consultas.
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
            <button type="button" disabled={page === 0} onClick={() => setPage((p) => p - 1)} className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-semibold disabled:opacity-50 cursor-pointer">
              Anterior
            </button>
            <button type="button" disabled={page + 1 >= totalPages} onClick={() => setPage((p) => p + 1)} className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-semibold disabled:opacity-50 cursor-pointer">
              Siguiente
            </button>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/45 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl w-full max-w-lg p-6 sm:p-7 shadow-2xl border border-white/80 relative overflow-hidden space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#2c5ead] via-[#1591dc] to-[#4bb8fa]" />

            <div className="flex items-center justify-between pt-1">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                  {closingTarget ? "Cierre Clínico" : "Registro Clínico"}
                </span>
                <h2 className="font-display text-xl font-extrabold text-on-surface">
                  {closingTarget ? `Cerrar Consulta: ${closingTarget.pacienteName}` : "Nueva Consulta Médica"}
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

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {!closingTarget && (
                <>
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
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Motivo de consulta</label>
                    <input
                      type="text"
                      value={reason}
                      onChange={(e) => {
                        setReason(e.target.value);
                        setFieldErrors((p) => ({ ...p, reason: validateRequired(e.target.value, "El motivo") }));
                      }}
                      placeholder="Ej. Revisión general, prurito, vacuna..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/25"
                    />
                    {fieldErrors.reason && <p className="text-xs text-red-500 font-medium mt-1">{fieldErrors.reason}</p>}
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Diagnóstico {closingTarget ? "*" : "(opcional)"}
                </label>
                <textarea
                  value={diagnosis}
                  onChange={(e) => {
                    setDiagnosis(e.target.value);
                    if (closingTarget) setFieldErrors((p) => ({ ...p, diagnosis: validateRequired(e.target.value, "El diagnóstico") }));
                  }}
                  rows={2}
                  placeholder="Hallazgos clínicos y diagnóstico..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/25"
                />
                {fieldErrors.diagnosis && <p className="text-xs text-red-500 font-medium mt-1">{fieldErrors.diagnosis}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Tratamiento</label>
                <textarea
                  value={treatment}
                  onChange={(e) => setTreatment(e.target.value)}
                  rows={2}
                  placeholder="Indicaciones médicas o medicamento..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/25"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Signos vitales</label>
                <input
                  type="text"
                  value={vitals}
                  onChange={(e) => setVitals(e.target.value)}
                  placeholder="Ej. Temp: 38.5°C | FC: 90 lpm | Peso: 12 kg"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/25"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Servicios aplicados (N:M)</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto p-3 border border-slate-200 rounded-2xl bg-slate-50/70">
                  {services.map((s) => {
                    const checked = selectedServices.includes(s.id);
                    return (
                      <label
                        key={s.id}
                        className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                          checked
                            ? "bg-[#e0effe] border-[#2c5ead]/40 text-[#1d4586]"
                            : "bg-white border-slate-200/80 text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleService(s.id)}
                          className="accent-[#2c5ead]"
                        />
                        <span>{s.name}</span>
                      </label>
                    );
                  })}
                </div>
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
                  {closingTarget ? "Cerrar Consulta" : "Iniciar Consulta"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Consultations;
