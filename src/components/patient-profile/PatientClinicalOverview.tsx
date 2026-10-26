import React, { useState } from "react";
import {
  ShieldAlert,
  AlertTriangle,
  ShieldCheck,
  Cpu,
  StickyNote,
  History,
  ArrowRight,
  FileText,
  Receipt,
  FileCheck,
  ChevronRight,
  FilePlus,
  Pill,
  UploadCloud,
} from "lucide-react";
import type { Patient } from "@/components/patients/types";
import { showSuccessToast } from "./patientAlerts";

interface PatientClinicalOverviewProps {
  patient: Patient;
}

export const PatientClinicalOverview: React.FC<PatientClinicalOverviewProps> = ({
  patient,
}) => {
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  const isCanine = (patient.especie || patient.species) === "Canino";

  const galleryPhotos = [
    patient.imagen || patient.photoUrl,
    isCanine
      ? "https://images.dog.ceo/breeds/retriever-golden/n02099601_225.jpg"
      : "https://cataas.com/cat?1",
    isCanine
      ? "https://images.dog.ceo/breeds/retriever-golden/n02099601_3004.jpg"
      : "https://cataas.com/cat?2",
    isCanine
      ? "https://images.dog.ceo/breeds/retriever-golden/n02099601_4966.jpg"
      : "https://cataas.com/cat?3",
  ];

  const handleQuickAction = (actionName: string) => {
    showSuccessToast(actionName, "Función ejecutada correctamente para este paciente.");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
      {/* Left Column: 8 Cols (Clinical Directives, Timeline, Gallery) */}
      <div className="lg:col-span-8 space-y-4">
        {/* 1. General Clinical Directives & Alerts */}
        <div className="p-5 rounded-2xl bg-glass-fill backdrop-blur-xl border border-white/80 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-primary" />
              <h3 className="text-base font-bold text-on-surface">
                Información General y Alertas de Salud
              </h3>
            </div>
            <button
              type="button"
              onClick={() => handleQuickAction("Nueva Alerta")}
              className="text-primary hover:text-secondary text-xs font-bold transition-colors cursor-pointer"
            >
              + Nueva Alerta
            </button>
          </div>

          {/* Health Badges / Flags */}
          <div className="flex flex-wrap gap-2 mt-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-status-warning/15 text-on-surface text-xs font-semibold">
              <AlertTriangle className="w-4 h-4 text-status-warning shrink-0" />
              <span>Alergia leve a la proteína de pollo (dieta de salmón indicada)</span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-fixed text-primary text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
              <span>Seguro Sanitario: PetPlan Platinum #8812</span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-high text-on-surface text-xs font-semibold">
              <Cpu className="w-4 h-4 text-secondary shrink-0" />
              <span>Microchip validado REIAC</span>
            </div>
          </div>

          {/* Permanent Clinical Directives Note Box */}
          <div className="mt-4 p-4 rounded-xl bg-surface-container-lowest/90 backdrop-blur-md border border-white/80 shadow-xs">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-surface-ice flex items-center justify-center text-primary shrink-0 mt-0.5">
                <StickyNote className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between flex-wrap gap-1">
                  <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                    Notas Clínicas Permanentes
                  </span>
                  <span className="text-[11px] text-on-surface-variant">
                    Actualizado por Dra. Eleanor Vance
                  </span>
                </div>
                <p className="text-xs text-on-surface mt-1.5 leading-relaxed font-normal">
                  Paciente muy sociable, tranquila y cooperativa en consulta. Responde con entusiasmo a premios de ternera hipoalergénica.{" "}
                  <strong className="font-semibold text-on-surface">Recomendación estacional:</strong> Ligera propensión a otitis eritematosa externa en meses de verano tras baños en playa; aplicar limpiador ótico preventivo semanalmente de junio a septiembre.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Recent Clinical Activity Timeline */}
        <div className="p-5 rounded-2xl bg-glass-fill backdrop-blur-xl border border-white/80 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-primary" />
              <h3 className="text-base font-bold text-on-surface">
                Timeline Reciente del Paciente
              </h3>
            </div>
            <button
              type="button"
              onClick={() => handleQuickAction("Historial Completo")}
              className="text-primary hover:text-secondary text-xs font-bold inline-flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>Ver los 14 eventos</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Chronological Flow */}
          <div className="space-y-4 relative pl-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-surface-container-high mt-4">
            {/* Event 1 */}
            <div className="relative group">
              <span className="absolute -left-[19px] top-1.5 w-3.5 h-3.5 rounded-full bg-primary ring-4 ring-surface-container-lowest shadow-xs" />
              <div className="p-4 rounded-xl bg-surface-container-lowest/80 backdrop-blur-md hover:bg-surface-container-lowest transition-all border border-white/70 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-on-surface">
                      Chequeo semestral & control citológico
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant text-[10px] font-bold">
                      Consulta General
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-on-surface-variant">
                    21 Octubre 2024
                  </span>
                </div>

                <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed font-normal">
                  Atendido por <strong className="text-on-surface font-semibold">Dr. Julian Rivera</strong>. Evaluación física completa, exploración de ganglios linfáticos normales, sin hallazgos patológicos en frotis auricular bilateral.
                </p>

                <div className="mt-2.5 flex items-center gap-3 text-xs text-primary font-medium flex-wrap">
                  <button
                    type="button"
                    onClick={() => handleQuickAction("Descargar Informe Citología")}
                    className="inline-flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Informe_Citologia_{patient.nombre || "Paciente"}.pdf</span>
                  </button>
                  <span className="text-outline-variant">•</span>
                  <button
                    type="button"
                    onClick={() => handleQuickAction("Descargar Factura")}
                    className="inline-flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <Receipt className="w-3.5 h-3.5" />
                    <span>Factura #B-2024-8921</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Event 2 */}
            <div className="relative group">
              <span className="absolute -left-[19px] top-1.5 w-3.5 h-3.5 rounded-full bg-secondary ring-4 ring-surface-container-lowest shadow-xs" />
              <div className="p-4 rounded-xl bg-surface-container-lowest/80 backdrop-blur-md hover:bg-surface-container-lowest transition-all border border-white/70 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-on-surface">
                      Vacunación Séxtuple Canina (DHPP) de Refuerzo
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant text-[10px] font-bold">
                      Inmunización
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-on-surface-variant">
                    15 Agosto 2024
                  </span>
                </div>

                <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed font-normal">
                  Aplicada por <strong className="text-on-surface font-semibold">Dra. Eleanor Vance</strong>. Lote Nobivac DHPPi #NK88102A. Tolerancia óptima sin reacción adversa inmediata.
                </p>

                <div className="mt-2.5 flex items-center gap-3 text-xs text-primary font-medium">
                  <button
                    type="button"
                    onClick={() => handleQuickAction("Ver Certificado Oficial")}
                    className="inline-flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <FileCheck className="w-3.5 h-3.5" />
                    <span>Certificado Oficial REIAC</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Event 3 */}
            <div className="relative group">
              <span className="absolute -left-[19px] top-1.5 w-3.5 h-3.5 rounded-full bg-surface-tint ring-4 ring-surface-container-lowest shadow-xs" />
              <div className="p-4 rounded-xl bg-surface-container-lowest/80 backdrop-blur-md hover:bg-surface-container-lowest transition-all border border-white/70 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-on-surface">
                      Dispensación Antiparasitario Interno / Externo
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant text-[10px] font-bold">
                      Farmacia
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-on-surface-variant">
                    02 Junio 2024
                  </span>
                </div>

                <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed font-normal">
                  Suministro de NexGard Spectra (15-30 kg) caja x 3 comprimidos masticables. Próxima toma recomendada a inicios de temporada otoñal.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Patient Photographic Dossier Carousel */}
        <div className="p-5 rounded-2xl bg-glass-fill backdrop-blur-xl border border-white/80 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
              Galería Fotográfica y Registro de Identificación
            </span>
            <span className="text-[11px] text-on-surface-variant font-mono">
              {activePhotoIndex + 1} / {galleryPhotos.length} Fotos
            </span>
          </div>

          <div className="mt-3 relative w-full h-56 sm:h-64 rounded-xl overflow-hidden bg-slate-100 border border-white/80 shadow-inner">
            <img
              src={galleryPhotos[activePhotoIndex]}
              alt={`Foto de ${patient.nombre}`}
              className="w-full h-full object-cover transition-all duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent flex items-end p-4">
              <span className="text-white text-xs font-semibold bg-black/40 backdrop-blur-md px-3 py-1 rounded-full">
                {patient.nombre} — {patient.raza}
              </span>
            </div>
          </div>

          {/* Thumbnail strip */}
          <div className="grid grid-cols-4 gap-2 mt-3">
            {galleryPhotos.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActivePhotoIndex(idx)}
                className={`h-16 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                  activePhotoIndex === idx
                    ? "border-primary ring-2 ring-primary/30 scale-[1.02]"
                    : "border-transparent opacity-75 hover:opacity-100"
                }`}
              >
                <img
                  src={img}
                  alt={`Thumb ${idx}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column: 4 Cols (Weight Sparkline, Adherence & Actions) */}
      <div className="lg:col-span-4 space-y-4">
        {/* Weight Analytics Mini Sparkline */}
        <div className="p-5 rounded-2xl bg-glass-fill backdrop-blur-xl border border-white/80 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
              Histórico de Peso
            </span>
            <span className="px-2 py-0.5 rounded-full bg-surface-container-low text-on-surface-variant text-[10px] font-mono">
              Últimos 12 meses
            </span>
          </div>

          <div className="flex items-baseline justify-between mt-2">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-extrabold text-on-surface">28.4</span>
              <span className="text-xs text-on-surface-variant font-medium">kg</span>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-status-success block font-bold">
                Condición Óptima
              </span>
              <span className="text-[10px] text-on-surface-variant">
                Rango ideal: 27 - 30 kg
              </span>
            </div>
          </div>

          {/* Custom SVG Sparkline Trend */}
          <div className="mt-4 pt-1">
            <svg className="w-full h-20 overflow-visible" viewBox="0 0 240 70">
              <defs>
                <linearGradient id="weightGrad" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#2C5EAD" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#2C5EAD" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Area */}
              <polygon
                fill="url(#weightGrad)"
                points="10,55 60,48 120,44 180,32 230,22 230,70 10,70"
              />
              {/* Stroke line */}
              <polyline
                fill="none"
                points="10,55 60,48 120,44 180,32 230,22"
                stroke="#2C5EAD"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
              />
              {/* Nodes */}
              <circle cx="10" cy="55" fill="#FFFFFF" r="3.5" stroke="#2C5EAD" strokeWidth="2" />
              <circle cx="60" cy="48" fill="#FFFFFF" r="3.5" stroke="#2C5EAD" strokeWidth="2" />
              <circle cx="120" cy="44" fill="#FFFFFF" r="3.5" stroke="#2C5EAD" strokeWidth="2" />
              <circle cx="180" cy="32" fill="#FFFFFF" r="3.5" stroke="#2C5EAD" strokeWidth="2" />
              <circle cx="230" cy="22" fill="#2C5EAD" r="4.5" stroke="#FFFFFF" strokeWidth="2" />
            </svg>

            <div className="flex justify-between text-[10px] font-mono text-on-surface-variant mt-2 px-1">
              <span>Nov 23 (27.2k)</span>
              <span>Mar 24 (27.8k)</span>
              <span>Jun 24 (28.1k)</span>
              <span className="text-primary font-bold">Oct 24 (28.4k)</span>
            </div>
          </div>
        </div>

        {/* Treatment Adherence & Clinical Financial Health */}
        <div className="p-5 rounded-2xl bg-glass-fill backdrop-blur-xl border border-white/80 shadow-sm space-y-4">
          {/* Adherence KPI */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-on-surface">Índice de Adherencia y Asistencia</span>
              <span className="text-status-success font-bold">98% Puntual</span>
            </div>
            <div className="w-full h-2 rounded-full bg-surface-container-high mt-2 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-secondary to-status-success transition-all duration-500"
                style={{ width: "98%" }}
              />
            </div>
            <p className="text-[11px] text-on-surface-variant mt-1.5 leading-normal">
              {(patient.propietario || "Tutor").split(" ")[0]} confirma citas en &lt; 2 horas vía Bobby WhatsApp bot.
            </p>
          </div>

          {/* Financial LTV Summary */}
          <div className="pt-2 border-t border-slate-100">
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
              Inversión Sanitaria Anual (LTV)
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-xl font-extrabold text-on-surface">$1,240.00</span>
              <span className="text-xs text-on-surface-variant font-medium">6 visitas / 12 meses</span>
            </div>
          </div>

          {/* Active Wellness Plan Details */}
          <div className="p-3.5 rounded-xl bg-gradient-to-br from-primary-fixed/40 to-surface-ice/40 border border-primary-fixed/60">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded-md bg-primary text-white text-[10px] font-bold">
                CARE+ FAMILIAR
              </span>
              <span className="text-[10px] text-on-surface-variant font-mono">
                Renovación Dic 2026
              </span>
            </div>
            <p className="text-xs text-on-surface font-medium mt-2 leading-relaxed">
              Consultas ilimitadas gratuitas • 20% descuento en quirófano y laboratorio.
            </p>
          </div>
        </div>

        {/* Quick Action Commands Module */}
        <div className="p-5 rounded-2xl bg-glass-fill backdrop-blur-xl border border-white/80 shadow-sm">
          <h4 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-3">
            Acciones Clínicas Rápidas
          </h4>

          <div className="grid grid-cols-1 gap-2">
            <button
              type="button"
              onClick={() => handleQuickAction("Nueva Nota Clínica")}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-surface-container-lowest/80 hover:bg-surface-container-low border border-white/70 shadow-2xs transition-colors text-left group cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-primary-fixed/60 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                  <FilePlus className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-on-surface block">
                    + Nueva Nota Clínica
                  </span>
                  <span className="text-[10px] text-on-surface-variant block">
                    Observaciones y evolución
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-outline-variant group-hover:translate-x-0.5 transition-transform" />
            </button>

            <button
              type="button"
              onClick={() => handleQuickAction("Emitir Receta Digital")}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-surface-container-lowest/80 hover:bg-surface-container-low border border-white/70 shadow-2xs transition-colors text-left group cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-secondary-fixed/60 flex items-center justify-center text-secondary group-hover:scale-105 transition-transform">
                  <Pill className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-on-surface block">
                    Emitir Receta Digital
                  </span>
                  <span className="text-[10px] text-on-surface-variant block">
                    Envío automático a tutor
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-outline-variant group-hover:translate-x-0.5 transition-transform" />
            </button>

            <button
              type="button"
              onClick={() => handleQuickAction("Subir Radiografía / Analítica")}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-surface-container-lowest/80 hover:bg-surface-container-low border border-white/70 shadow-2xs transition-colors text-left group cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface group-hover:scale-105 transition-transform">
                  <UploadCloud className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-on-surface block">
                    Subir Radiografía / Analítica
                  </span>
                  <span className="text-[10px] text-on-surface-variant block">
                    DICOM, PDF o imagen
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-outline-variant group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientClinicalOverview;
