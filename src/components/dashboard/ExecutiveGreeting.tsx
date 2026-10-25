import React, { useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useUsers } from "@/hooks/useUsers";

export const ExecutiveGreeting: React.FC = () => {
  const { currentUser } = useUsers();
  const [selectedPeriod, setSelectedPeriod] = useState("Últimos 30 días");

  const periods = [
    "Últimos 7 días",
    "Últimos 30 días",
    "Este trimestre",
    "Año a la fecha",
  ];

  return (
    <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-4 mb-6">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 flex-wrap">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
            Bienvenido de nuevo,{" "}
            <span className="text-primary font-bold">
              {currentUser.firstName} {currentUser.lastName}
            </span>
          </h1>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-primary-fixed text-primary text-[11px] font-bold uppercase tracking-wider">
            {currentUser.role}
          </span>
        </div>
        <p className="text-xs sm:text-sm text-on-surface-variant">
          La capacidad operativa de su clínica está al{" "}
          <span className="font-bold text-on-surface">92%</span> hoy con un delta de
          ingresos estimado de{" "}
          <span className="font-bold text-status-success">+18.6%</span>.
        </p>
      </div>

      {/* Quick Filter Period Switcher & Primary Action */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="inline-flex items-center p-1 rounded-xl bg-surface-container-low shadow-xs border border-white/60 backdrop-blur-md">
          {periods.map((period) => (
            <button
              key={period}
              type="button"
              onClick={() => setSelectedPeriod(period)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs transition-all cursor-pointer",
                selectedPeriod === period
                  ? "bg-surface-container-lowest text-primary shadow-xs font-bold"
                  : "text-on-surface-variant hover:text-on-surface font-medium"
              )}
            >
              {period}
            </button>
          ))}
        </div>

        <Button
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold shadow-sm hover:opacity-95 active:scale-[0.99] transition-all cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Exportar reporte</span>
        </Button>
      </div>
    </header>
  );
};
