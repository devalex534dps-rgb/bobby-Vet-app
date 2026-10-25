import React from "react";
import { useNavigate } from "react-router-dom";
import { Search, Bell, Menu, User as UserIcon, LogOut } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useUsers } from "@/hooks/useUsers";
import { confirmLogoutAlert } from "@/lib/sweetalert";

interface HeaderProps {
  onOpenMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileMenu }) => {
  const navigate = useNavigate();
  const { currentUser, logout } = useUsers();

  const handleLogout = async () => {
    const confirmed = await confirmLogoutAlert();
    if (confirmed) {
      logout();
      navigate("/login");
    }
  };

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

        {/* Real User Avatar & Info */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200/60">
          <div
            className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white shadow-xs overflow-hidden border border-white shrink-0"
            title={`${currentUser.firstName} ${currentUser.lastName} (${currentUser.role}) • ${currentUser.email}`}
          >
            {currentUser.image ? (
              <img
                src={currentUser.image}
                alt={`${currentUser.firstName} ${currentUser.lastName}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <UserIcon className="w-4 h-4 text-white" />
            )}
          </div>
          <div className="hidden md:flex flex-col text-left">
            <span className="text-xs font-semibold text-on-surface leading-tight">
              {currentUser.firstName} {currentUser.lastName}
            </span>
            <span className="text-[10px] text-on-surface-variant font-medium">
              {currentUser.role.toUpperCase()}
            </span>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            title="Cerrar sesión"
            className="p-1.5 ml-1 rounded-lg text-on-surface-variant hover:text-error hover:bg-error-container/30 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
