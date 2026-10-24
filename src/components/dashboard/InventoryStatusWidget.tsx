import React from "react";
import { ShoppingCart } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { inventoryItemsData } from "./mockData";
import type { InventoryItem } from "./types";
import { cn } from "@/lib/utils";

interface InventoryStatusWidgetProps {
  items?: InventoryItem[];
}

export const InventoryStatusWidget: React.FC<InventoryStatusWidgetProps> = ({
  items = inventoryItemsData,
}) => {
  return (
    <Card className="p-6 rounded-3xl bg-glass-fill backdrop-blur-xl border border-white/80 shadow-sm flex flex-col justify-between">
      <div>
        {/* Title and Alerts Badge */}
        <div className="flex items-center justify-between mb-1.5">
          <h3 className="text-lg font-bold text-on-surface">
            Salud de Inventario y Farmacia
          </h3>
          <Badge
            variant="danger"
            className="font-bold text-xs px-2.5 py-0.5 bg-error-container text-on-error-container"
          >
            2 Alertas
          </Badge>
        </div>
        <p className="text-xs text-on-surface-variant mb-4">
          Alertas de velocidad de reabastecimiento y medicamentos veterinarios críticos.
        </p>

        {/* 4 Inventory Items */}
        <div className="flex flex-col gap-2.5">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-3 rounded-2xl bg-surface-container-low border border-white/60 flex items-center justify-between transition-colors hover:bg-surface-container"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={cn(
                    "w-10 h-10 rounded-xl bg-surface-container-lowest flex items-center justify-center shadow-xs shrink-0",
                    item.iconColor
                  )}
                >
                  {item.icon}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-on-surface truncate">
                    {item.name}
                  </div>
                  <div className="text-[11px] text-on-surface-variant truncate">
                    {item.description}
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0 pl-2">
                <div
                  className={cn(
                    "text-xs font-bold",
                    item.statusType === "healthy" && "text-on-surface",
                    item.statusType === "warning" && "text-status-warning",
                    item.statusType === "danger" && "text-status-danger"
                  )}
                >
                  {item.quantity}
                </div>
                <div
                  className={cn(
                    "text-[10px] uppercase font-bold tracking-wider",
                    item.statusType === "healthy" && "text-status-success",
                    item.statusType === "warning" && "text-status-warning",
                    item.statusType === "danger" && "text-status-danger"
                  )}
                >
                  {item.statusText}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Distributor and Quick Reorder Button */}
      <div className="mt-4 pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-slate-200/50">
        <span className="text-xs text-on-surface-variant">
          Distribuidor: <strong>Covetrus Direct</strong> (Conexión EDI)
        </span>
        <Button
          size="sm"
          className="w-full sm:w-auto text-xs font-bold gap-1.5 px-3.5 py-1.5 rounded-xl shadow-sm cursor-pointer"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Reorden rápida</span>
        </Button>
      </div>
    </Card>
  );
};
