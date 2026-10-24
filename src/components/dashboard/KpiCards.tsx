import React from "react";
import { TrendingUp, TrendingDown, ArrowUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { KpiMetric } from "./types";
import { kpiMetricsData } from "./mockData";
import { cn } from "@/lib/utils";

interface KpiCardsProps {
  metrics?: KpiMetric[];
}

export const KpiCards: React.FC<KpiCardsProps> = ({ metrics = kpiMetricsData }) => {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {metrics.map((metric) => {
        return (
          <Card
            key={metric.id}
            className="p-5 rounded-2xl bg-glass-fill backdrop-blur-xl border border-white/80 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
          >
            <div>
              {/* Top row: Label & Icon */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
                  {metric.title}
                </span>
                <div
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105",
                    metric.iconBg
                  )}
                >
                  {metric.icon}
                </div>
              </div>

              {/* Metric Value & Delta Tag */}
              <div className="flex items-baseline justify-between gap-2">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-bold tracking-tight text-on-surface">
                    {metric.value}
                  </span>
                  {metric.unit && (
                    <span className="text-xs font-medium text-on-surface-variant">
                      {metric.unit}
                    </span>
                  )}
                </div>

                {metric.badgeType === "success" && (
                  <Badge
                    variant="success"
                    className="font-semibold text-xs px-2 py-0.5"
                  >
                    {metric.deltaDirection === "up" && (
                      <TrendingUp className="w-3.5 h-3.5" />
                    )}
                    {metric.deltaDirection === "down" && (
                      <TrendingDown className="w-3.5 h-3.5" />
                    )}
                    {metric.id === "kpi-revenue" && (
                      <ArrowUp className="w-3.5 h-3.5" />
                    )}
                    <span>{metric.delta}</span>
                  </Badge>
                )}

                {metric.badgeType === "subtle" && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-surface-container-high text-primary text-xs font-semibold">
                    {metric.delta}
                  </span>
                )}
              </div>
            </div>

            {/* Subtitle / Footnote */}
            <p className="text-xs text-on-surface-variant mt-3 flex items-center gap-1.5">
              {metric.id === "kpi-appointments" && (
                <span className="w-1.5 h-1.5 rounded-full bg-secondary-container inline-block" />
              )}
              {metric.subtitle}
            </p>
          </Card>
        );
      })}
    </section>
  );
};
