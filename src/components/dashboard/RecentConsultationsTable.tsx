import React from "react";
import { PawPrint, Cat } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { recentConsultationsData } from "./mockData";
import type { Consultation } from "./types";
import { cn } from "@/lib/utils";

interface RecentConsultationsTableProps {
  consultations?: Consultation[];
}

export const RecentConsultationsTable: React.FC<RecentConsultationsTableProps> = ({
  consultations = recentConsultationsData,
}) => {
  return (
    <Card className="p-6 rounded-3xl bg-glass-fill backdrop-blur-xl border border-white/80 shadow-sm flex flex-col justify-between">
      <div>
        {/* Header Bar */}
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-on-surface">
              Consultas Recientes
            </h3>
            <Badge variant="subtle" className="text-[10px] font-semibold uppercase tracking-wider">
              Tiempo real
            </Badge>
          </div>
          <button
            type="button"
            className="text-xs font-bold text-primary hover:underline cursor-pointer"
          >
            Ver todos los pacientes →
          </button>
        </div>

        <p className="text-xs text-on-surface-variant mb-4">
          Últimas visitas registradas con conciliación de cobro y estado.
        </p>

        {/* Linear / Stripe Table */}
        <div className="w-full overflow-x-auto rounded-2xl border border-slate-200/50 bg-white/40">
          <Table>
            <TableHeader>
              <TableRow className="bg-surface-container-low/70 hover:bg-surface-container-low/70">
                <TableHead className="py-2.5 px-3 rounded-l-xl">Paciente y Especie</TableHead>
                <TableHead className="py-2.5 px-3">Propietario</TableHead>
                <TableHead className="py-2.5 px-3">Servicio Clínico</TableHead>
                <TableHead className="py-2.5 px-3">Estado</TableHead>
                <TableHead className="py-2.5 px-3 text-right rounded-r-xl">Tarifa</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {consultations.map((item) => (
                <TableRow
                  key={item.id}
                  className="hover:bg-surface-container-low/80 transition-colors group border-b border-slate-100 last:border-0"
                >
                  {/* Patient & Species Column */}
                  <TableCell className="py-3 px-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={cn(
                          "w-9 h-9 rounded-xl flex items-center justify-center font-bold shadow-xs shrink-0",
                          item.avatarBg,
                          item.avatarColor
                        )}
                      >
                        {item.isFeline ? (
                          <Cat className="w-4 h-4" />
                        ) : (
                          <PawPrint className="w-4 h-4" />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-on-surface">
                          {item.patientName}
                        </span>
                        <span className="text-[11px] text-on-surface-variant">
                          {item.species} • {item.age}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  {/* Owner */}
                  <TableCell className="py-3 px-3 text-xs text-on-surface font-medium whitespace-nowrap">
                    {item.ownerName}
                  </TableCell>

                  {/* Service */}
                  <TableCell className="py-3 px-3 text-xs text-on-surface whitespace-nowrap">
                    {item.service}
                  </TableCell>

                  {/* Status Badge */}
                  <TableCell className="py-3 px-3 whitespace-nowrap">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold",
                        item.statusColor
                      )}
                    >
                      {item.statusDotBg && (
                        <span
                          className={cn(
                            "w-1.5 h-1.5 rounded-full",
                            item.statusDotBg,
                            item.isPulsing && "animate-ping"
                          )}
                        />
                      )}
                      <span>{item.status}</span>
                    </span>
                  </TableCell>

                  {/* Fee */}
                  <TableCell className="py-3 px-3 text-right text-xs font-bold text-on-surface whitespace-nowrap">
                    {item.fee}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Table Summary Footer */}
      <div className="mt-4 pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-on-surface-variant gap-1">
        <span>Mostrando 4 de 38 visitas hoy</span>
        <span className="font-bold text-on-surface">Total liquidado: $740.00</span>
      </div>
    </Card>
  );
};
