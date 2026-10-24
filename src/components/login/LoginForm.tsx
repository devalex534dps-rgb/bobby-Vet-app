import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, Check } from "lucide-react";
import { loginSchema, type LoginSchema } from "@/validation";

export const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [submissionState, setSubmissionState] = useState<"idle" | "loading" | "success">("idle");

  const {
    register,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "julian.rivera@bobbyvet.com",
      password: "Password123!",
      rememberMe: true,
    },
  });

  const onSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSubmissionState("loading");
    navigate("/dashboard");
  };

  return (
    <div className="lg:col-span-5 w-full max-w-md mx-auto">
      <div className="glass-card rounded-[2rem] p-7 sm:p-9 relative z-20 border border-white/90 shadow-[0_25px_60px_-15px_rgba(44,94,173,0.18)]">
        {/* Card accent glow */}
        <div className="absolute top-0 right-1/4 w-32 h-16 bg-gradient-to-b from-[#4bb8fa]/30 to-transparent blur-xl pointer-events-none" />

        {/* Encabezado */}
        <div className="mb-6 text-center">
          <h2 className="text-2xl sm:text-[1.65rem] font-display font-extrabold text-slate-900 tracking-tight">
            Iniciar sesión
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
            Accede a tu cuenta en Bobby VetCare OS
          </p>
        </div>

        {/* SSO Options */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            className="flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl border border-slate-200/80 bg-white/70 hover:bg-white text-slate-700 text-xs font-semibold shadow-xs hover:shadow-sm transition-all cursor-pointer"
            type="button"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                fill="#EA4335"
              />
            </svg>
            <span>Google</span>
          </button>
          <button
            className="flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl border border-slate-200/80 bg-white/70 hover:bg-white text-slate-700 text-xs font-semibold shadow-xs hover:shadow-sm transition-all cursor-pointer"
            type="button"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 23 23">
              <path d="M1 1h10v10H1z" fill="#f35325" />
              <path d="M12 1h10v10H12z" fill="#81bc06" />
              <path d="M12 12h10v10H12z" fill="#05a6f0" />
              <path d="M1 12h10v10H1z" fill="#ffba08" />
            </svg>
            <span>Microsoft</span>
          </button>
        </div>

        {/* Divisor */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200/80" />
          </div>
          <div className="relative flex justify-center text-[11px] uppercase tracking-wider font-semibold">
            <span className="px-3 bg-white/80 rounded-full text-slate-400 backdrop-blur-xs">
              o continúa con correo
            </span>
          </div>
        </div>

        {/* Formulario */}
        <form className="space-y-4" onSubmit={onSubmit}>
          {/* Campo Correo Profesional */}
          <div>
            <label
              className="block text-xs font-semibold text-slate-700 mb-1.5"
              htmlFor="email"
            >
              Correo profesional
            </label>
            <div
              className={`relative rounded-xl border bg-white/90 input-focus-glow transition-all duration-150 ${
                errors.email ? "border-red-400" : "border-slate-200/90"
              }`}
            >
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                {...register("email")}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-transparent border-0 rounded-xl focus:ring-0 focus:outline-none text-slate-800 placeholder-slate-400 font-medium"
                id="email"
                placeholder="nombre@bobbyvet.com"
                type="email"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-xs text-red-500 font-medium">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Campo Contraseña */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                className="block text-xs font-semibold text-slate-700"
                htmlFor="password"
              >
                Contraseña de acceso
              </label>
              <a
                className="text-xs font-semibold text-[#2c5ead] hover:text-[#1591dc] transition-colors"
                href="#forgot-password"
              >
                ¿Olvidaste tu contraseña?
              </a>
            </div>
            <div
              className={`relative rounded-xl border bg-white/90 input-focus-glow transition-all duration-150 ${
                errors.password ? "border-red-400" : "border-slate-200/90"
              }`}
            >
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                {...register("password")}
                className="w-full pl-10 pr-10 py-2.5 text-sm bg-transparent border-0 rounded-xl focus:ring-0 focus:outline-none text-slate-800 placeholder-slate-400 font-medium"
                id="password"
                placeholder="Tu contraseña"
                type={showPassword ? "text" : "password"}
              />
              <button
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                type="button"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-red-500 font-medium">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Mantener sesión activa */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center cursor-pointer select-none">
              <input
                {...register("rememberMe")}
                className="w-4 h-4 rounded text-[#2c5ead] border-slate-300 focus:ring-[#2c5ead] focus:ring-offset-0 cursor-pointer accent-[#2c5ead]"
                id="rememberMe"
                type="checkbox"
              />
              <span className="ml-2 text-xs font-medium text-slate-600">
                Mantener sesión activa
              </span>
            </label>
          </div>

          {/* Botón Principal de Acceso */}
          <button
            className={`w-full mt-2 py-3 px-4 rounded-xl font-display font-bold text-sm text-white shadow-lg active:scale-[0.99] transition-all duration-200 flex items-center justify-center space-x-2 group cursor-pointer ${
              submissionState === "success"
                ? "bg-emerald-600 shadow-emerald-600/30"
                : "bg-gradient-to-r from-[#2c5ead] via-[#1d4586] to-[#1591dc] hover:from-[#1d4586] hover:to-[#2c5ead] shadow-[#2c5ead]/25 hover:shadow-xl hover:shadow-[#2c5ead]/30"
            } ${submissionState === "loading" ? "opacity-80" : ""}`}
            disabled={submissionState === "loading"}
            id="submit-btn"
            type="submit"
          >
            {submissionState === "loading" && (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verificando credenciales...</span>
              </>
            )}
            {submissionState === "success" && (
              <>
                <Check className="w-4 h-4" />
                <span>¡Acceso concedido!</span>
              </>
            )}
            {submissionState === "idle" && (
              <>
                <span id="submit-btn-text">Iniciar sesión</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        {/* Footer interior de la tarjeta */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center space-x-3">
            <a
              className="hover:text-slate-600 transition-colors"
              href="#privacy"
            >
              Privacidad
            </a>
            <span>•</span>
            <a
              className="hover:text-slate-600 transition-colors"
              href="#support"
            >
              Soporte TI
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
