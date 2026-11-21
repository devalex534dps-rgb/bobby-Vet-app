import React from "react";
import { useLocation } from "react-router-dom";
import { Menu } from "lucide-react";

interface HeaderProps {
  onOpenMobileMenu: () => void;
}

const getPageTitle = (pathname: string): string => {
  if (pathname.startsWith("/dashboard")) return "Dashboard";
  if (pathname === "/patients") return "Pacientes";
  if (pathname.startsWith("/patients/")) return "Perfil del Paciente";
  if (pathname.startsWith("/citas")) return "Citas";
  if (pathname === "/consultas") return "Consultas";
  if (pathname.startsWith("/consultas/")) return "Reporte de Consulta";
  if (pathname.startsWith("/usuarios")) return "Usuarios";
  if (pathname.startsWith("/perfil")) return "Mi Perfil";
  return "Bobby VetCare";
};

export const Header: React.FC<HeaderProps> = ({ onOpenMobileMenu }) => {
  const { pathname } = useLocation();
  const pageTitle = getPageTitle(pathname);

  return (
    <header className="fixed top-0 left-0 lg:left-64 right-0 h-16 bg-glass-fill backdrop-blur-xl border-b border-white/80 shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 flex items-center px-4 sm:px-6 transition-all duration-300">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl text-on-surface-variant hover:bg-surface-container-high transition-colors"
          aria-label="Abrir navegación"
        >
          <Menu className="w-5 h-5 text-on-surface" />
        </button>
        <h1 className="font-display text-lg sm:text-xl font-extrabold text-on-surface tracking-tight">
          {pageTitle}
        </h1>
      </div>
    </header>
  );
};
