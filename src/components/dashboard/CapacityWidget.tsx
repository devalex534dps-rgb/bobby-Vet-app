import React from "react";
import { Gauge } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { capacitySegmentsData } from "./mockData";
import type { CapacitySegment } from "./types";

interface CapacityWidgetProps {
  segments?: CapacitySegment[];
}

export const CapacityWidget: React.FC<CapacityWidgetProps> = ({
  segments = capacitySegmentsData,
}) => {
  return (
    <Card className="p-6 rounded-3xl bg-glass-fill backdrop-blur-xl border border-white/80 shadow-sm flex flex-col justify-between">
      <div>
        {/* Title and Badge */}
        <div className="flex items-center justify-between mb-1.5">
          <h3 className="text-lg font-bold text-on-surface">
            Distribución de Citas y Horarios
          </h3>
          <Badge variant="success" className="font-semibold text-xs px-2.5 py-0.5">
            Mezcla óptima
          </Badge>
        </div>
        <p className="text-xs text-on-surface-variant mb-4">
          Distribución de capacidad en segmentos de consulta para las próximas 48 horas.
        </p>

        {/* Multi-segment Progress Bar */}
        <div className="w-full h-3.5 rounded-full bg-surface-container-high overflow-hidden flex mb-5 shadow-inner">
          {segments.map((seg) => (
            <div
              key={seg.id}
              className={`h-full ${seg.colorBg} transition-all duration-300`}
              style={{ width: `${seg.percentage}%` }}
              title={`${seg.label}: ${seg.percentage}%`}
            />
          ))}
        </div>

        {/* 2x2 Grid of Proportion Metrics */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {segments.map((seg) => (
            <div
              key={seg.id}
              className="p-3 rounded-2xl bg-surface-container-low border border-white/60"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className={`w-2.5 h-2.5 rounded-full ${seg.colorBg}`} />
                <span className="text-xs font-medium text-on-surface truncate">
                  {seg.label}
                </span>
              </div>
              <div className="text-base font-bold text-on-surface">
                {seg.percentage}%{" "}
                <span className="text-xs font-normal text-on-surface-variant">
                  ({seg.turns} turnos)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Rotation Benchmark Bar */}
      <div className="flex items-center justify-between p-3 rounded-2xl bg-surface-container-high/60 border border-white/50">
        <div className="flex items-center gap-2">
          <Gauge className="w-4 h-4 text-primary" />
          <span className="text-xs text-on-surface">
            Tiempo promedio de rotación: <strong>34m</strong>
          </span>
        </div>
        <button
          type="button"
          className="text-xs font-bold text-primary hover:underline cursor-pointer"
        >
          Ver vista de cuadrícula →
        </button>
      </div>
    </Card>
  );
};
