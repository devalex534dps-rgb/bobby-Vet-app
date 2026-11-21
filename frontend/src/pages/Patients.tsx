import React, { useState, useMemo } from "react";
import { PatientHeader } from "@/components/patients/PatientHeader";
import { PatientsToolbar } from "@/components/patients/PatientsToolbar";
import { PatientsTable } from "@/components/patients/PatientsTable";
import {
  usePatientsData,
  PatientEditModal,
  confirmDeletePatientAlert,
  showSuccessToast,
} from "@/components/patient-profile";
import type { Patient, PatientFilterTab } from "@/components/patients/types";
import { Loader2 } from "lucide-react";

export const Patients: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<PatientFilterTab>("todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [speciesFilter, setSpeciesFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(0);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  const effectiveStatus =
    currentTab === "vacunas" ? "Vacuna pendiente" : statusFilter;

  const {
    patients,
    totalPages,
    totalItems,
    isLoading,
    createPatient,
    updatePatient,
    deletePatient,
  } = usePatientsData({
    species: speciesFilter,
    status: effectiveStatus,
    q: searchQuery,
    page,
    size: 8,
  });

  // Modal State for Create and Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const handleOpenCreate = () => {
    setSelectedPatient(null);
    setModalMode("create");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (patient: Patient) => {
    setSelectedPatient(patient);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleDeletePatient = async (patient: Patient) => {
    const confirmed = await confirmDeletePatientAlert(patient.nombre || patient.name);
    if (confirmed) {
      deletePatient(patient.id);
      showSuccessToast("Paciente Eliminado", `${patient.nombre} ha sido removido del directorio.`);
    }
  };

  const handleSaveModal = async (data: any) => {
    if (modalMode === "create") {
      const created = await createPatient(data);
      showSuccessToast("Paciente Creado", `${created.nombre} ha sido agregado exitosamente.`);
    } else if (selectedPatient) {
      await updatePatient(selectedPatient.id, data);
      showSuccessToast("Paciente Actualizado", `Los datos de ${data.nombre} han sido guardados.`);
    }
  };

  // Filter patients based on tab, search query, species, and clinical status
  const filteredPatients = useMemo(() => {
    return patients.filter((patient: Patient) => {
      if (currentTab === "vacunas" && patient.estado !== "Vacuna pendiente") {
        return false;
      }
      if (currentTab === "citas-pendientes" && patient.estado === "Al día") {
        return false;
      }
      return true;
    });
  }, [patients, currentTab]);

  const handleResetFilters = () => {
    setPage(0);
    setCurrentTab("todos");
    setSearchQuery("");
    setSpeciesFilter("all");
    setStatusFilter("all");
  };

  const handleExport = () => {
    const header = ["Nombre", "Especie", "Raza", "Tutor", "Contacto", "Edad", "Estado"];
    const rows = filteredPatients.map((p) => [
      p.nombre,
      p.especie,
      p.raza,
      p.propietario,
      p.ownerContact,
      p.edad,
      p.estado,
    ]);
    const csv = [header, ...rows]
      .map((r) => r.map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "directorio-pacientes-bobby.csv";
    a.click();
    URL.revokeObjectURL(url);
    showSuccessToast("Directorio Exportado", "Se descargó el archivo CSV de pacientes.");
  };

  return (
    <div className="relative w-full">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-12 right-12 w-96 h-96 rounded-full bg-surface-ice/40 blur-[120px] -z-10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-48 left-10 w-80 h-80 rounded-full bg-secondary-fixed/50 blur-[130px] -z-10"
      />

      <PatientHeader onNewPatient={handleOpenCreate} onExport={handleExport} />

      <PatientsToolbar
        currentTab={currentTab}
        onTabChange={(t) => {
          setPage(0);
          setCurrentTab(t);
        }}
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setPage(0);
          setSearchQuery(q);
        }}
        speciesFilter={speciesFilter}
        onSpeciesFilterChange={(s) => {
          setPage(0);
          setSpeciesFilter(s);
        }}
        statusFilter={statusFilter}
        onStatusFilterChange={(st) => {
          setPage(0);
          setStatusFilter(st);
        }}
        onResetFilters={handleResetFilters}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {isLoading && patients.length === 0 ? (
        <div className="mt-6 flex flex-col items-center justify-center p-12 rounded-2xl bg-glass-fill backdrop-blur-xl border border-white/80 shadow-sm">
          <Loader2 className="w-8 h-8 text-primary animate-spin mb-3" />
          <p className="text-sm font-semibold text-on-surface">
            Cargando pacientes...
          </p>
        </div>
      ) : (
        <>
          <PatientsTable
            patients={filteredPatients}
            viewMode={viewMode}
            onEditPatient={handleOpenEdit}
            onDeletePatient={handleDeletePatient}
          />
          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between px-4 py-3 rounded-2xl bg-glass-fill backdrop-blur-xl border border-white/80 text-xs text-on-surface-variant">
              <span>
                Página {page + 1} de {totalPages} • {totalItems} pacientes
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={page === 0}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-semibold disabled:opacity-50 cursor-pointer"
                >
                  Anterior
                </button>
                <button
                  type="button"
                  disabled={page + 1 >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-semibold disabled:opacity-50 cursor-pointer"
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}
        </>
      )}

      <PatientEditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveModal}
        patient={selectedPatient}
        mode={modalMode}
      />
    </div>
  );
};

export default Patients;
