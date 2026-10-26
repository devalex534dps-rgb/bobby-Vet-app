import React, { useState, useEffect } from "react";
import { X, PawPrint, Cat, CheckCircle2 } from "lucide-react";
import type { Patient, PatientStatus, PatientSpecies } from "@/components/patients/types";
import { Button } from "@/components/ui/button";

interface PatientEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    nombre: string;
    propietario: string;
    especie: PatientSpecies;
    raza: string;
    edad: string;
    estado: PatientStatus;
    imagen?: string;
  }) => void;
  patient?: Patient | null;
  mode?: "edit" | "create";
}

const AVAILABLE_STATUSES: PatientStatus[] = [
  "Al día",
  "En tratamiento",
  "En seguimiento",
  "Vacuna pendiente",
  "En recuperación",
];

export const PatientEditModal: React.FC<PatientEditModalProps> = ({
  isOpen,
  onClose,
  onSave,
  patient,
  mode = "edit",
}) => {
  const [nombre, setNombre] = useState("");
  const [propietario, setPropietario] = useState("");
  const [especie, setEspecie] = useState<PatientSpecies>("Canino");
  const [raza, setRaza] = useState("");
  const [edad, setEdad] = useState("");
  const [estado, setEstado] = useState<PatientStatus>("Al día");
  const [imagen, setImagen] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (patient && mode === "edit") {
      setNombre(patient.nombre || patient.name || "");
      setPropietario(patient.propietario || patient.ownerName || "");
      setEspecie((patient.especie || patient.species || "Canino") as PatientSpecies);
      setRaza(patient.raza || patient.breed || "");
      setEdad(patient.edad || patient.age || "");
      setEstado((patient.estado || patient.status || "Al día") as PatientStatus);
      setImagen(patient.imagen || patient.photoUrl || "");
    } else {
      setNombre("");
      setPropietario("");
      setEspecie("Canino");
      setRaza("");
      setEdad("1 año");
      setEstado("Al día");
      setImagen("");
    }
    setErrors({});
  }, [patient, mode, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!nombre.trim()) newErrors.nombre = "El nombre es obligatorio";
    if (!propietario.trim()) newErrors.propietario = "El propietario es obligatorio";
    if (!raza.trim()) newErrors.raza = "La raza es obligatoria";
    if (!edad.trim()) newErrors.edad = "La edad es obligatoria";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      nombre: nombre.trim(),
      propietario: propietario.trim(),
      especie,
      raza: raza.trim(),
      edad: edad.trim(),
      estado,
      imagen: imagen.trim() || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg rounded-2xl bg-surface-bright/95 backdrop-blur-2xl border border-white/80 shadow-2xl p-6 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Glow corner */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-surface-ice/40 rounded-full blur-2xl pointer-events-none -z-10" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200/60">
          <div>
            <h2 className="text-xl font-bold text-on-surface tracking-tight">
              {mode === "edit" ? "Editar Paciente" : "Nuevo Paciente"}
            </h2>
            <p className="text-xs text-on-surface-variant mt-0.5">
              {mode === "edit"
                ? `Actualizar expediente de ${patient?.nombre || "paciente"}`
                : "Registra un nuevo paciente en la base de datos clínica"}
            </p>
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Especie Selection Pills */}
          <div>
            <label className="block text-xs font-semibold text-on-surface mb-1.5">
              Especie
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setEspecie("Canino")}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  especie === "Canino"
                    ? "bg-primary-container text-white border-primary shadow-sm"
                    : "bg-surface-container-lowest/80 text-on-surface-variant border-slate-200 hover:bg-surface-container-high"
                }`}
              >
                <PawPrint className="w-4 h-4" />
                <span>Canino</span>
              </button>
              <button
                type="button"
                onClick={() => setEspecie("Felino")}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  especie === "Felino"
                    ? "bg-secondary text-white border-secondary shadow-sm"
                    : "bg-surface-container-lowest/80 text-on-surface-variant border-slate-200 hover:bg-surface-container-high"
                }`}
              >
                <Cat className="w-4 h-4" />
                <span>Felino</span>
              </button>
            </div>
          </div>

          {/* Nombre & Raza */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-on-surface mb-1">
                Nombre del Paciente <span className="text-error">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej. Luna"
                  className={`w-full px-3 py-2 text-sm rounded-xl bg-surface-container-lowest border ${
                    errors.nombre ? "border-error focus:ring-error" : "border-slate-200/80 focus:border-primary"
                  } text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-1 focus:ring-primary`}
                />
              </div>
              {errors.nombre && (
                <span className="text-[11px] text-error mt-0.5 block">{errors.nombre}</span>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-on-surface mb-1">
                Raza <span className="text-error">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={raza}
                  onChange={(e) => setRaza(e.target.value)}
                  placeholder="Ej. Golden Retriever"
                  className={`w-full px-3 py-2 text-sm rounded-xl bg-surface-container-lowest border ${
                    errors.raza ? "border-error focus:ring-error" : "border-slate-200/80 focus:border-primary"
                  } text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-1 focus:ring-primary`}
                />
              </div>
              {errors.raza && (
                <span className="text-[11px] text-error mt-0.5 block">{errors.raza}</span>
              )}
            </div>
          </div>

          {/* Propietario & Edad */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-on-surface mb-1">
                Propietario / Tutor <span className="text-error">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={propietario}
                  onChange={(e) => setPropietario(e.target.value)}
                  placeholder="Ej. Sarah Jenkins"
                  className={`w-full px-3 py-2 text-sm rounded-xl bg-surface-container-lowest border ${
                    errors.propietario ? "border-error focus:ring-error" : "border-slate-200/80 focus:border-primary"
                  } text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-1 focus:ring-primary`}
                />
              </div>
              {errors.propietario && (
                <span className="text-[11px] text-error mt-0.5 block">{errors.propietario}</span>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-on-surface mb-1">
                Edad <span className="text-error">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={edad}
                  onChange={(e) => setEdad(e.target.value)}
                  placeholder="Ej. 3 años"
                  className={`w-full px-3 py-2 text-sm rounded-xl bg-surface-container-lowest border ${
                    errors.edad ? "border-error focus:ring-error" : "border-slate-200/80 focus:border-primary"
                  } text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-1 focus:ring-primary`}
                />
              </div>
              {errors.edad && (
                <span className="text-[11px] text-error mt-0.5 block">{errors.edad}</span>
              )}
            </div>
          </div>

          {/* Estado Clínico */}
          <div>
            <label className="block text-xs font-semibold text-on-surface mb-1">
              Estado Clínico
            </label>
            <select
              value={estado}
              onChange={(e) => setEstado(e.target.value as PatientStatus)}
              className="w-full px-3 py-2 text-sm rounded-xl bg-surface-container-lowest border border-slate-200/80 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
            >
              {AVAILABLE_STATUSES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* Optional Imagen URL */}
          <div>
            <label className="block text-xs font-semibold text-on-surface mb-1">
              URL de Imagen / Foto (Opcional)
            </label>
            <input
              type="url"
              value={imagen}
              onChange={(e) => setImagen(e.target.value)}
              placeholder="https://images.dog.ceo/..."
              className="w-full px-3 py-2 text-sm rounded-xl bg-surface-container-lowest border border-slate-200/80 text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-200/60 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-xl text-xs font-semibold px-4 py-2 border-slate-200 text-on-surface-variant hover:bg-surface-container-high"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="rounded-xl text-xs font-bold px-5 py-2 bg-gradient-to-r from-primary to-secondary text-white shadow-md hover:shadow-lg transition-all"
            >
              <CheckCircle2 className="w-4 h-4 mr-1.5" />
              <span>{mode === "edit" ? "Guardar Cambios" : "Crear Paciente"}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientEditModal;
