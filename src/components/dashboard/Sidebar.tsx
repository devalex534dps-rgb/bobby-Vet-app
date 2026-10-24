import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  PawPrint,
  Calendar,
  Stethoscope,
  Package,
  Wallet,
  BarChart3,
  Settings,
  User,
  X,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = false, onClose }) => {
  const location = useLocation();

  const navItems = [
    { label: "Panel principal", path: "/dashboard", icon: LayoutDashboard },
    { label: "Pacientes", path: "/patients", icon: PawPrint },
    { label: "Citas", path: "/citas", icon: Calendar },
    { label: "Consultas", path: "/consultas", icon: Stethoscope },
    { label: "Inventario", path: "/inventario", icon: Package },
    { label: "Finanzas", path: "/finanzas", icon: Wallet },
    { label: "Reportes", path: "/reportes", icon: BarChart3 },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Main Sidebar Element */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-full w-64 bg-glass-fill backdrop-blur-xl border-r border-white/80 shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-50 flex flex-col justify-between p-4 transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex flex-col gap-4">
          {/* Brand Header */}
          <div className="flex items-center justify-between px-2 py-1">
            <Link
              to="/dashboard"
              className="flex items-center gap-2 group"
              onClick={onClose}
            >
              <img
                alt="Bobby Logo"
                className="h-8 w-auto object-contain transition-transform group-hover:scale-105"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1EFVk9iYuvkL2K6vz9kSC2rM1eKdFQBDvYL-0N_v9ichYIMMKOGaVqiXjNUuNPqJxGMyVD9jGbp25oW0G9NYYNW1fyE7kyNoqHjw2xRdhjfIv7SkMFSTbD2AbhKslobroCuLBBBBTVuFF7lrgyUiJ67BVLU0mG6ukiYJTkHFgyKtktS3rWEDFdFIjXBsSmttjQo1OV6piHB9wU3_LpwB-fH64ovApX7mmZl533uEz6AvHrseHFuTh06tAko-PHPacog"
              />
              <span className="text-xl font-bold text-primary tracking-tight leading-none">
                Bobby
              </span>
            </Link>

            {/* Mobile close button */}
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors"
              aria-label="Cerrar menú"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Clinic Selector Badge */}
          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-surface-container-low text-on-surface border border-white/60">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-status-success" />
              <span className="text-xs font-semibold text-on-surface">Clínica Metropolitana</span>
            </div>
            <span className="text-xs text-on-surface-variant">▾</span>
          </div>

          {/* Navigation Items */}
          <nav className="flex flex-col gap-1 mt-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                location.pathname === item.path ||
                (item.path === "/dashboard" && location.pathname === "/");

              const isAvailable = item.path === "/dashboard" || item.path === "/patients";

              return (
                <Link
                  key={item.label}
                  to={isAvailable ? item.path : "#"}
                  onClick={() => {
                    if (isAvailable && onClose) onClose();
                  }}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary-container text-white shadow-sm font-semibold"
                      : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
                  )}
                >
                  <Icon
                    className={cn(
                      "w-5 h-5 shrink-0",
                      isActive ? "text-white" : "text-on-surface-variant"
                    )}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col gap-3 pt-3 border-t border-slate-200/60">
          <Link
            to="#"
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors"
          >
            <Settings className="w-5 h-5 shrink-0" />
            <span>Configuración</span>
          </Link>

          {/* Doctor Profile Card */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-surface-container-low border border-white/60">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0 text-white shadow-xs">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-on-surface truncate">
                  Dra. Eleanor Vance
                </span>
                <span className="text-[11px] font-medium text-on-surface-variant truncate">
                  Directora Médica
                </span>
              </div>
            </div>

            <Link
              to="/login"
              title="Cerrar sesión"
              className="p-1.5 rounded-lg text-on-surface-variant hover:text-error hover:bg-error-container/30 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
};
