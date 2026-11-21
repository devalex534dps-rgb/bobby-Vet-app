import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  KeyRound,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";
import { useUsers } from "@/hooks/useUsers";
import { forgotPasswordWithBackend, resetPasswordWithBackend } from "@/services/users";
import {
  validateEmail,
  validatePasswordComplexity,
  validateRequired,
} from "@/lib/formValidation";

type AuthMode = "login" | "forgot" | "reset";

export const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useUsers();

  const [mode, setMode] = useState<AuthMode>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [serverSuccess, setServerSuccess] = useState<string | null>(null);

  const [email, setEmail] = useState("admin@bobbyvetcare.mx");
  const [password, setPassword] = useState("BobbyAdmin2026!");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string | null>>({});

  const switchMode = (next: AuthMode) => {
    setMode(next);
    setServerError(null);
    setServerSuccess(null);
    setErrors({});
  };

  const handleFieldChange = (field: string, value: string) => {
    if (field === "email") {
      setEmail(value);
      setErrors((e) => ({ ...e, email: validateEmail(value) }));
    } else if (field === "password") {
      setPassword(value);
      setErrors((e) => ({
        ...e,
        password: value ? null : "La contraseña es obligatoria.",
      }));
    } else if (field === "newPassword") {
      setNewPassword(value);
      setErrors((e) => ({ ...e, newPassword: validatePasswordComplexity(value) }));
    } else if (field === "resetToken") {
      setResetToken(value);
      setErrors((e) => ({ ...e, resetToken: validateRequired(value, "El código") }));
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    const emailErr = validateEmail(email);
    const passErr = password ? null : "La contraseña es obligatoria.";
    setErrors({ email: emailErr, password: passErr });
    if (emailErr || passErr) return;

    setLoading(true);
    const res = await login(email.trim(), password);
    setLoading(false);

    if (res.success) {
      navigate(res.user?.role === "CLIENTE" ? "/portal" : "/dashboard");
    } else {
      setServerError(res.error || "Credenciales inválidas.");
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    const emailErr = validateEmail(email);
    setErrors({ email: emailErr });
    if (emailErr) return;

    setLoading(true);
    try {
      await forgotPasswordWithBackend(email.trim());
      setServerSuccess("Si el correo existe, enviamos un código de recuperación.");
      setMode("reset");
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "No se pudo enviar el código.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    const nextErrors = {
      resetToken: validateRequired(resetToken, "El código"),
      newPassword: validatePasswordComplexity(newPassword),
    };
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;

    setLoading(true);
    try {
      await resetPasswordWithBackend(resetToken.trim(), newPassword);
      setServerSuccess("Contraseña restablecida. Ya puedes iniciar sesión.");
      setMode("login");
      setPassword("");
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Código inválido o expirado.");
    } finally {
      setLoading(false);
    }
  };

  const inputWrapperClass = (hasErr?: string | null) =>
    `relative rounded-xl border bg-white/90 input-focus-glow transition-all duration-150 ${
      hasErr ? "border-red-400" : "border-slate-200/90"
    }`;

  return (
    <div className="lg:col-span-5 w-full max-w-md mx-auto lg:max-w-none">
      <div className="glass-card rounded-3xl p-7 sm:p-10 relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#2c5ead] via-[#1591dc] to-[#4bb8fa]" />

        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e0effe]/80 text-[#1d4586] text-[11px] font-bold uppercase tracking-wider mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-[#2c5ead]" />
            <span>Acceso Personal • JWT</span>
          </div>
          <h2 className="font-display text-2xl font-extrabold text-[#0c1b33] tracking-tight">
            {mode === "login" && "Bienvenido de nuevo"}
            {mode === "forgot" && "Recuperar contraseña"}
            {mode === "reset" && "Restablecer contraseña"}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {mode === "login" && "Ingresa con tu correo electrónico institucional."}
            {mode === "forgot" && "Te enviaremos un código de recuperación a tu correo."}
            {mode === "reset" && "Ingresa el código recibido y tu nueva contraseña."}
          </p>
        </div>

        {serverError && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
            {serverError}
          </div>
        )}
        {serverSuccess && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium">
            {serverSuccess}
          </div>
        )}

        {mode === "login" && (
          <form onSubmit={handleLogin} className="space-y-4" noValidate>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="login-email">
                Correo electrónico
              </label>
              <div className={inputWrapperClass(errors.email)}>
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => handleFieldChange("email", e.target.value)}
                  placeholder="correo@bobbyvetcare.mx"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-transparent border-0 rounded-xl focus:ring-0 focus:outline-none text-slate-800 placeholder-slate-400 font-medium"
                />
              </div>
              {errors.email && <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.email}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700" htmlFor="login-password">
                  Contraseña de acceso
                </label>
                <button
                  type="button"
                  onClick={() => switchMode("forgot")}
                  className="text-xs font-semibold text-[#2c5ead] hover:text-[#1591dc] transition-colors cursor-pointer"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
              <div className={inputWrapperClass(errors.password)}>
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => handleFieldChange("password", e.target.value)}
                  placeholder="Tu contraseña"
                  className="w-full pl-10 pr-10 py-2.5 text-sm bg-transparent border-0 rounded-xl focus:ring-0 focus:outline-none text-slate-800 placeholder-slate-400 font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl font-display font-bold text-sm text-white shadow-lg shadow-[#2c5ead]/25 bg-gradient-to-r from-[#2c5ead] via-[#1d4586] to-[#1591dc] hover:from-[#1d4586] hover:to-[#2c5ead] active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
              <span>{loading ? "Verificando credenciales..." : "Ingresar al sistema"}</span>
            </button>

            <div className="pt-4 border-t border-slate-200/60 text-[11px] text-slate-500 space-y-1">
              <p className="font-semibold text-slate-700">Cuentas de prueba (Personal):</p>
              <p>Admin: <code className="text-[#2c5ead] font-semibold">admin@bobbyvetcare.mx</code> / <code>BobbyAdmin2026!</code></p>
              <p>Vet: <code className="text-[#2c5ead] font-semibold">vet@bobbyvetcare.mx</code> / <code>BobbyVet2026!</code></p>
            </div>
          </form>
        )}

        {mode === "forgot" && (
          <form onSubmit={handleForgot} className="space-y-4" noValidate>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Correo electrónico</label>
              <div className={inputWrapperClass(errors.email)}>
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => handleFieldChange("email", e.target.value)}
                  placeholder="correo@ejemplo.com"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-transparent border-0 rounded-xl focus:ring-0 focus:outline-none text-slate-800 placeholder-slate-400 font-medium"
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-500 font-medium">{errors.email}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl font-display font-bold text-sm text-white shadow-lg shadow-[#2c5ead]/25 bg-gradient-to-r from-[#2c5ead] via-[#1d4586] to-[#1591dc] flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{loading ? "Enviando..." : "Enviar código"}</span>
            </button>

            <button
              type="button"
              onClick={() => switchMode("login")}
              className="w-full text-xs text-[#2c5ead] font-semibold flex items-center justify-center gap-1 hover:underline cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Volver a iniciar sesión
            </button>
          </form>
        )}

        {mode === "reset" && (
          <form onSubmit={handleReset} className="space-y-4" noValidate>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Código de recuperación</label>
              <div className={inputWrapperClass(errors.resetToken)}>
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={resetToken}
                  onChange={(e) => handleFieldChange("resetToken", e.target.value)}
                  placeholder="Ej. A1B2C3D4"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-transparent border-0 rounded-xl focus:ring-0 focus:outline-none text-slate-800 placeholder-slate-400 font-medium"
                />
              </div>
              {errors.resetToken && <p className="mt-1 text-xs text-red-500 font-medium">{errors.resetToken}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Nueva contraseña</label>
              <div className={inputWrapperClass(errors.newPassword)}>
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => handleFieldChange("newPassword", e.target.value)}
                  placeholder="Mín. 8 chars, 1 mayúscula, 1 número, 1 símbolo"
                  className="w-full pl-10 pr-10 py-2.5 text-sm bg-transparent border-0 rounded-xl focus:ring-0 focus:outline-none text-slate-800 placeholder-slate-400 font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.newPassword && <p className="mt-1 text-xs text-red-500 font-medium">{errors.newPassword}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl font-display font-bold text-sm text-white shadow-lg shadow-[#2c5ead]/25 bg-gradient-to-r from-[#2c5ead] via-[#1d4586] to-[#1591dc] flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{loading ? "Guardando..." : "Restablecer contraseña"}</span>
            </button>

            <button
              type="button"
              onClick={() => switchMode("login")}
              className="w-full text-xs text-[#2c5ead] font-semibold flex items-center justify-center gap-1 hover:underline cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Volver a iniciar sesión
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
