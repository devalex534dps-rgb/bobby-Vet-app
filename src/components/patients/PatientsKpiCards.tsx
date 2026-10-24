import React from "react";
import { TrendingUp, ArrowUp, Repeat, BellRing } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { patientsKpiData } from "./mockData";
import type { PatientsKpiItem } from "./types";
import { cn } from "@/lib/utils";

interface PatientsKpiCardsProps {
  items?: PatientsKpiItem[];
}

export const PatientsKpiCards: React.FC<PatientsKpiCardsProps> = ({
  items = patientsKpiData,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mt-4">
      {items.map((item) => (
        <Card
          key={item.id}
          className="relative overflow-hidden rounded-2xl bg-glass-fill backdrop-blur-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between border border-white/80 group"
        >
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
                {item.title}
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-bold tracking-tight text-on-surface">
                  {item.value}
                </span>
              </div>
            </div>
            <div
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105",
                item.iconBg
              )}
            >
              {item.icon}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 mt-2 border-t border-slate-100/60">
            {item.deltaType === "success" && (
              <Badge
                variant="success"
                className="font-semibold text-xs px-2 py-0.5"
              >
                {item.id === "kpi-total-patients" ? (
                  <TrendingUp className="w-3.5 h-3.5" />
                ) : (
                  <ArrowUp className="w-3.5 h-3.5" />
                )}
                <span>{item.deltaText}</span>
              </Badge>
            )}

            {item.deltaType === "secondary" && (
              <Badge
                variant="secondary"
                className="font-semibold text-xs px-2 py-0.5"
              >
                <Repeat className="w-3.5 h-3.5" />
                <span>{item.deltaText}</span>
              </Badge>
            )}

            {item.deltaType === "warning" && (
              <Badge
                variant="warning"
                className="font-semibold text-xs px-2 py-0.5"
              >
                <BellRing className="w-3.5 h-3.5" />
                <span>{item.deltaText}</span>
              </Badge>
            )}

            <span className="text-xs text-on-surface-variant">
              {item.subtitle}
            </span>
          </div>
        </Card>
      ))}
    </div>
  );
};
