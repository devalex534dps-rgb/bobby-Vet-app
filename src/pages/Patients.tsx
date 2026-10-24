import React, { useState, useMemo } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { PatientHeader } from "@/components/patients/PatientHeader";
import { PatientsKpiCards } from "@/components/patients/PatientsKpiCards";
import { PatientsToolbar } from "@/components/patients/PatientsToolbar";
import { PatientsTable } from "@/components/patients/PatientsTable";
import { patientsMockData } from "@/components/patients/mockData";
import type { PatientFilterTab } from "@/components/patients/types";

export const Patients: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState<PatientFilterTab>("todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [speciesFilter, setSpeciesFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  // Filter patients based on tab, search query, species, and clinical status
  const filteredPatients = useMemo(() => {
    return patientsMockData.filter((patient) => {
      // Tab filter
      if (currentTab === "vacunas" && patient.status !== "Vacuna pendiente") {
        return false;
      }
      if (currentTab === "citas-pendientes" && patient.status === "Al día") {
        return false;
      }

      // Species filter
      if (speciesFilter !== "all" && patient.species !== speciesFilter) {
        return false;
      }

      // Status filter
      if (statusFilter !== "all" && patient.status !== statusFilter) {
        return false;
      }

      // Search query
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = patient.name.toLowerCase().includes(query);
        const matchesChip = patient.chipId.toLowerCase().includes(query);
        const matchesBreed = patient.breed.toLowerCase().includes(query);
        const matchesOwner = patient.ownerName.toLowerCase().includes(query);
        const matchesContact = patient.ownerContact.toLowerCase().includes(query);

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
  }, [currentTab, searchQuery, speciesFilter, statusFilter]);

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
              <PatientHeader />

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

              {/* 4. Modern Glass Data Table with 5. Footer & Pagination */}
              <PatientsTable
                patients={filteredPatients}
                viewMode={viewMode}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Patients;
