import React from "react";
import { Search, Bell, Menu, User } from "lucide-react";
import { Input } from "@/components/ui/input";

interface HeaderProps {
  onOpenMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileMenu }) => {
  return (
    <header className="fixed top-0 left-0 lg:left-64 right-0 h-16 bg-glass-fill backdrop-blur-xl border-b border-white/80 shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 flex items-center justify-between px-4 sm:px-6 transition-all duration-300">
      {/* Left: Mobile Toggle & Global Search Bar */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl text-on-surface-variant hover:bg-surface-container-high transition-colors"
          aria-label="Abrir navegación"
        >
          <Menu className="w-5 h-5 text-on-surface" />
        </button>

        <div className="relative flex items-center w-full max-w-xs sm:max-w-sm">
          <Search className="absolute left-3 w-4 h-4 text-on-surface-variant pointer-events-none" />
          <Input
            type="text"
            placeholder="Búscar pacientes, registros, medicamentos..."
            className="w-full pl-9 pr-4 py-2 bg-surface-container-low rounded-xl text-xs sm:text-sm text-on-surface placeholder:text-on-surface-variant focus-visible:bg-surface-container-lowest focus-visible:ring-1 focus-visible:ring-primary border-0 transition-all"
          />
        </div>
      </div>

      {/* Right: Status Pill, Notifications, User Profile */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Active Status Badge */}
        <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-low text-[11px] font-semibold text-on-surface-variant border border-white/60">
          <span className="w-2 h-2 rounded-full bg-status-success animate-pulse" />
          <span>Activo</span>
        </div>

        {/* Notifications Icon with Badge */}
        <button
          type="button"
          className="relative p-2 rounded-xl text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors cursor-pointer"
          aria-label="Ver notificaciones"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-status-warning ring-2 ring-white" />
        </button>

        {/* User Avatar Circle */}
        <div className="flex items-center gap-2 pl-1 border-l border-slate-200/60">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white shadow-xs">
            <User className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>
    </header>
  );
};
