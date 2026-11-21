import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  PawPrint,
  Stethoscope,
  Activity,
  CheckCircle2,
  Save,
  Loader2,
  AlertCircle,
  Thermometer,
  HeartPulse,
  Scale,
  ChevronDown,
  FileText,
} from "lucide-react";
import {
  bobbyApi,
  type BackendConsultationDto,
  type BackendPatientDto,
  type BackendServiceDto,
} from "@/services/bobbyApi";
import { showToast, bobbySwal } from "@/lib/sweetalert";
import { validateRequired } from "@/lib/formValidation";

export const ConsultationReport: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [consultation, setConsultation] = useState<BackendConsultationDto | null>(null);
  const [patient, setPatient] = useState<BackendPatientDto | null>(null);
  const [patientHistory, setPatientHistory] = useState<BackendConsultationDto[]>([]);
  const [showDossier, setShowDossier] = useState(false);
  const [services, setServices] = useState<BackendServiceDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form fields
  const [reason, setReason] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [treatment, setTreatment] = useState("");
  const [temp, setTemp] = useState("");
  const [heartRate, setHeartRate] = useState("");
  const [weight, setWeight] = useState("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string | null>>({});

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    Promise.all([bobbyApi.getConsultationById(id), bobbyApi.getServices()])
      .then(async ([con, srvs]) => {
        setConsultation(con);
        setServices(srvs);
        setReason(con.reason || "");
        setDiagnosis(con.diagnosis || "");
        setTreatment(con.treatment || "");
        setSelectedServices(con.servicios.map((s) => s.id));

        if (con.vitals) {
          const tMatch = con.vitals.match(/Temp:\s*([\d.]+)/i);
          const fcMatch = con.vitals.match(/FC:\s*(\d+)/i);
          const pMatch = con.vitals.match(/Peso:\s*([\d.]+)/i);
          if (tMatch) setTemp(tMatch[1]);
          if (fcMatch) setHeartRate(fcMatch[1]);
          if (pMatch) setWeight(pMatch[1]);
        }

        const [p, hist] = await Promise.all([
          bobbyApi.getPatientById(con.pacienteId).catch(() => null),
          bobbyApi.getConsultations({ pacienteId: con.pacienteId, page: 0, size: 10 }).catch(() => null),
        ]);
        setPatient(p);
        if (hist) {
          setPatientHistory(hist.items.filter((item) => item.id !== con.id));
        }
      })
      .catch((err) =>
        setError(err instanceof Error ? err.message : "No se pudo cargar la consulta.")
      )
      .finally(() => setLoading(false));
  }, [id]);

  const toggleService = (srvId: string) => {
    setSelectedServices((prev) =>
      prev.includes(srvId) ? prev.filter((x) => x !== srvId) : [...prev, srvId]
    );
  };

  const buildVitalsString = () => {
    const parts: string[] = [];
    if (temp.trim()) parts.push(`Temp: ${temp.trim()}°C`);
    if (heartRate.trim()) parts.push(`FC: ${heartRate.trim()} lpm`);
    if (weight.trim()) parts.push(`Peso: ${weight.trim()} kg`);
    return parts.join(" | ");
  };

  const handleSave = async (closeConsultation: boolean) => {
    if (!id) return;
    const nextErrs: Record<string, string | null> = {
      reason: validateRequired(reason, "El motivo de consulta"),
      diagnosis: closeConsultation
        ? validateRequired(diagnosis, "El diagnóstico / hallazgos")
        : null,
    };
    setFieldErrors(nextErrs);
    if (Object.values(nextErrs).some(Boolean)) return;

    if (closeConsultation) {
      const res = await bobbySwal.fire({
        title: "¿Cerrar consulta médica?",
        text: "El reporte quedará registrado en el historial clínico del paciente.",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí, guardar y cerrar",
        cancelButtonText: "Cancelar",
        reverseButtons: true,
      });
      if (!res.isConfirmed) return;
    }

    setSaving(true);
    try {
      const updated = await bobbyApi.updateConsultationReport(id, {
        reason: reason.trim(),
        diagnosis: diagnosis.trim(),
        treatment: treatment.trim() || undefined,
        vitals: buildVitalsString() || undefined,
        servicioIds: selectedServices,
        close: closeConsultation,
      });
      setConsultation(updated);
      showToast(
        "success",
        closeConsultation ? "Consulta cerrada y reportada" : "Reporte guardado"
      );
      if (closeConsultation) {
        navigate("/consultas");
      }
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "No se pudo guardar el reporte.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex items-center justify-center gap-2 text-on-surface-variant">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
        <span className="text-sm font-semibold">Cargando reporte clínico...</span>
      </div>
    );
  }

  if (error || !consultation) {
    return (
      <div className="space-y-4">
        <Link
          to="/consultas"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Volver a Consultas
        </Link>
        <div className="p-4 rounded-2xl bg-error-container/40 text-error text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4" /> {error || "Consulta no encontrada."}
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full space-y-6 pb-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-12 right-12 w-96 h-96 rounded-full bg-surface-ice/40 blur-[120px] -z-10"
      />

      {/* Breadcrumb & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 flex-wrap">
          <Link
            to="/consultas"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/80 border border-slate-200/80 text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver a Consultas</span>
          </Link>
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold ${
              consultation.status === "active"
                ? "bg-amber-100 text-amber-700"
                : "bg-emerald-100 text-emerald-700"
            }`}
          >
            {consultation.status === "active" ? "Consulta Activa" : "Consulta Cerrada"}
          </span>
        </div>

        <span className="text-xs text-on-surface-variant">
          Atiende: <strong className="text-on-surface">{consultation.veterinarioName}</strong> •{" "}
          {new Date(consultation.startedAt).toLocaleString()}
        </span>
      </div>

      {/* Patient Summary Banner */}
      <div className="glass-card rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#2c5ead] to-[#1591dc] text-white flex items-center justify-center shadow-sm shrink-0">
            <PawPrint className="w-7 h-7" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
              Paciente en Atención
            </span>
            <h2 className="font-display text-xl font-extrabold text-on-surface">
              {consultation.pacienteName}
              {patient ? ` (${patient.species} • ${patient.breed})` : ""}
            </h2>
            {patient && (
              <p className="text-xs text-on-surface-variant">
                Tutor: <strong>{patient.ownerName}</strong> ({patient.ownerContact}) • Edad:{" "}
                {patient.ageLabel || "N/D"}
              </p>
            )}
          </div>
        </div>
        {patient && (
          <button
            type="button"
            onClick={() => setShowDossier((prev) => !prev)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/85 border border-[#2c5ead]/30 text-xs font-bold text-[#024594] hover:bg-[#e0effe]/60 transition-all self-start sm:self-center cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{showDossier ? "Ocultar Expediente" : "Ver Expediente"}</span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                showDossier ? "rotate-180" : ""
              }`}
            />
          </button>
        )}
      </div>

      {/* Resumen desplegable del Expediente en la misma ventana */}
      {showDossier && patient && (
        <div className="glass-card rounded-3xl p-6 space-y-4 border-l-4 border-l-[#024594]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200/60">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                Resumen del Expediente Clínico
              </span>
              <h3 className="font-display text-base font-extrabold text-on-surface">
                {patient.name} — {patient.species} ({patient.breed})
              </h3>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold self-start sm:self-center">
              Estado: {patient.clinicalStatus}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-white/80 border border-slate-200/60">
              <span className="text-on-surface-variant block">Sexo / Edad</span>
              <strong className="text-on-surface">
                {patient.gender || "N/D"} • {patient.ageLabel || "N/D"}
              </strong>
            </div>
            <div className="p-3 rounded-xl bg-white/80 border border-slate-200/60">
              <span className="text-on-surface-variant block">Peso registrado</span>
              <strong className="text-on-surface">
                {patient.weightKg ? `${patient.weightKg} kg` : "N/D"}
              </strong>
            </div>
            <div className="p-3 rounded-xl bg-white/80 border border-slate-200/60">
              <span className="text-on-surface-variant block">Tutor</span>
              <strong className="text-on-surface">{patient.ownerName}</strong>
            </div>
            <div className="p-3 rounded-xl bg-white/80 border border-slate-200/60">
              <span className="text-on-surface-variant block">Contacto</span>
              <strong className="text-on-surface">{patient.ownerContact}</strong>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              Consultas Anteriores ({patientHistory.length})
            </h4>
            {patientHistory.length === 0 ? (
              <p className="text-xs text-on-surface-variant py-2">
                No hay consultas previas registradas para este paciente.
              </p>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {patientHistory.map((h) => (
                  <div
                    key={h.id}
                    className="p-3 rounded-xl bg-white/85 border border-slate-200/60 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <strong className="text-on-surface">{h.reason}</strong>
                      <span className="text-[11px] font-mono text-primary">
                        {new Date(h.startedAt).toLocaleDateString()}
                      </span>
                    </div>
                    {h.diagnosis && (
                      <p className="text-on-surface-variant">
                        <strong>Diagnóstico:</strong> {h.diagnosis}
                      </p>
                    )}
                    {h.treatment && (
                      <p className="text-on-surface-variant">
                        <strong>Tratamiento:</strong> {h.treatment}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Clinical Report Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Signos vitales + Diagnóstico y Tratamiento */}
        <div className="lg:col-span-8 glass-card rounded-3xl p-6 sm:p-7 space-y-5 relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#2c5ead] via-[#1591dc] to-[#4bb8fa]" />

          <div className="flex items-center gap-2 pt-1">
            <Stethoscope className="w-5 h-5 text-primary" />
            <h3 className="font-display text-lg font-extrabold text-on-surface">
              Reporte Clínico de Consulta
            </h3>
          </div>

          {/* Signos Vitales */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-surface-container-low/70 border border-white/80">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1.5">
                <Thermometer className="w-3.5 h-3.5 text-primary" /> Temperatura (°C)
              </label>
              <input
                type="text"
                value={temp}
                onChange={(e) => setTemp(e.target.value)}
                placeholder="38.5"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/25"
              />
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1.5">
                <HeartPulse className="w-3.5 h-3.5 text-rose-500" /> Frec. Cardíaca (lpm)
              </label>
              <input
                type="text"
                value={heartRate}
                onChange={(e) => setHeartRate(e.target.value)}
                placeholder="95"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/25"
              />
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1.5">
                <Scale className="w-3.5 h-3.5 text-emerald-600" /> Peso (kg)
              </label>
              <input
                type="text"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="22.0"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/25"
              />
            </div>
          </div>

          {/* Motivo */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Motivo de consulta
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                setFieldErrors((p) => ({
                  ...p,
                  reason: validateRequired(e.target.value, "El motivo de consulta"),
                }));
              }}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/25"
            />
            {fieldErrors.reason && (
              <p className="text-xs text-red-500 font-medium mt-1">{fieldErrors.reason}</p>
            )}
          </div>

          {/* Hallazgos / Diagnóstico */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Observaciones y Diagnóstico
            </label>
            <textarea
              value={diagnosis}
              onChange={(e) => {
                setDiagnosis(e.target.value);
                setFieldErrors((p) => ({
                  ...p,
                  diagnosis: validateRequired(e.target.value, "El diagnóstico / hallazgos"),
                }));
              }}
              rows={4}
              placeholder="Describe lo observado en la exploración física, síntomas y diagnóstico..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/25"
            />
            {fieldErrors.diagnosis && (
              <p className="text-xs text-red-500 font-medium mt-1">{fieldErrors.diagnosis}</p>
            )}
          </div>

          {/* Tratamiento e Indicaciones */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Tratamiento e Indicaciones
            </label>
            <textarea
              value={treatment}
              onChange={(e) => setTreatment(e.target.value)}
              rows={3}
              placeholder="Plan terapéutico, dosis, cuidados en casa y próxima revisión..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/25"
            />
          </div>
        </div>

        {/* Right: Servicios Aplicados (N:M) + Acciones */}
        <div className="lg:col-span-4 space-y-4">
          <div className="glass-card rounded-3xl p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              <h3 className="font-display text-base font-extrabold text-on-surface">
                Servicios Aplicados (N:M)
              </h3>
            </div>
            <p className="text-xs text-on-surface-variant">
              Selecciona los procedimientos o servicios realizados durante la consulta.
            </p>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {services.map((s) => {
                const checked = selectedServices.includes(s.id);
                return (
                  <label
                    key={s.id}
                    className={`flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                      checked
                        ? "bg-gradient-to-r from-[#024594] to-[#1591dc] text-white border-transparent shadow-sm"
                        : "bg-white/85 border-slate-200/80 text-on-surface hover:bg-[#e0effe]/60"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleService(s.id)}
                        className="accent-white"
                      />
                      <span className="truncate">{s.name}</span>
                    </div>
                    <span className={`text-[11px] shrink-0 ${checked ? "text-white/90" : "text-slate-500"}`}>
                      ${s.price}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="glass-card rounded-3xl p-5 space-y-3">
            <button
              type="button"
              disabled={saving}
              onClick={() => handleSave(false)}
              className="w-full py-2.5 px-4 rounded-xl border border-[#2c5ead] text-[#024594] bg-white/90 hover:bg-[#e0effe]/60 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-60"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Guardar Avance</span>
            </button>

            <button
              type="button"
              disabled={saving}
              onClick={() => handleSave(true)}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#2c5ead] via-[#1d4586] to-[#1591dc] text-white text-xs font-bold shadow-md shadow-[#2c5ead]/25 hover:opacity-95 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              <span>Guardar y Cerrar Consulta</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultationReport;
