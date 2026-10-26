import React, { useState, useMemo } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { PatientHeader } from "@/components/patients/PatientHeader";
import { PatientsKpiCards } from "@/components/patients/PatientsKpiCards";
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState<PatientFilterTab>("todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [speciesFilter, setSpeciesFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  // Synchronized unified patient data source with TanStack Query
  const {
    patients,
    isLoading,
    createPatient,
    updatePatient,
    deletePatient,
  } = usePatientsData();

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

  const handleSaveModal = (data: any) => {
    if (modalMode === "create") {
      const created = createPatient(data);
      showSuccessToast("Paciente Creado", `${created.nombre} ha sido agregado exitosamente.`);
    } else if (selectedPatient) {
      updatePatient(selectedPatient.id, data);
      showSuccessToast("Paciente Actualizado", `Los datos de ${data.nombre} han sido guardados.`);
    }
  };

  // Filter patients based on tab, search query, species, and clinical status
  const filteredPatients = useMemo(() => {
    return patients.filter((patient: Patient) => {
      // Tab filter
      if (currentTab === "vacunas" && patient.estado !== "Vacuna pendiente") {
        return false;
      }
      if (currentTab === "citas-pendientes" && patient.estado === "Al día") {
        return false;
      }

      // Species filter
      if (speciesFilter !== "all" && patient.especie !== speciesFilter) {
        return false;
      }

      // Status filter
      if (statusFilter !== "all" && patient.estado !== statusFilter) {
        return false;
      }

      // Search query
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase().trim();
        const matchesName =
          patient.nombre.toLowerCase().includes(query) ||
          patient.name.toLowerCase().includes(query);
        const matchesChip = patient.chipId.toLowerCase().includes(query);
        const matchesBreed =
          patient.raza.toLowerCase().includes(query) ||
          patient.breed.toLowerCase().includes(query);
        const matchesOwner =
          patient.propietario.toLowerCase().includes(query) ||
          patient.ownerName.toLowerCase().includes(query);
        const matchesContact = patient.ownerContact
          .toLowerCase()
          .includes(query);

        if (
          !matchesName &&
          !matchesChip &&
          !matchesBreed &&
          !matchesOwner &&
          !matchesContact
        ) {
          return false;
        }
      }

      return true;
    });
  }, [patients, currentTab, searchQuery, speciesFilter, statusFilter]);

  const handleResetFilters = () => {
    setCurrentTab("todos");
    setSearchQuery("");
    setSpeciesFilter("all");
    setStatusFilter("all");
  };

  return (
    <div className="min-h-screen bg-surface font-sans text-on-surface antialiased selection:bg-primary selection:text-white">
      {/* Responsive Executive Sidebar */}
      <Sidebar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Main Container */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Fixed Header */}
        <Header onOpenMobileMenu={() => setMobileMenuOpen(true)} />

        {/* Scrollable Main Area */}
        <main className="w-full pt-20 pb-12 px-4 sm:px-6 lg:px-8 flex-1 relative">
          <div className="flex flex-col w-full max-w-7xl mx-auto">
            {/* Atmospheric Ambient Backdrop Glows */}
            <div className="relative w-full">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-12 right-12 w-96 h-96 rounded-full bg-surface-ice/40 blur-[120px] -z-10"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute top-48 left-10 w-80 h-80 rounded-full bg-secondary-fixed/50 blur-[130px] -z-10"
              />

              {/* 1. Page Header: Breadcrumb & Executive Actions */}
              <PatientHeader onNewPatient={handleOpenCreate} />

              {/* 2. KPI Metrics Ribbon (4 Cards) */}
              <PatientsKpiCards />

              {/* 3. Advanced Filter & Control Toolbar */}
              <PatientsToolbar
                currentTab={currentTab}
                onTabChange={setCurrentTab}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                speciesFilter={speciesFilter}
                onSpeciesFilterChange={setSpeciesFilter}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
                onResetFilters={handleResetFilters}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
              />

              {/* Loading Indicator or Data Table */}
              {isLoading && patients.length === 0 ? (
                <div className="mt-6 flex flex-col items-center justify-center p-12 rounded-2xl bg-glass-fill backdrop-blur-xl border border-white/80 shadow-sm">
                  <Loader2 className="w-8 h-8 text-primary animate-spin mb-3" />
                  <p className="text-sm font-semibold text-on-surface">
                    Cargando pacientes desde APIs (Dog.ceo & Cataas)...
                  </p>
                </div>
              ) : (
                /* 4. Modern Glass Data Table with 5. Footer & Pagination */
                <PatientsTable
                  patients={filteredPatients}
                  viewMode={viewMode}
                  onEditPatient={handleOpenEdit}
                  onDeletePatient={handleDeletePatient}
                />
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Patient Create / Edit Modal */}
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
