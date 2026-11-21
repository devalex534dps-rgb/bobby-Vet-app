import React from "react";
import {
  QrCode,
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  AlertCircle,
  CreditCard,
  TrendingUp,
} from "lucide-react";
import type { Patient } from "@/components/patients/types";

interface PatientProfileHeroProps {
  patient: Patient;
}

export const PatientProfileHero: React.FC<PatientProfileHeroProps> = ({ patient }) => {
  // Extract initials for guardian avatar
  const ownerInitials = (patient.propietario || patient.ownerName || "SJ")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const isCanine = (patient.especie || patient.species) === "Canino";
  const coatColor = isCanine ? "Dorado Claro" : "Gris Atigrado";
  const coatType = isCanine ? "Pelo denso largo" : "Corto brillante";
  const chipNum = patient.chipId ? patient.chipId.replace(/[^0-9]/g, "") || "98200000491" : "98200000491";
  const cleanPhone = (patient.ownerContact || "+52 951 345 678").replace(/\s+/g, "");

  return (
    <section className="mt-4 w-full rounded-2xl bg-glass-fill backdrop-blur-xl border border-white/80 shadow-sm p-6 flex flex-col xl:flex-row gap-6 justify-between items-stretch">
      {/* Left: Patient Identification & Vital Matrix */}
      <div className="flex flex-col sm:flex-row gap-6 flex-1 min-w-0">
        {/* Patient Portrait with Status Badge */}
        <div className="relative shrink-0 self-start">
          <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-2xl overflow-hidden shadow-md bg-surface-container-high relative border-2 border-white/90">
            <img
              className="w-full h-full object-cover"
              src={patient.imagen || patient.photoUrl}
              alt={patient.nombre || patient.name}
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                img.src = isCanine
                  ? "https://images.dog.ceo/breeds/retriever-golden/n02099601_4651.jpg"
                  : "https://cataas.com/cat";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
          </div>
          <div className="absolute -bottom-2 -right-2 px-2.5 py-1 rounded-md bg-surface-container-lowest shadow-md border border-slate-200/60 flex items-center gap-1">
            <QrCode className="w-3.5 h-3.5 text-primary" />
            <span className="text-[10px] font-bold text-primary tracking-wider uppercase">
              VERIFICADO
            </span>
          </div>
        </div>

        {/* Bio & Technical Specs Grid */}
        <div className="flex flex-col justify-between flex-1 min-w-0">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight leading-none">
                {patient.nombre || patient.name}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant text-[11px] font-bold tracking-wide">
                {(patient.especie || patient.species).toUpperCase()}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-surface-container-low text-on-surface-variant text-[11px] font-mono font-medium">
                PASAPORTE ES-08-99213
              </span>
            </div>
            <p className="text-sm text-on-surface-variant mt-1.5 font-medium">
              {patient.raza || patient.breed} • {patient.gender || "Hembra Esterilizada"}
            </p>
          </div>

          {/* Vital Specs Pills Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 pt-1">
            <div className="p-3 rounded-xl bg-surface-container-lowest/90 backdrop-blur-md border border-white/70 shadow-xs">
              <span className="text-[10px] text-on-surface-variant block uppercase tracking-wider font-semibold">
                Edad
              </span>
              <span className="text-base text-on-surface font-bold block mt-0.5">
                {patient.edad || patient.age}
              </span>
              <span className="text-[11px] text-on-surface-variant block">
                14 Ago 2022
              </span>
            </div>

            <div className="p-3 rounded-xl bg-surface-container-lowest/90 backdrop-blur-md border border-white/70 shadow-xs">
              <span className="text-[10px] text-on-surface-variant block uppercase tracking-wider font-semibold">
                Peso Actual
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-base text-on-surface font-bold">28.4</span>
                <span className="text-xs text-on-surface-variant font-medium">kg</span>
              </div>
              <span className="inline-flex items-center text-[10px] text-status-success font-semibold">
                <TrendingUp className="w-3 h-3 mr-0.5 inline" /> +0.3 kg
              </span>
            </div>

            <div className="p-3 rounded-xl bg-surface-container-lowest/90 backdrop-blur-md border border-white/70 shadow-xs">
              <span className="text-[10px] text-on-surface-variant block uppercase tracking-wider font-semibold">
                Manto / Color
              </span>
              <span className="text-xs text-on-surface font-bold block mt-1 truncate">
                {coatColor}
              </span>
              <span className="text-[11px] text-on-surface-variant block truncate">
                {coatType}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-surface-container-lowest/90 backdrop-blur-md border border-white/70 shadow-xs">
              <span className="text-[10px] text-on-surface-variant block uppercase tracking-wider font-semibold">
                Microchip
              </span>
              <span className="text-xs text-on-surface font-mono font-bold block mt-1 truncate">
                {chipNum}
              </span>
              <span className="text-[11px] text-on-surface-variant block">
                REIAC Activo
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Primary Guardian / Owner Nested Glass Card */}
      <div className="xl:w-[410px] shrink-0 p-4 rounded-xl bg-surface-container-lowest/90 backdrop-blur-md border border-white/80 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-primary font-bold text-sm shadow-xs border border-white">
              {ownerInitials}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">
                Tutor Responsable
              </span>
              <h2 className="text-sm font-bold text-on-surface truncate">
                {patient.propietario || patient.ownerName}
              </h2>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-surface-container-low text-on-surface-variant text-[10px] font-mono font-semibold">
            DNI 47281904-K
          </span>
        </div>

        {/* Contact Items */}
        <div className="space-y-2 py-2 text-xs">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-on-surface truncate">
              <Phone className="w-4 h-4 text-secondary shrink-0" />
              <span className="truncate font-semibold">
                {patient.ownerContact || "+52 951 345 678"}
              </span>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <a
                className="p-1 rounded bg-surface-container-low hover:bg-surface-container text-on-surface transition-colors cursor-pointer"
                href={`tel:${cleanPhone}`}
                title="Llamar"
              >
                <Phone className="w-3.5 h-3.5" />
              </a>
              <a
                className="p-1 rounded bg-status-success/15 hover:bg-status-success/25 text-status-success transition-colors cursor-pointer"
                href={`https://wa.me/${cleanPhone.replace("+", "")}`}
                target="_blank"
                rel="noreferrer"
                title="WhatsApp"
              >
                <MessageCircle className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div className="flex items-center gap-2 text-on-surface-variant truncate">
            <Mail className="w-4 h-4 text-secondary shrink-0" />
            <a
              href={`mailto:${(patient.propietario || "sarah").toLowerCase().replace(/\s+/g, ".")}@gmail.com`}
              className="truncate hover:text-primary transition-colors"
            >
              {(patient.propietario || "sarah").toLowerCase().replace(/\s+/g, ".")}@gmail.com
            </a>
          </div>

          <div className="flex items-center gap-2 text-on-surface-variant truncate">
            <MapPin className="w-4 h-4 text-secondary shrink-0" />
            <span className="truncate">Av. Diagonal 440, 3º 2ª, Barcelona</span>
          </div>

          <div className="flex items-center gap-2 text-on-surface-variant pt-1 text-[11px] border-t border-slate-100">
            <AlertCircle className="w-3.5 h-3.5 text-status-warning shrink-0" />
            <span className="truncate">
              <strong className="font-semibold text-on-surface">Emergencia:</strong> David Jenkins (Pareja) • +34 699 112 233
            </span>
          </div>
        </div>

        {/* Saved Payment Status */}
        <div className="pt-2 flex items-center justify-between text-[11px] bg-surface-container-low/70 px-3 py-1.5 rounded-lg border border-white/60">
          <div className="flex items-center gap-1.5 text-on-surface-variant">
            <CreditCard className="w-4 h-4 text-primary" />
            <span className="font-mono font-medium">Visa •••• 4242</span>
          </div>
          <span className="inline-flex items-center gap-1 text-status-success font-semibold text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-status-success" />
            Facturación al día
          </span>
        </div>
      </div>
    </section>
  );
};

export default PatientProfileHero;
