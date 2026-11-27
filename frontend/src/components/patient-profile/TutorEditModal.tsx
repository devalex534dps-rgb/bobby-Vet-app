import React, { useEffect, useState } from "react";
import { X, UserCheck, Mail, Phone, MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { bobbyApi } from "@/services/bobbyApi";

interface TutorEditModalProps {
  isOpen: boolean;
  tutorId?: string;
  initialName?: string;
  initialPhone?: string;
  initialEmail?: string;
  initialAddress?: string;
  onClose: () => void;
  onSaved: () => void | Promise<void>;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const TutorEditModal: React.FC<TutorEditModalProps> = ({
  isOpen,
  tutorId,
  initialName = "",
  initialPhone = "",
  initialEmail = "",
  initialAddress = "",
  onClose,
  onSaved,
}) => {
  const [fullName, setFullName] = useState(initialName);
  const [phone, setPhone] = useState(initialPhone);
  const [email, setEmail] = useState(initialEmail);
  const [address, setAddress] = useState(initialAddress);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isOpen) return;
    setErrorMsg(null);
    setErrors({});
    setFullName(initialName);
    setPhone(initialPhone);
    setEmail(initialEmail);
    setAddress(initialAddress);

    if (tutorId) {
      setLoading(true);
      bobbyApi
        .getTutorById(tutorId)
        .then((tutor) => {
          setFullName(tutor.fullName || "");
          setPhone(tutor.phone || "");
          setEmail(tutor.email || "");
          setAddress(tutor.address || "");
        })
        .catch((err) => {
          setErrorMsg(err instanceof Error ? err.message : "No se pudieron cargar los datos del tutor.");
        })
        .finally(() => setLoading(false));
    }
  }, [isOpen, tutorId, initialName, initialPhone, initialEmail, initialAddress]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tutorId) return;

    const newErrors: Record<string, string> = {};
    if (!fullName.trim()) newErrors.fullName = "El nombre completo del tutor es obligatorio";
    if (!phone.trim()) newErrors.phone = "El teléfono del tutor es obligatorio";
    if (!email.trim()) {
      newErrors.email = "El correo electrónico es obligatorio para notificaciones";
    } else if (!EMAIL_REGEX.test(email.trim())) {
      newErrors.email = "Ingresa un correo electrónico válido";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSaving(true);
    setErrorMsg(null);
    try {
      await bobbyApi.updateTutor(tutorId, {
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: email.trim().toLowerCase(),
        address: address.trim() || undefined,
      });
      await onSaved();
      onClose();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "No se pudo actualizar la información del tutor.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md rounded-2xl bg-surface-bright/95 backdrop-blur-2xl border border-white/80 shadow-2xl p-6 z-10 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-on-surface tracking-tight">
                Editar Información del Tutor
              </h2>
              <p className="text-xs text-on-surface-variant">
                Actualiza los datos de contacto para WhatsApp y correo
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {loading ? (
          <div className="py-10 flex items-center justify-center gap-2 text-sm text-on-surface-variant">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
            <span>Cargando datos del tutor...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-error-container/30 border border-error/40 text-xs text-error">
                {errorMsg}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-on-surface mb-1">
                Nombre completo <span className="text-error">*</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ej. Carlos Ramírez"
                className={`w-full px-3 py-2 text-sm rounded-xl bg-surface-container-lowest border ${
                  errors.fullName ? "border-error focus:ring-error" : "border-slate-200/80 focus:border-primary"
                } text-on-surface focus:outline-none focus:ring-1 focus:ring-primary`}
              />
              {errors.fullName && (
                <span className="text-[11px] text-error mt-0.5 block">{errors.fullName}</span>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-on-surface mb-1">
                <span className="inline-flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-primary" />
                  Teléfono (WhatsApp) <span className="text-error">*</span>
                </span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ej. +525512345678"
                className={`w-full px-3 py-2 text-sm rounded-xl bg-surface-container-lowest border ${
                  errors.phone ? "border-error focus:ring-error" : "border-slate-200/80 focus:border-primary"
                } text-on-surface focus:outline-none focus:ring-1 focus:ring-primary`}
              />
              {errors.phone && (
                <span className="text-[11px] text-error mt-0.5 block">{errors.phone}</span>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-on-surface mb-1">
                <span className="inline-flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-primary" />
                  Correo electrónico <span className="text-error">*</span>
                </span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ej. tutor@correo.com"
                className={`w-full px-3 py-2 text-sm rounded-xl bg-surface-container-lowest border ${
                  errors.email ? "border-error focus:ring-error" : "border-slate-200/80 focus:border-primary"
                } text-on-surface focus:outline-none focus:ring-1 focus:ring-primary`}
              />
              {errors.email && (
                <span className="text-[11px] text-error mt-0.5 block">{errors.email}</span>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-on-surface mb-1">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-primary" />
                  Dirección (Opcional)
                </span>
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Calle, número, colonia, ciudad"
                className="w-full px-3 py-2 text-sm rounded-xl bg-surface-container-lowest border border-slate-200/80 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="pt-3 border-t border-slate-200/60 flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={saving}
                className="rounded-xl text-xs font-semibold px-4 py-2 border-slate-200 text-on-surface-variant hover:bg-surface-container-high"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="rounded-xl text-xs font-bold px-5 py-2 bg-gradient-to-r from-primary to-secondary text-white shadow-md hover:shadow-lg transition-all"
              >
                {saving ? "Guardando..." : "Guardar Tutor"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
