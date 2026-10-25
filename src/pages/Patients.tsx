import React, { useState, useMemo } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { PatientHeader } from "@/components/patients/PatientHeader";
import { PatientsKpiCards } from "@/components/patients/PatientsKpiCards";
import { PatientsToolbar } from "@/components/patients/PatientsToolbar";
import { PatientsTable } from "@/components/patients/PatientsTable";
import { useCats } from "@/hooks/useCats";
import { useDogs } from "@/hooks/useDogs";
import type { Patient, PatientFilterTab, PatientStatus } from "@/components/patients/types";
import { Loader2 } from "lucide-react";

export const Patients: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState<PatientFilterTab>("todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [speciesFilter, setSpeciesFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  // Real APIs via TanStack Query hooks
  const { cats, isLoading: isLoadingCats } = useCats(6);
  const { dogs, isLoading: isLoadingDogs } = useDogs([
    "retriever",
    "germanshepherd",
    "bulldog",
    "poodle",
    "husky",
    "beagle",
  ]);

  // Combine real dogs and cats into the required patient structure:
  // { id, nombre, especie, raza, propietario, edad, estado, imagen }
  const realPatients = useMemo<Patient[]>(() => {
    const list: Patient[] = [];

    // Dog profiles from dog.ceo API
    const dogNames = ["Luna", "Rocky", "Bella", "Coco", "Thor", "Max"];
    const dogBreedsDisplay: Record<string, string> = {
      retriever: "Golden Retriever",
      germanshepherd: "Pastor Alemán",
      bulldog: "Bulldog Francés",
      poodle: "Caniche Toy",
      husky: "Husky Siberiano",
      beagle: "Beagle",
    };
    const dogOwners = [
      "Sarah Jenkins",
      "Carlos Morales",
      "Elena Rostova",
      "Sofía Valenzuela",
      "Patricia Méndez",
      "Roberto Silva",
    ];
    const dogContacts = [
      "+34 612 345 678",
      "+34 644 987 654",
      "+34 689 123 456",
      "sofia.v@cloud.com",
      "patricia.m@mail.com",
      "+34 670 112 334",
    ];
    const dogAges = ["3 años", "1 año", "4 años", "6 años", "4 años", "2 años"];
    const dogGenders = ["Hembra", "Macho", "Hembra (E)", "Hembra", "Macho", "Macho"];
    const dogStatuses: PatientStatus[] = [
      "Al día",
      "Al día",
      "En seguimiento",
      "Al día",
      "En recuperación",
      "En tratamiento",
    ];
    const dogVisits = [
      "Hace 3 días",
      "10 Oct",
      "14 Oct",
      "8 Oct",
      "Ayer",
      "Hace 2 días",
    ];
    const dogVisitTypes = [
      "Chequeo Bienestar",
      "Traumatología",
      "Dermatología",
      "Cardiología",
      "Postoperatorio",
      "Vacunación",
    ];

    dogs.forEach((dog, idx) => {
      const nombre = dogNames[idx % dogNames.length];
      const raza =
        dogBreedsDisplay[dog.breed] ||
        dog.breed.charAt(0).toUpperCase() + dog.breed.slice(1);
      const propietario = dogOwners[idx % dogOwners.length];
      const edad = dogAges[idx % dogAges.length];
      const estado = dogStatuses[idx % dogStatuses.length];
      const imagen = dog.image;

      list.push({
        id: `dog-${dog.breed}-${idx}`,
        nombre,
        especie: "Canino",
        raza,
        propietario,
        edad,
        estado,
        imagen,
        // UI fields
        name: nombre,
        species: "Canino",
        breed: raza,
        ownerName: propietario,
        age: edad,
        gender: dogGenders[idx % dogGenders.length],
        status: estado,
        statusVariant:
          estado === "Al día"
            ? "success"
            : estado === "En tratamiento"
            ? "warning"
            : estado === "En seguimiento"
            ? "primary"
            : estado === "Vacuna pendiente"
            ? "secondary"
            : "ice",
        photoUrl: imagen,
        chipId: `#CHIP-${8200 + idx}-P`,
        ownerContact: dogContacts[idx % dogContacts.length],
        lastVisit: dogVisits[idx % dogVisits.length],
        lastVisitType: dogVisitTypes[idx % dogVisitTypes.length],
      });
    });

    // Cat profiles from cataas.com API
    const catNames = ["Milo", "Oliver", "Simba", "Cleo", "Felix", "Nala"];
    const catBreedsList = [
      "British Shorthair",
      "Maine Coon",
      "Siamés",
      "Persa",
      "Bengalí",
      "Común Europeo",
    ];
    const catOwners = [
      "Marcus Chen",
      "David Miller",
      "Andrés Gómez",
      "Laura Martínez",
      "Fernando Díaz",
      "Isabel Torres",
    ];
    const catContacts = [
      "marcus.c@email.com",
      "d.miller@vet.net",
      "+34 655 432 109",
      "+34 633 221 445",
      "+34 611 789 012",
      "isabel.t@cloud.com",
    ];
    const catAges = ["2 años", "5 años", "3 años", "1 año", "4 años", "2 años"];
    const catGenders = ["Macho", "Macho", "Macho", "Hembra", "Macho", "Hembra"];
    const catStatuses: PatientStatus[] = [
      "En tratamiento",
      "Vacuna pendiente",
      "Al día",
      "En seguimiento",
      "Al día",
      "Vacuna pendiente",
    ];
    const catVisits = [
      "Hace 5 días",
      "12 Oct",
      "5 Oct",
      "Hace 1 semana",
      "2 Oct",
      "28 Sep",
    ];
    const catVisitTypes = [
      "Limpieza Dental",
      "Refuerzo séxtuple",
      "Desparasitación",
      "Control de Peso",
      "Consulta General",
      "Vacunación",
    ];

    cats.forEach((cat, idx) => {
      const catId = cat.id || cat._id || `cat-${idx}`;
      const nombre = catNames[idx % catNames.length];
      const raza = catBreedsList[idx % catBreedsList.length];
      const propietario = catOwners[idx % catOwners.length];
      const edad = catAges[idx % catAges.length];
      const estado = catStatuses[idx % catStatuses.length];
      const imagen = `https://cataas.com/cat/${catId}`;

      list.push({
        id: `cat-${catId}`,
        nombre,
        especie: "Felino",
        raza,
        propietario,
        edad,
        estado,
        imagen,
        // UI fields
        name: nombre,
        species: "Felino",
        breed: raza,
        ownerName: propietario,
        age: edad,
        gender: catGenders[idx % catGenders.length],
        status: estado,
        statusVariant:
          estado === "Al día"
            ? "success"
            : estado === "En tratamiento"
            ? "warning"
            : estado === "En seguimiento"
            ? "primary"
            : estado === "Vacuna pendiente"
            ? "secondary"
            : "ice",
        photoUrl: imagen,
        chipId: `#CHIP-${4400 + idx}-F`,
        ownerContact: catContacts[idx % catContacts.length],
        lastVisit: catVisits[idx % catVisits.length],
        lastVisitType: catVisitTypes[idx % catVisitTypes.length],
      });
    });

    return list;
  }, [dogs, cats]);

  // Filter patients based on tab, search query, species, and clinical status
  const filteredPatients = useMemo(() => {
    return realPatients.filter((patient) => {
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
  }, [realPatients, currentTab, searchQuery, speciesFilter, statusFilter]);

  const handleResetFilters = () => {
    setCurrentTab("todos");
    setSearchQuery("");
    setSpeciesFilter("all");
    setStatusFilter("all");
  };

  const isLoading = isLoadingCats && isLoadingDogs;

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

              {/* Loading Indicator or Data Table */}
              {isLoading && realPatients.length === 0 ? (
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
                />
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Patients;
