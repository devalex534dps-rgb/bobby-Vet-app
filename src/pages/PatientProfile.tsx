import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Edit3,
  Printer,
  CalendarPlus,
  Trash2,
  AlertCircle,
  Loader2,
  Syringe,
  Pill,
  FileText,
  FlaskConical,
  Plus,
} from "lucide-react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import {
  usePatientsData,
  PatientProfileHero,
  PatientProfileTabs,
  PatientMilestoneCards,
  PatientClinicalOverview,
  PatientEditModal,
  confirmDeletePatientAlert,
  showSuccessToast,
  type ProfileTabId,
} from "@/components/patient-profile";
import { Button } from "@/components/ui/button";

export const PatientProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<ProfileTabId>("resumen");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { getPatientById, updatePatient, deletePatient, isLoading } = usePatientsData();

  const patient = id ? getPatientById(id) : undefined;

  const handleEditSave = (data: Parameters<typeof updatePatient>[1]) => {
    if (!patient) return;
    updatePatient(patient.id, data);
    showSuccessToast("Expediente Actualizado", `Los datos de ${data.nombre} han sido guardados.`);
  };

  const handleDeletePatient = async () => {
    if (!patient) return;
    const confirmed = await confirmDeletePatientAlert(patient.nombre || patient.name);
    if (confirmed) {
      deletePatient(patient.id);
      await showSuccessToast("Paciente Eliminado", `${patient.nombre} ha sido removido del sistema.`);
      navigate("/patients");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-surface font-sans text-on-surface antialiased selection:bg-primary selection:text-white">
      {/* Responsive Sidebar */}
      <Sidebar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Header Bar */}
        <Header onOpenMobileMenu={() => setMobileMenuOpen(true)} />

        {/* Main Content Area */}
        <main className="w-full pt-20 pb-16 px-4 sm:px-6 lg:px-8 flex-1 relative">
          <div className="flex flex-col w-full max-w-7xl mx-auto pb-8">
            {/* Ambient Background Glows */}
            <div className="relative w-full">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-12 -left-20 w-96 h-96 rounded-full bg-surface-ice/40 blur-[130px] -z-10"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute top-48 right-0 w-[420px] h-[420px] rounded-full bg-secondary-fixed/40 blur-[140px] -z-10"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute bottom-10 left-1/3 w-80 h-80 rounded-full bg-surface-container-high/40 blur-[120px] -z-10"
              />

              {/* Loading State */}
              {isLoading && !patient ? (
                <div className="mt-12 flex flex-col items-center justify-center p-16 rounded-2xl bg-glass-fill backdrop-blur-xl border border-white/80 shadow-sm text-center">
                  <Loader2 className="w-9 h-9 text-primary animate-spin mb-3" />
                  <p className="text-base font-semibold text-on-surface">
                    Cargando expediente del paciente...
                  </p>
                  <p className="text-xs text-on-surface-variant mt-1">
                    Sincronizando información clínica con la base de datos
                  </p>
                </div>
              ) : !patient ? (
                /* Patient Not Found State */
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
                    </code>
                    . Es posible que haya sido eliminado o que el enlace sea incorrecto.
                  </p>
                  <div className="mt-6 flex items-center gap-3">
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
                /* Patient Found Profile View */
                <>
                  {/* 1. Breadcrumbs Navigation & Executive Action Header */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2">
                    {/* Breadcrumbs & Live Status Pill */}
                    <div className="flex items-center flex-wrap gap-2">
                      <Link
                        to="/patients"
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors text-xs font-semibold"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Volver a Pacientes</span>
                      </Link>
                      <span className="text-outline-variant font-medium">/</span>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-on-surface tracking-tight">
                          {patient.nombre || patient.name}
                        </span>
                      </div>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-status-success/15 text-on-surface text-[11px] font-bold ml-1">
                        <span className="w-2 h-2 rounded-full bg-status-success animate-pulse" />
                        <span>Paciente {patient.estado || "Activo"}</span>
                      </div>
                    </div>

                    {/* Header Quick Actions */}
                    <div className="flex items-center gap-2 shrink-0 flex-wrap">
                      {/* Editar */}
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsEditModalOpen(true)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface-container-lowest/80 backdrop-blur-md shadow-xs text-primary hover:bg-surface-container hover:text-primary transition-all text-xs font-semibold border-[#2c5eae]"
                      >
                        <Edit3 className="w-4 h-4 text-primary" />
                        <span>Editar</span>
                      </Button>

                      {/* Eliminar */}
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleDeletePatient}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-error-container/20 border-error/30 text-error hover:bg-error-container/40 hover:text-error transition-all text-xs font-semibold shadow-xs"
                      >
                        <Trash2 className="w-4 h-4 text-error" />
                        <span>Eliminar</span>
                      </Button>

                      {/* Imprimir */}
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handlePrint}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface-container-lowest/80 backdrop-blur-md shadow-xs border-[#2c5eae] text-primary hover:bg-surface-container transition-all text-xs font-semibold hidden sm:inline-flex"
                      >
                        <Printer className="w-4 h-4" />
                        <span>Imprimir</span>
                      </Button>

                      {/* Agendar Consulta */}
                      <Button
                        type="button"
                        onClick={() =>
                          showSuccessToast(
                            "Agendar Consulta",
                            `Se ha iniciado la reserva para ${patient.nombre}.`
                          )
                        }
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-primary to-secondary text-white shadow-md hover:shadow-lg hover:brightness-105 active:scale-[0.99] transition-all text-xs font-bold"
                      >
                        <CalendarPlus className="w-4 h-4" />
                        <span>+ Agendar Consulta</span>
                      </Button>
                    </div>
                  </div>

                  {/* 2. Master Glassmorphic Hero Card: Patient & Guardian Dossier */}
                  <PatientProfileHero patient={patient} />

                  {/* 3. Navigation Tabs (Stripe / Linear Architecture) */}
                  <PatientProfileTabs
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                  />

                  {/* 4. Tab Contents */}
                  <div className="mt-4">
                    {activeTab === "resumen" && (
                      <div className="space-y-4">
                        {/* Executive KPI & Milestone Glass Cards (3 Columns) */}
                        <PatientMilestoneCards patient={patient} />

                        {/* Deep Clinical Data & Timeline (8 Cols) + Health Analytics & Actions (4 Cols) */}
                        <PatientClinicalOverview patient={patient} />
                      </div>
                    )}

                    {activeTab === "historial" && (
                      <div className="p-6 rounded-2xl bg-glass-fill backdrop-blur-xl border border-white/80 shadow-sm space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                          <div>
                            <h3 className="text-base font-bold text-on-surface">
                              Historial Clínico Integral
                            </h3>
                            <p className="text-xs text-on-surface-variant">
                              Registro completo de atenciones, diagnósticos y procedimientos
                            </p>
                          </div>
                          <Button
                            type="button"
                            onClick={() => showSuccessToast("Nueva Entrada Clínica", "Abriendo formulario de evolución...")}
                            className="bg-primary text-white text-xs font-bold rounded-xl px-3 py-1.5"
                          >
                            <Plus className="w-3.5 h-3.5 mr-1" /> Nueva Entrada
                          </Button>
                        </div>
                        <div className="space-y-3">
                          {[
                            {
                              date: "21 Octubre 2024",
                              title: "Chequeo Semestral y Citología Auricular",
                              vet: "Dr. Julian Rivera",
                              notes: "Condición general óptima. Sin anomalías en conducto auditivo. Peso 28.4 kg.",
                            },
                            {
                              date: "15 Agosto 2024",
                              title: "Inmunización Séxtuple Canina",
                              vet: "Dra. Eleanor Vance",
                              notes: "Vacuna de refuerzo aplicada sin reacciones adversas. Certificado oficial emitido.",
                            },
                            {
                              date: "02 Junio 2024",
                              title: "Tratamiento Antiparasitario Preventivo",
                              vet: "Dra. Eleanor Vance",
                              notes: "Suministro oral de NexGard Spectra. Próxima dosis en 3 meses.",
                            },
                          ].map((item, i) => (
                            <div
                              key={i}
                              className="p-4 rounded-xl bg-surface-container-lowest/90 border border-white/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                            >
                              <div>
                                <span className="text-[11px] font-mono text-primary font-semibold">
                                  {item.date}
                                </span>
                                <h4 className="text-sm font-bold text-on-surface mt-0.5">
                                  {item.title}
                                </h4>
                                <p className="text-xs text-on-surface-variant mt-1">
                                  {item.notes}
                                </p>
                              </div>
                              <div className="text-right shrink-0">
                                <span className="text-xs font-semibold text-on-surface block">
                                  {item.vet}
                                </span>
                                <span className="text-[11px] text-status-success font-medium">
                                  Finalizado y validado
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeTab === "vacunas" && (
                      <div className="p-6 rounded-2xl bg-glass-fill backdrop-blur-xl border border-white/80 shadow-sm space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                          <div>
                            <h3 className="text-base font-bold text-on-surface">
                              Esquema de Inmunización
                            </h3>
                            <p className="text-xs text-on-surface-variant">
                              Registro y calendarización de vacunas preventivas
                            </p>
                          </div>
                          <span className="px-3 py-1 rounded-full bg-status-success/20 text-status-success text-xs font-bold">
                            Esquema Completo
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {[
                            { name: "Rabia Anual", last: "15 Ene 2024", next: "15 Ene 2026", status: "Próxima en 68 días" },
                            { name: "Séxtuple Canina (DHPP)", last: "15 Ago 2024", next: "15 Ago 2026", status: "Al día" },
                            { name: "Tos de las Perreras (KC)", last: "10 Mar 2024", next: "10 Mar 2026", status: "Al día" },
                            { name: "Leptospirosis Refuerzo", last: "15 Ago 2024", next: "15 Ago 2026", status: "Al día" },
                          ].map((v, i) => (
                            <div key={i} className="p-4 rounded-xl bg-surface-container-lowest/90 border border-white/80 shadow-xs flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-status-success/15 flex items-center justify-center text-status-success">
                                  <Syringe className="w-4 h-4" />
                                </div>
                                <div>
                                  <h4 className="text-xs font-bold text-on-surface">{v.name}</h4>
                                  <p className="text-[11px] text-on-surface-variant">Última: {v.last}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <span className="text-xs font-semibold text-primary">{v.next}</span>
                                <span className="text-[10px] text-status-success block font-medium">{v.status}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeTab === "recetas" && (
                      <div className="p-6 rounded-2xl bg-glass-fill backdrop-blur-xl border border-white/80 shadow-sm space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                          <div>
                            <h3 className="text-base font-bold text-on-surface">
                              Tratamientos y Recetas Digitales
                            </h3>
                            <p className="text-xs text-on-surface-variant">
                              Fármacos activos prescritos para {patient.nombre}
                            </p>
                          </div>
                          <Button
                            type="button"
                            onClick={() => showSuccessToast("Nueva Receta", "Abriendo módulo de prescripción digital...")}
                            className="bg-primary text-white text-xs font-bold rounded-xl px-3 py-1.5"
                          >
                            <Pill className="w-3.5 h-3.5 mr-1" /> Prescribir Fármaco
                          </Button>
                        </div>
                        <div className="space-y-3">
                          <div className="p-4 rounded-xl bg-surface-container-lowest/90 border border-white/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-primary-fixed flex items-center justify-center text-primary">
                                <Pill className="w-4 h-4" />
                              </div>
                              <div>
                                <h4 className="text-xs font-bold text-on-surface">Limpiador Ótico Fisiológico (Otoclean)</h4>
                                <p className="text-[11px] text-on-surface-variant">Aplicar 2 gotas en cada pabellón semanalmente como profilaxis</p>
                              </div>
                            </div>
                            <span className="px-2.5 py-1 rounded-full bg-status-success/15 text-status-success text-xs font-bold">
                              Tratamiento Activo
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === "laboratorio" && (
                      <div className="p-6 rounded-2xl bg-glass-fill backdrop-blur-xl border border-white/80 shadow-sm space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                          <div>
                            <h3 className="text-base font-bold text-on-surface">
                              Resultados de Laboratorio
                            </h3>
                            <p className="text-xs text-on-surface-variant">
                              Bioquímica, hemogramas y citologías procesadas
                            </p>
                          </div>
                          <Button
                            type="button"
                            onClick={() => showSuccessToast("Cargar Analítica", "Módulo de carga DICOM/PDF iniciado.")}
                            className="bg-primary text-white text-xs font-bold rounded-xl px-3 py-1.5"
                          >
                            <FlaskConical className="w-3.5 h-3.5 mr-1" /> Cargar Analítica
                          </Button>
                        </div>
                        <div className="space-y-3">
                          <div className="p-4 rounded-xl bg-surface-container-lowest/90 border border-white/80 shadow-xs flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-secondary-fixed flex items-center justify-center text-secondary">
                                <FlaskConical className="w-4 h-4" />
                              </div>
                              <div>
                                <h4 className="text-xs font-bold text-on-surface">Citología Auricular Bilateral</h4>
                                <p className="text-[11px] text-on-surface-variant">Procesado por VetLab Central • 21 Oct 2024</p>
                              </div>
                            </div>
                            <span className="text-xs font-bold text-status-success">Negativo a Malassezia</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === "archivos" && (
                      <div className="p-6 rounded-2xl bg-glass-fill backdrop-blur-xl border border-white/80 shadow-sm space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                          <div>
                            <h3 className="text-base font-bold text-on-surface">
                              Archivos y Documentos Digitalizados
                            </h3>
                            <p className="text-xs text-on-surface-variant">
                              Consentimientos, pólizas de seguro y cartillas sanitarias
                            </p>
                          </div>
                          <Button
                            type="button"
                            onClick={() => showSuccessToast("Subir Documento", "Selecciona un archivo del equipo.")}
                            className="bg-primary text-white text-xs font-bold rounded-xl px-3 py-1.5"
                          >
                            <FileText className="w-3.5 h-3.5 mr-1" /> Subir Documento
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {[
                            { name: `Pasaporte_Sanitario_${patient.nombre}.pdf`, size: "2.4 MB", date: "10 Ene 2024" },
                            { name: "Poliza_Seguro_PetPlan_Platinum.pdf", size: "1.1 MB", date: "05 Mar 2024" },
                            { name: "Registro_REIAC_Oficial.pdf", size: "850 KB", date: "14 Ago 2022" },
                            { name: "Consentimiento_Quirurgico_Firmado.pdf", size: "1.6 MB", date: "22 Nov 2023" },
                          ].map((doc, idx) => (
                            <div key={idx} className="p-3.5 rounded-xl bg-surface-container-lowest/90 border border-white/80 shadow-xs flex items-center justify-between">
                              <div className="flex items-center gap-2.5 truncate">
                                <FileText className="w-4 h-4 text-primary shrink-0" />
                                <div className="truncate">
                                  <h4 className="text-xs font-bold text-on-surface truncate">{doc.name}</h4>
                                  <p className="text-[10px] text-on-surface-variant font-mono">{doc.size} • {doc.date}</p>
                                </div>
                              </div>
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => showSuccessToast("Descarga iniciada", `Descargando ${doc.name}`)}
                                className="text-[11px] px-2.5 py-1 h-auto rounded-lg font-semibold"
                              >
                                Descargar
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Edit Patient Modal */}
                  <PatientEditModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    onSave={handleEditSave}
                    patient={patient}
                    mode="edit"
                  />
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PatientProfile;
