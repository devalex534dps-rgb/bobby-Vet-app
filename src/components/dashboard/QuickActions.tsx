import React from "react";
import { Zap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { quickActionsData } from "./mockData";
import type { QuickActionItem } from "./types";
import { cn } from "@/lib/utils";

interface QuickActionsProps {
  actions?: QuickActionItem[];
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  actions = quickActionsData,
}) => {
  return (
    <Card className="p-6 rounded-3xl bg-glass-fill backdrop-blur-xl border border-white/80 shadow-sm flex flex-col justify-between">
      <div>
        {/* Title and Icon */}
        <div className="flex items-center justify-between mb-1.5">
          <h3 className="text-lg font-bold text-on-surface">
            Acciones en un clic
          </h3>
          <Zap className="w-5 h-5 text-primary" />
        </div>
        <p className="text-xs text-on-surface-variant mb-4">
          Ejecute flujos operativos de recepción sin abrir submenús.
        </p>

        {/* 2x2 Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {actions.map((act) => (
            <button
              key={act.id}
              type="button"
              onClick={act.onClick}
              className="flex flex-col items-start p-3.5 rounded-2xl bg-surface-container-low hover:bg-surface-container-high border border-white/60 text-left transition-all duration-200 group active:scale-[0.98] cursor-pointer"
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center mb-2.5 transition-transform group-hover:scale-105",
                  act.iconBg
                )}
              >
                {act.icon}
              </div>
              <span className="text-xs font-bold text-on-surface group-hover:text-primary transition-colors">
                {act.title}
              </span>
              <span className="text-[11px] text-on-surface-variant">
                {act.subtitle}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Universal Shortcut Hint */}
      <div className="mt-4 p-3 rounded-2xl bg-surface-container-low border border-white/60 flex items-center justify-between">
        <span className="text-xs font-medium text-on-surface-variant">
          Acceso universal:
        </span>
        <kbd className="px-2.5 py-0.5 rounded-lg bg-surface-container-lowest font-mono text-xs font-bold text-primary shadow-xs border border-slate-200/50">
          ⌘ + K
        </kbd>
      </div>
    </Card>
  );
};
