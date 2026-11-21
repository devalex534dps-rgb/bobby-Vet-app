import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  PawPrint,
  Calendar,
  Stethoscope,
  Users,
  User as UserIcon,
  X,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUsers } from "@/hooks/useUsers";
import { confirmLogoutAlert } from "@/lib/sweetalert";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = false, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useUsers();

  const handleLogout = async () => {
    const confirmed = await confirmLogoutAlert();
    if (confirmed) {
      await logout();
      navigate("/login");
    }
  };

  const homePath = currentUser.role === "CLIENTE" ? "/portal" : "/dashboard";

  const navItems = [
    { label: "Panel principal", path: "/dashboard", icon: LayoutDashboard, roles: ["ADMIN", "VETERINARIO"] },
    { label: "Mi Portal", path: "/portal", icon: LayoutDashboard, roles: ["CLIENTE"] },
    {
      label: currentUser.role === "CLIENTE" ? "Mis Mascotas" : "Pacientes",
      path: "/patients",
      icon: PawPrint,
      roles: ["ADMIN", "VETERINARIO", "CLIENTE"],
    },
    { label: "Citas", path: "/citas", icon: Calendar, roles: ["ADMIN", "VETERINARIO", "CLIENTE"] },
    { label: "Consultas", path: "/consultas", icon: Stethoscope, roles: ["ADMIN", "VETERINARIO", "CLIENTE"] },
    { label: "Usuarios", path: "/usuarios", icon: Users, roles: ["ADMIN"] },
  ].filter((item) => item.roles.includes(currentUser.role));

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 h-full w-64 bg-glass-fill backdrop-blur-xl border-r border-white/80 shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-50 flex flex-col justify-between p-4 transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between px-2 py-1">
            <Link
              to={homePath}
              className="flex items-center gap-2.5 group"
              onClick={onClose}
            >
              <div className="w-8 h-8 rounded-xl bg-white border border-slate-200/70 p-1 flex items-center justify-center shadow-xs overflow-hidden shrink-0">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC2vXquCCSvBHuQiE1DkmQpj4MCuqRRBvn692PCyyGycdDsPBkvgCSu8Hb2fZDTy8zBOSaP8C535f4V6Vy2ljByv0Fp-55E7yvfAZOVVAw3IbjIEkvOElENyy7cIvqlpQihg7xSWo3J2KSBoZngCo_qxi-TX1OIx3O_Xx6D6p32pq0nSNRtD8aCxXEpuEiotYISwaStWAR6ey-p2M6Mo4M5s8_KP5HObBi_JZ22a-CSUqlzAw2eXQjPvYb0xioLIn7EeA"
                  alt="Bobby VetCare"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-primary tracking-tight leading-none">
                  Bobby VetCare
                </span>
                <span className="text-[10px] font-medium text-on-surface-variant">
                  Clínica Veterinaria
                </span>
              </div>
            </Link>

            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors"
              aria-label="Cerrar menú"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                location.pathname === item.path ||
                (item.path !== "/dashboard" && location.pathname.startsWith(item.path));

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => {
                    if (onClose) onClose();
                  }}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
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

        <div className="flex flex-col gap-3 pt-3 border-t border-slate-200/60">
          <Link
            to="/perfil"
            onClick={() => {
              if (onClose) onClose();
            }}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors",
              location.pathname.startsWith("/perfil")
                ? "bg-primary-container text-white shadow-sm font-semibold"
                : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
            )}
          >
            <UserIcon className="w-5 h-5 shrink-0" />
            <span>Mi Perfil</span>
          </Link>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low border border-white/60">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0 overflow-hidden text-white shadow-xs border border-white">
                {currentUser.image ? (
                  <img
                    src={currentUser.image}
                    alt={currentUser.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserIcon className="w-4 h-4 text-white" />
                )}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-on-surface truncate">
                  {currentUser.fullName}
                </span>
                <span className="text-[10px] font-medium text-on-surface-variant truncate">
                  {currentUser.role} • {currentUser.email}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              title="Cerrar sesión"
              className="p-1.5 rounded-lg text-on-surface-variant hover:text-error hover:bg-error-container/30 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
