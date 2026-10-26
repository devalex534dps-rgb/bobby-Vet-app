import { useState, useEffect, useMemo, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCats } from "@/hooks/useCats";
import { useDogs } from "@/hooks/useDogs";
import type { Patient, PatientStatus, PatientSpecies } from "@/components/patients/types";

const STORAGE_KEY = "bobby_vet_patients_v1";

export const getStatusVariant = (
  estado: string
): "success" | "warning" | "primary" | "secondary" | "ice" => {
  switch (estado) {
    case "Al día":
      return "success";
    case "En tratamiento":
      return "warning";
    case "En seguimiento":
      return "primary";
    case "Vacuna pendiente":
      return "secondary";
    default:
      return "ice";
  }
};

export const usePatientsData = () => {
  const queryClient = useQueryClient();
  const [isClientReady, setIsClientReady] = useState(false);

  // Source queries for initial dog and cat media/breeds
  const { cats, isLoading: isLoadingCats } = useCats(6);
  const { dogs, isLoading: isLoadingDogs } = useDogs([
    "retriever",
    "germanshepherd",
    "bulldog",
    "poodle",
    "husky",
    "beagle",
  ]);

  // Construct base default patients from real APIs
  const baseApiPatients = useMemo<Patient[]>(() => {
    const list: Patient[] = [];

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
        name: nombre,
        species: "Canino",
        breed: raza,
        ownerName: propietario,
        age: edad,
        gender: dogGenders[idx % dogGenders.length],
        status: estado,
        statusVariant: getStatusVariant(estado),
        photoUrl: imagen,
        chipId: `#CHIP-${8200 + idx}-P`,
        ownerContact: dogContacts[idx % dogContacts.length],
        lastVisit: dogVisits[idx % dogVisits.length],
        lastVisitType: dogVisitTypes[idx % dogVisitTypes.length],
      });
    });

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
        name: nombre,
        species: "Felino",
        breed: raza,
        ownerName: propietario,
        age: edad,
        gender: catGenders[idx % catGenders.length],
        status: estado,
        statusVariant: getStatusVariant(estado),
        photoUrl: imagen,
        chipId: `#CHIP-${4400 + idx}-F`,
        ownerContact: catContacts[idx % catContacts.length],
        lastVisit: catVisits[idx % catVisits.length],
        lastVisitType: catVisitTypes[idx % catVisitTypes.length],
      });
    });

    return list;
  }, [dogs, cats]);

  // TanStack Query for unified reactive patient storage
  const { data: storedPatients = [], isLoading: isLoadingStored } = useQuery<Patient[]>({
    queryKey: ["patients-list"],
    queryFn: () => {
      try {
        const local = localStorage.getItem(STORAGE_KEY);
        if (local) {
          const parsed = JSON.parse(local);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      } catch (err) {
        console.warn("Error reading patients from localStorage:", err);
      }
      return [];
    },
    staleTime: Infinity,
  });

  // Once baseApiPatients are ready, if storedPatients is empty, initialize cache & localStorage
  useEffect(() => {
    setIsClientReady(true);
    if (baseApiPatients.length > 0) {
      const current = queryClient.getQueryData<Patient[]>(["patients-list"]);
      if (!current || current.length === 0) {
        try {
          const local = localStorage.getItem(STORAGE_KEY);
          if (local) {
            const parsed = JSON.parse(local);
            if (Array.isArray(parsed) && parsed.length > 0) {
              queryClient.setQueryData(["patients-list"], parsed);
              return;
            }
          }
        } catch {
          // ignore
        }
        queryClient.setQueryData(["patients-list"], baseApiPatients);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(baseApiPatients));
        } catch (e) {
          console.warn("Failed to persist patients in localStorage", e);
        }
      }
    }
  }, [baseApiPatients, queryClient]);

  const patients = useMemo(() => {
    if (storedPatients.length > 0) return storedPatients;
    return baseApiPatients;
  }, [storedPatients, baseApiPatients]);

  const persistPatients = useCallback(
    (newList: Patient[]) => {
      queryClient.setQueryData(["patients-list"], newList);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
      } catch (e) {
        console.warn("Failed to save patients to localStorage", e);
      }
    },
    [queryClient]
  );

  const getPatientById = useCallback(
    (id: string): Patient | undefined => {
      if (!id) return undefined;
      const cleanId = id.trim().toLowerCase();
      return patients.find(
        (p) =>
          p.id.toLowerCase() === cleanId ||
          p.id.toLowerCase().includes(cleanId) ||
          p.nombre.toLowerCase() === cleanId ||
          p.name.toLowerCase() === cleanId
      );
    },
    [patients]
  );

  const createPatient = useCallback(
    (data: Partial<Patient>): Patient => {
      const id = `patient-${Date.now()}`;
      const especie = (data.especie || data.species || "Canino") as PatientSpecies;
      const nombre = data.nombre || data.name || "Nuevo Paciente";
      const raza = data.raza || data.breed || "Mestizo";
      const propietario = data.propietario || data.ownerName || "Propietario";
      const edad = data.edad || data.age || "1 año";
      const estado = (data.estado || data.status || "Al día") as PatientStatus;
      
      const defaultImg =
        especie === "Canino"
          ? "https://images.dog.ceo/breeds/retriever-golden/n02099601_4651.jpg"
          : "https://cataas.com/cat";
      const imagen = data.imagen || data.photoUrl || defaultImg;

      const newPatient: Patient = {
        id,
        nombre,
        especie,
        raza,
        propietario,
        edad,
        estado,
        imagen,
        name: nombre,
        species: especie,
        breed: raza,
        ownerName: propietario,
        age: edad,
        gender: data.gender || "Hembra",
        status: estado,
        statusVariant: getStatusVariant(estado),
        photoUrl: imagen,
        chipId: data.chipId || `#CHIP-${Math.floor(1000 + Math.random() * 9000)}-${especie === "Canino" ? "P" : "F"}`,
        ownerContact: data.ownerContact || "+34 600 123 456",
        lastVisit: "Hoy",
        lastVisitType: "Alta en clínica",
      };

      const updated = [newPatient, ...patients];
      persistPatients(updated);
      return newPatient;
    },
    [patients, persistPatients]
  );

  const updatePatient = useCallback(
    (id: string, updates: Partial<Patient>): Patient | undefined => {
      let updatedPatient: Patient | undefined;
      const updatedList = patients.map((item) => {
        if (item.id === id || item.id.toLowerCase() === id.toLowerCase()) {
          const especie = (updates.especie || updates.species || item.especie) as PatientSpecies;
          const estado = (updates.estado || updates.status || item.estado) as PatientStatus;
          const nombre = updates.nombre || updates.name || item.nombre;
          const raza = updates.raza || updates.breed || item.raza;
          const propietario = updates.propietario || updates.ownerName || item.propietario;
          const edad = updates.edad || updates.age || item.edad;
          const imagen = updates.imagen || updates.photoUrl || item.imagen;

          updatedPatient = {
            ...item,
            ...updates,
            id: item.id, // preserve id
            nombre,
            name: nombre,
            especie,
            species: especie,
            raza,
            breed: raza,
            propietario,
            ownerName: propietario,
            edad,
            age: edad,
            estado,
            status: estado,
            statusVariant: getStatusVariant(estado),
            imagen,
            photoUrl: imagen,
          };
          return updatedPatient;
        }
        return item;
      });

      if (updatedPatient) {
        persistPatients(updatedList);
      }
      return updatedPatient;
    },
    [patients, persistPatients]
  );

  const deletePatient = useCallback(
    (id: string): boolean => {
      const exists = patients.some(
        (p) => p.id === id || p.id.toLowerCase() === id.toLowerCase()
      );
      if (!exists) return false;

      const updatedList = patients.filter(
        (p) => p.id !== id && p.id.toLowerCase() !== id.toLowerCase()
      );
      persistPatients(updatedList);
      return true;
    },
    [patients, persistPatients]
  );

  return {
    patients,
    isLoading: (!isClientReady && isLoadingStored) || (isLoadingCats && isLoadingDogs && patients.length === 0),
    getPatientById,
    createPatient,
    updatePatient,
    deletePatient,
  };
};

export default usePatientsData;
