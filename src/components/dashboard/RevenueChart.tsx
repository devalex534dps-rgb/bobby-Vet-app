import React, { useState } from "react";
import { Info } from "lucide-react";
import { Card } from "@/components/ui/card";

export const RevenueChart: React.FC = () => {
  const [activeTooltip, setActiveTooltip] = useState(true);

  return (
    <Card className="p-6 rounded-3xl bg-glass-fill backdrop-blur-xl border border-white/80 shadow-md mb-6">
      {/* Header and Summary Indicators */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-on-surface">
              Velocidad de Ingresos y Volumen de Pacientes
            </h2>
            <div className="group relative">
              <Info className="w-4 h-4 text-on-surface-variant cursor-pointer hover:text-primary transition-colors" />
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block w-64 p-2 bg-slate-900 text-white text-[11px] rounded-lg shadow-lg z-20">
                Métricas analíticas calculadas en base a facturación consolidada y visitas médicas.
              </div>
            </div>
          </div>
          <p className="text-xs text-on-surface-variant mt-1">
            Desglose integral comparando rutinas quirúrgicas de alto margen frente a visitas recurrentes de bienestar.
          </p>
        </div>

        {/* Metric Indicators Pill Group */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-container-low text-xs text-on-surface border border-white/60">
            <span className="text-on-surface-variant">Ticket promedio:</span>
            <span className="font-bold text-primary">$186.40</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-container-low text-xs text-on-surface border border-white/60">
            <span className="text-on-surface-variant">Velocidad MRR:</span>
            <span className="font-bold text-status-success">+14.2%</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-container-low text-xs text-on-surface border border-white/60">
            <span className="text-on-surface-variant">Tasa de inasistencia:</span>
            <span className="font-bold text-primary">1.8%</span>
          </div>
        </div>
      </div>

      {/* Visual Legend */}
      <div className="flex flex-wrap items-center gap-6 mb-4 pt-1">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-primary" />
          <span className="text-xs font-medium text-on-surface">Consultas</span>
          <span className="text-xs font-semibold text-on-surface-variant">$48.2k</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-secondary-container" />
          <span className="text-xs font-medium text-on-surface">Cirugía y Diagnóstico</span>
          <span className="text-xs font-semibold text-on-surface-variant">$22.8k</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-surface-ice" />
          <span className="text-xs font-medium text-on-surface">Bienestar y Vacunas</span>
          <span className="text-xs font-semibold text-on-surface-variant">$13.3k</span>
        </div>
      </div>

      {/* Area Chart: Smooth Bézier SVG with Interactive Coordinates */}
      <div
        className="w-full h-72 relative overflow-hidden select-none"
        onMouseEnter={() => setActiveTooltip(true)}
      >
        <svg
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
          viewBox="0 0 1000 280"
        >
          <defs>
            <linearGradient id="gradientPrimary" x1="0%" x2="0%" y1="0%" y2="100%">
              <stop offset="0%" stopColor="#024594" stopOpacity="0.32" />
              <stop offset="100%" stopColor="#024594" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="gradientSecondary" x1="0%" x2="0%" y1="0%" y2="100%">
              <stop offset="0%" stopColor="#4db2ff" stopOpacity="0.38" />
              <stop offset="100%" stopColor="#4db2ff" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Reference Gridlines */}
          <line x1="0" x2="1000" y1="40" y2="40" stroke="#c3c6d3" strokeWidth="1" strokeDasharray="4 4" strokeOpacity="0.35" />
          <line x1="0" x2="1000" y1="100" y2="100" stroke="#c3c6d3" strokeWidth="1" strokeDasharray="4 4" strokeOpacity="0.35" />
          <line x1="0" x2="1000" y1="160" y2="160" stroke="#c3c6d3" strokeWidth="1" strokeDasharray="4 4" strokeOpacity="0.35" />
          <line x1="0" x2="1000" y1="220" y2="220" stroke="#c3c6d3" strokeWidth="1" strokeDasharray="4 4" strokeOpacity="0.35" />

          {/* Secondary Stream Area Fill */}
          <path
            d="M 0 220 C 140 210, 220 180, 360 170 C 500 160, 620 120, 750 110 C 880 100, 940 70, 1000 65 L 1000 260 L 0 260 Z"
            fill="url(#gradientSecondary)"
          />

          {/* Primary High-Volume Consultations Area Fill */}
          <path
            d="M 0 170 C 120 150, 200 130, 340 100 C 480 70, 610 85, 740 45 C 870 10, 950 30, 1000 20 L 1000 260 L 0 260 Z"
            fill="url(#gradientPrimary)"
          />

          {/* Stroke Line 2: Surgery & Diagnostics */}
          <path
            d="M 0 220 C 140 210, 220 180, 360 170 C 500 160, 620 120, 750 110 C 880 100, 940 70, 1000 65"
            fill="none"
            stroke="#4db2ff"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Stroke Line 1: Consultations */}
          <path
            d="M 0 170 C 120 150, 200 130, 340 100 C 480 70, 610 85, 740 45 C 870 10, 950 30, 1000 20"
            fill="none"
            stroke="#024594"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Active Highlight Marker on Oct 24 (Day node x=740) */}
          <line
            x1="740"
            x2="740"
            y1="10"
            y2="260"
            stroke="#024594"
            strokeWidth="1.5"
            strokeDasharray="3 3"
            opacity="0.6"
          />
          <circle cx="740" cy="45" r="6" fill="#024594" stroke="#ffffff" strokeWidth="3" />
          <circle cx="740" cy="110" r="5" fill="#4db2ff" stroke="#ffffff" strokeWidth="2.5" />
        </svg>

        {/* Floating Data Glass Popover Tooltip for Oct 24 */}
        {activeTooltip && (
          <div className="absolute top-4 left-[74%] -translate-x-1/2 p-3 rounded-2xl bg-inverse-surface/95 text-inverse-on-surface backdrop-blur-md shadow-xl border border-white/20 transition-all duration-200 pointer-events-none hidden sm:block">
            <div className="text-[10px] font-semibold tracking-wider uppercase text-slate-300 mb-1">
              Oct 24 Volumen pico
            </div>
            <div className="text-sm font-bold text-white">
              $3,420.00 • 24 visitas
            </div>
            <div className="text-xs text-secondary-fixed-dim font-medium">
              Delta quirúrgico: +28%
            </div>
          </div>
        )}
      </div>

      {/* X-Axis Timeline Labels */}
      <div className="flex justify-between items-center px-1 pt-3 text-[11px] font-medium text-on-surface-variant">
        <span>Oct 01</span>
        <span>Oct 06</span>
        <span>Oct 12</span>
        <span>Oct 18</span>
        <span className="text-primary font-bold">Oct 24 (Hoy)</span>
        <span>Oct 30 (Proyectado)</span>
      </div>
    </Card>
  );
};
