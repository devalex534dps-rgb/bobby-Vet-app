import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Edit3,
  UserCheck,
  CalendarPlus,
  Trash2,
  AlertCircle,
  Loader2,
  Stethoscope,
} from "lucide-react";
import {
  usePatientsData,
  PatientProfileHero,
  PatientProfileTabs,
  PatientMilestoneCards,
  PatientEditModal,
  TutorEditModal,
  confirmDeletePatientAlert,
  showSuccessToast,
  type ProfileTabId,
} from "@/components/patient-profile";
import { Button } from "@/components/ui/button";
import {
  bobbyApi,
  type BackendAppointmentDto,
  type BackendConsultationDto,
} from "@/services/bobbyApi";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { Patient, PatientSpecies, PatientStatus } from "@/components/patients/types";
import { getStatusVariant } from "@/components/patient-profile/usePatientsData";

export const PatientProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ProfileTabId>("resumen");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isTutorModalOpen, setIsTutorModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { getPatientById, updatePatient, deletePatient, isLoading: isListLoading } = usePatientsData();
  const cachedPatient = id ? getPatientById(id) : undefined;

  const detailQuery = useQuery({
    queryKey: ["patient", id],
    queryFn: () => bobbyApi.getPatientById(id!),
    enabled: Boolean(id && !cachedPatient),
    staleTime: 1000 * 30,
  });

  const patient: Patient | undefined = cachedPatient ?? (detailQuery.data ? {
    id: detailQuery.data.id,
    tutorId: detailQuery.data.tutorId,
    nombre: detailQuery.data.name,
    especie: (detailQuery.data.species || "Canino") as PatientSpecies,
    raza: detailQuery.data.breed,
    propietario: detailQuery.data.ownerName,
    edad: detailQuery.data.ageLabel || "1 año",
    estado: (detailQuery.data.clinicalStatus || "Al día") as PatientStatus,
    imagen: detailQuery.data.photoUrl || "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=300&q=80",
    name: detailQuery.data.name,
    species: (detailQuery.data.species || "Canino") as PatientSpecies,
    breed: detailQuery.data.breed,
    ownerName: detailQuery.data.ownerName,
    age: detailQuery.data.ageLabel || "1 año",
    gender: detailQuery.data.gender || "Macho",
    status: (detailQuery.data.clinicalStatus || "Al día") as PatientStatus,
    statusVariant: getStatusVariant(detailQuery.data.clinicalStatus || "Al día"),
    photoUrl: detailQuery.data.photoUrl || "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=300&q=80",
    chipId: `VET-${detailQuery.data.id.slice(0, 6).toUpperCase()}`,
    ownerContact: detailQuery.data.ownerContact,
    ownerEmail: detailQuery.data.ownerEmail,
    ownerAddress: detailQuery.data.ownerAddress,
    lastVisit: "Reciente",
    lastVisitType: "Control clínico",
  } : undefined);

  const isLoading = isListLoading || detailQuery.isLoading;

  const [consultations, setConsultations] = useState<BackendConsultationDto[]>([]);
  const [nextAppointment, setNextAppointment] = useState<BackendAppointmentDto | null>(null);

  useEffect(() => {
    if (!id) return;
    bobbyApi
      .getConsultations({ pacienteId: id, page: 0, size: 20 })
      .then((res) => setConsultations(res.items))
      .catch(() => {});

    bobbyApi
      .getAppointments({ page: 0, size: 20 })
      .then((res) => {
        const match = res.items.find(
          (a) =>
            a.pacienteId === id &&
            (a.status === "confirmed" || a.status === "pending" || a.status === "in_progress")
        );
        setNextAppointment(match || null);
      })
      .catch(() => {});
  }, [id]);

  const handleEditSave = async (data: Parameters<typeof updatePatient>[1]) => {
    if (!patient) return;
    await updatePatient(patient.id, data);
    showSuccessToast("Expediente Actualizado", `Los datos de ${data.nombre} han sido guardados.`);
  };

  const handleDeletePatient = async () => {
    if (!patient) return;
    const confirmed = await confirmDeletePatientAlert(patient.nombre || patient.name);
    if (confirmed) {
      await deletePatient(patient.id);
      await showSuccessToast("Paciente Eliminado", `${patient.nombre} ha sido removido del sistema.`);
      navigate("/patients");
    }
  };

  return (
    <div className="relative w-full pb-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-12 -left-20 w-96 h-96 rounded-full bg-surface-ice/40 blur-[130px] -z-10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-48 right-0 w-[420px] h-[420px] rounded-full bg-secondary-fixed/40 blur-[140px] -z-10"
      />

      {isLoading && !patient ? (
        <div className="mt-12 flex flex-col items-center justify-center p-16 rounded-2xl bg-glass-fill backdrop-blur-xl border border-white/80 shadow-sm text-center">
          <Loader2 className="w-9 h-9 text-primary animate-spin mb-3" />
          <p className="text-base font-semibold text-on-surface">
            Cargando expediente del paciente...
          </p>
        </div>
      ) : !patient ? (
        <div className="mt-12 flex flex-col items-center justify-center p-12 sm:p-16 rounded-2xl bg-glass-fill backdrop-blur-xl border border-white/80 shadow-sm text-center max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-error-container/60 border border-error/20 flex items-center justify-center text-error mb-4 shadow-sm">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-on-surface tracking-tight">
            Paciente no encontrado
          </h2>
          <p className="text-sm text-on-surface-variant mt-2 max-w-md leading-relaxed">
            No pudimos encontrar un paciente registrado con el identificador{" "}
            <code className="px-2 py-0.5 rounded bg-surface-container-high font-mono text-xs text-primary font-bold">
              {id}
            </code>.
          </p>
          <div className="mt-6">
            <Button
              type="button"
              onClick={() => navigate("/patients")}
              className="bg-primary text-white font-bold text-xs rounded-xl px-5 py-2.5 shadow-md hover:bg-primary-container transition-all"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              <span>Volver a Pacientes</span>
            </Button>
          </div>
        </div>
      ) : (
        <>
          {/* Breadcrumbs & Actions */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2">
            <div className="flex items-center flex-wrap gap-2">
              <Link
                to="/patients"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors text-xs font-semibold"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Volver a Pacientes</span>
              </Link>
              <span className="text-outline-variant font-medium">/</span>
              <span className="text-lg font-bold text-on-surface tracking-tight">
                {patient.nombre || patient.name}
              </span>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-status-success/15 text-on-surface text-[11px] font-bold ml-1">
                <span className="w-2 h-2 rounded-full bg-status-success animate-pulse" />
                <span>{patient.estado || "Al día"}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 flex-wrap">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(true)}
                className="relative overflow-hidden group inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-container-lowest/80 backdrop-blur-md shadow-xs text-primary text-xs font-semibold border border-[#2c5eae] cursor-pointer"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-r from-[#024594] to-[#1591dc] -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"
                />
                <Edit3 className="w-4 h-4 relative z-10 text-primary group-hover:text-white transition-colors duration-300" />
                <span className="relative z-10 group-hover:text-white transition-colors duration-300">
                  Editar
                </span>
              </button>

              {patient.tutorId && (
                <button
                  type="button"
                  onClick={() => setIsTutorModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-glass-fill backdrop-blur-md border border-primary/40 text-primary text-xs font-semibold shadow-xs hover:bg-primary hover:text-white transition-colors cursor-pointer"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Editar Tutor</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleDeletePatient}
                className="relative overflow-hidden group inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-error-container/20 border border-error/40 text-error text-xs font-semibold shadow-xs cursor-pointer"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-r from-[#ba1a1a] to-[#ef4444] -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"
                />
                <Trash2 className="w-4 h-4 relative z-10 text-error group-hover:text-white transition-colors duration-300" />
                <span className="relative z-10 group-hover:text-white transition-colors duration-300">
                  Eliminar
                </span>
              </button>

              <Button
                type="button"
                onClick={() => navigate("/citas")}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-primary to-secondary text-white shadow-md hover:shadow-lg hover:brightness-105 active:scale-[0.99] transition-all text-xs font-bold"
              >
                <CalendarPlus className="w-4 h-4" />
                <span>Agendar Cita</span>
              </Button>
            </div>
          </div>

          <PatientProfileHero patient={patient} />

          <PatientProfileTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            consultationsCount={consultations.length}
          />

          <div className="mt-4">
            {activeTab === "resumen" && (
              <PatientMilestoneCards
                nextAppointment={nextAppointment}
                lastConsultation={consultations[0] || null}
              />
            )}

            {activeTab === "historial" && (
              <div className="p-6 rounded-2xl bg-glass-fill backdrop-blur-xl border border-white/80 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Stethoscope className="w-5 h-5 text-primary" />
                    <div>
                      <h3 className="text-base font-bold text-on-surface">
                        Historial de Consultas
                      </h3>
                      <p className="text-xs text-on-surface-variant">
                        Consultas médicas y servicios aplicados a {patient.nombre}
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    onClick={() => navigate("/consultas")}
                    className="bg-primary text-white text-xs font-bold rounded-xl px-3 py-1.5"
                  >
                    Ir a Consultas
                  </Button>
                </div>

                {consultations.length === 0 ? (
                  <p className="text-sm text-on-surface-variant py-6 text-center">
                    No hay consultas registradas para este paciente.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {consultations.map((c) => (
                      <div
                        key={c.id}
                        className="p-4 rounded-xl bg-surface-container-lowest/90 border border-white/80 shadow-xs space-y-1.5"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-sm font-bold text-on-surface">{c.reason}</h4>
                          <span className="text-[11px] font-mono text-primary font-semibold">
                            {new Date(c.startedAt).toLocaleDateString()}
                          </span>
                        </div>
                        {c.diagnosis && (
                          <p className="text-xs text-on-surface-variant">
                            <strong>Diagnóstico:</strong> {c.diagnosis}
                          </p>
                        )}
                        {c.treatment && (
                          <p className="text-xs text-on-surface-variant">
                            <strong>Tratamiento:</strong> {c.treatment}
                          </p>
                        )}
                        {c.servicios.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {c.servicios.map((s) => (
                              <span
                                key={s.id}
                                className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[11px] font-semibold"
                              >
                                {s.name}
                              </span>
                            ))}
                          </div>
                        )}
                        <p className="text-[11px] text-on-surface-variant">
                          Atendido por: <strong>{c.veterinarioName}</strong>
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <PatientEditModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onSave={handleEditSave}
            patient={patient}
            mode="edit"
          />

          <TutorEditModal
            isOpen={isTutorModalOpen}
            tutorId={patient.tutorId}
            initialName={patient.propietario}
            initialPhone={patient.ownerContact}
            initialEmail={patient.ownerEmail || ""}
            initialAddress={patient.ownerAddress || ""}
            onClose={() => setIsTutorModalOpen(false)}
            onSaved={async () => {
              await queryClient.invalidateQueries({ queryKey: ["patients"] });
              await queryClient.invalidateQueries({ queryKey: ["patient", id] });
              showSuccessToast("Tutor Actualizado", "La información del tutor ha sido guardada.");
            }}
          />
        </>
      )}
    </div>
  );
};

export default PatientProfile;
