import React from "react";
import { MessageSquare } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { vaccineMetricsData } from "./mockData";
import type { VaccineMetric } from "./types";

interface VaccinationWidgetProps {
  metrics?: VaccineMetric[];
}

export const VaccinationWidget: React.FC<VaccinationWidgetProps> = ({
  metrics = vaccineMetricsData,
}) => {
  return (
    <Card className="p-6 rounded-3xl bg-glass-fill backdrop-blur-xl border border-white/80 shadow-sm flex flex-col justify-between">
      <div>
        {/* Title and Goal Badge */}
        <div className="flex items-center justify-between mb-1.5">
          <h3 className="text-lg font-bold text-on-surface">
            Cumplimiento de Vacunación y Bienestar
          </h3>
          <Badge variant="secondary" className="font-semibold text-xs px-2.5 py-0.5">
            Meta: 90%+
          </Badge>
        </div>
        <p className="text-xs text-on-surface-variant mb-5">
          Métricas activas de protección sanitaria basadas en cohortes de Metropolitan Health.
        </p>

        {/* 4 Vaccine Adherence Progress Lines */}
        <div className="flex flex-col gap-4 mb-5">
          {metrics.map((item) => (
            <div key={item.id}>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-medium text-on-surface">
                  {item.name}
                </span>
                <span className={`text-xs font-bold ${item.textColor}`}>
                  {item.percentage}%{" "}
                  <span className="text-on-surface-variant font-normal">
                    ({item.countCurrent.toLocaleString()} / {item.countTotal.toLocaleString()})
                  </span>
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-surface-container-high overflow-hidden">
                <div
                  className={`h-full ${item.barColor} rounded-full transition-all duration-500`}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recall Notification Strip */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 rounded-2xl bg-surface-ice/40 border border-white/70">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-secondary shrink-0" />
          <span className="text-xs text-on-surface font-medium">
            54 recordatorios de revacunación elegibles hoy
          </span>
        </div>
        <Button
          size="sm"
          variant="glass"
          className="w-full sm:w-auto text-xs font-bold text-primary px-3 py-1.5 rounded-xl shadow-xs hover:bg-white transition-all cursor-pointer"
        >
          Enviar WhatsApp / SMS
        </Button>
      </div>
    </Card>
  );
};
