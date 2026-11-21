import React, { useState } from "react";
import { User as UserIcon, Lock, Loader2, CheckCircle2 } from "lucide-react";
import { useUsers } from "@/hooks/useUsers";
import { validatePasswordComplexity, validateRequired } from "@/lib/formValidation";

export const Profile: React.FC = () => {
  const { currentUser, changePassword } = useUsers();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    setSuccessMsg(null);

    const nextErrors = {
      currentPassword: validateRequired(currentPassword, "La contraseña actual"),
      newPassword: validatePasswordComplexity(newPassword),
      confirmPassword:
        newPassword !== confirmPassword ? "Las contraseñas no coinciden." : null,
    };
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;

    setLoading(true);
    const res = await changePassword(currentPassword, newPassword);
    setLoading(false);

    if (res.success) {
      setSuccessMsg("Contraseña actualizada correctamente.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setErrors({});
    } else {
      setServerError(res.error || "No se pudo actualizar la contraseña.");
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-on-surface tracking-tight">Mi Perfil</h1>
        <p className="text-sm text-on-surface-variant">
          Información de tu cuenta y seguridad de acceso.
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-slate-200/70 shadow-xs flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white overflow-hidden shrink-0">
          {currentUser.image ? (
            <img src={currentUser.image} alt={currentUser.fullName} className="w-full h-full object-cover" />
          ) : (
            <UserIcon className="w-7 h-7" />
          )}
        </div>
        <div>
          <h2 className="text-lg font-bold text-on-surface">{currentUser.fullName}</h2>
          <p className="text-sm text-on-surface-variant">{currentUser.email}</p>
          <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary">
            Rol: {currentUser.role}
          </span>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-slate-200/70 shadow-xs">
        <div className="flex items-center gap-2 mb-4">
          <Lock className="w-4 h-4 text-primary" />
          <h3 className="text-base font-bold text-on-surface">Cambiar contraseña</h3>
        </div>

        {serverError && (
          <div className="mb-4 p-3 rounded-xl bg-error-container/40 text-error text-xs font-medium">
            {serverError}
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label className="block text-xs font-semibold text-on-surface mb-1">
              Contraseña actual
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => {
                setCurrentPassword(e.target.value);
                setErrors((p) => ({
                  ...p,
                  currentPassword: validateRequired(e.target.value, "La contraseña actual"),
                }));
              }}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            {errors.currentPassword && (
              <p className="text-xs text-error mt-1">{errors.currentPassword}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-on-surface mb-1">
              Nueva contraseña
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setErrors((p) => ({
                  ...p,
                  newPassword: validatePasswordComplexity(e.target.value),
                }));
              }}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            {errors.newPassword && <p className="text-xs text-error mt-1">{errors.newPassword}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-on-surface mb-1">
              Confirmar nueva contraseña
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setErrors((p) => ({
                  ...p,
                  confirmPassword:
                    e.target.value !== newPassword ? "Las contraseñas no coinciden." : null,
                }));
              }}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            {errors.confirmPassword && (
              <p className="text-xs text-error mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold flex items-center gap-2 hover:bg-primary/90 disabled:opacity-60 cursor-pointer"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>Actualizar contraseña</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
