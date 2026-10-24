import React from "react";
import { Card } from "@/components/ui/card";
import { activityFeedData } from "./mockData";
import type { ActivityItem } from "./types";
import { cn } from "@/lib/utils";

interface ActivityFeedProps {
  activities?: ActivityItem[];
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({
  activities = activityFeedData,
}) => {
  return (
    <Card className="p-6 rounded-3xl bg-glass-fill backdrop-blur-xl border border-white/80 shadow-sm flex flex-col justify-between">
      <div>
        {/* Header with Pulse Dot & Action */}
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-on-surface">
              Flujo de Actividad Ejecutiva
            </h3>
            <span className="w-2 h-2 rounded-full bg-status-success animate-pulse" />
          </div>
          <button
            type="button"
            className="text-xs font-semibold text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
          >
            Marcar todo como leído
          </button>
        </div>

        <p className="text-xs text-on-surface-variant mb-4">
          Auditoría operativa continua entre recepción, áreas médicas y farmacia.
        </p>

        {/* Feed List */}
        <div className="flex flex-col gap-2.5">
          {activities.map((item) => (
            <div
              key={item.id}
              className="flex items-start gap-3 p-3 rounded-2xl bg-surface-container-low/70 border border-white/60 transition-colors hover:bg-surface-container-low"
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 shadow-xs",
                  item.iconBg,
                  item.iconColor
                )}
              >
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-on-surface truncate">
                    {item.title}
                  </span>
                  <span className="text-[10px] font-medium text-on-surface-variant whitespace-nowrap">
                    {item.timeAgo}
                  </span>
                </div>
                <div className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">
                  {item.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Audit Footnote */}
      <div className="mt-4 pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs border-t border-slate-200/50">
        <span className="text-on-surface-variant">
          Registro de auditoría: <strong>Cifrado SSL</strong> y cumplimiento HIPAA
        </span>
        <button
          type="button"
          className="text-primary font-bold hover:underline cursor-pointer"
        >
          Ver registro completo de auditoría →
        </button>
      </div>
    </Card>
  );
};
