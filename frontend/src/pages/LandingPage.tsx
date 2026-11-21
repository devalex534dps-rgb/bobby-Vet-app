import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  PawPrint,
  Search,
  Calendar,
  Clock,
  Stethoscope,
  Loader2,
  AlertCircle,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { bobbyApi, type BackendFolioLookupDto } from "@/services/bobbyApi";
import { useUsers } from "@/hooks/useUsers";
import { confirmLogoutAlert } from "@/lib/sweetalert";
import { DogSpinnerLoader } from "@/components/ui/DogSpinnerLoader";

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { isAuthenticated, currentUser, logout } = useUsers();

  const [folio, setFolio] = useState("");
  const [folioError, setFolioError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [result, setResult] = useState<BackendFolioLookupDto | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number | null = null;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });

    interface Point {
      x: number;
      y: number;
      vx: number;
      vy: number;
      age: number;
      maxLife: number;
      radius: number;
    }

    const points: Point[] = [];
    const MAX_POINTS = 36;
    const mousePos = { x: width * 0.5, y: height * 0.45, active: false };
    const lastPos = { x: mousePos.x, y: mousePos.y };

    const scheduleRender = () => {
      if (animationFrameId === null) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      mousePos.x = e.clientX;
      mousePos.y = e.clientY;
      mousePos.active = true;

      const dx = mousePos.x - lastPos.x;
      const dy = mousePos.y - lastPos.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > 3) {
        points.push({
          x: mousePos.x,
          y: mousePos.y,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.8,
          age: 0,
          maxLife: 38 + Math.random() * 14,
          radius: Math.min(22, 10 + dist * 0.22),
        });
        lastPos.x = mousePos.x;
        lastPos.y = mousePos.y;
      }

      if (points.length > MAX_POINTS) {
        points.shift();
      }
      scheduleRender();
    };

    const handlePointerLeave = () => {
      mousePos.active = false;
    };

    const render = () => {
      animationFrameId = null;
      ctx.clearRect(0, 0, width, height);

      if (points.length > 1) {
        ctx.save();
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        for (let i = 0; i < points.length - 1; i++) {
          const p1 = points[i];
          const p2 = points[i + 1];
          const ratio = i / points.length;
          const lifeRatio = 1 - p1.age / p1.maxLife;
          if (lifeRatio <= 0) continue;

          const alpha = Math.max(0, lifeRatio * 0.22 * ratio);
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          const midX = (p1.x + p2.x) / 2;
          const midY = (p1.y + p2.y) / 2;
          ctx.quadraticCurveTo(p1.x, p1.y, midX, midY);

          ctx.strokeStyle = `rgba(28, 59, 111, ${alpha.toFixed(3)})`;
          ctx.lineWidth = p1.radius * ratio * 1.5;
          ctx.shadowColor = "rgba(44, 94, 173, 0.35)";
          ctx.shadowBlur = 18;
          ctx.stroke();
        }
        ctx.restore();

        for (let i = 0; i < points.length; i++) {
          const p = points[i];
          p.age += 1;
          p.x += p.vx;
          p.y += p.vy;

          const lifeRatio = 1 - p.age / p.maxLife;
          if (lifeRatio <= 0) continue;

          const currentRadius = p.radius * (0.6 + 0.4 * lifeRatio);
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, currentRadius * 1.8);
          grad.addColorStop(0, `rgba(28, 59, 111, ${(0.18 * lifeRatio).toFixed(3)})`);
          grad.addColorStop(0.45, `rgba(44, 94, 173, ${(0.1 * lifeRatio).toFixed(3)})`);
          grad.addColorStop(1, "rgba(44, 94, 173, 0)");

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, currentRadius * 1.8, 0, Math.PI * 2);
          ctx.fill();
        }

        for (let i = points.length - 1; i >= 0; i--) {
          if (points[i].age >= points[i].maxLife) {
            points.splice(i, 1);
          }
        }
      }

      if (mousePos.active) {
        const leaderGlow = ctx.createRadialGradient(mousePos.x, mousePos.y, 0, mousePos.x, mousePos.y, 32);
        leaderGlow.addColorStop(0, "rgba(28, 59, 111, 0.15)");
        leaderGlow.addColorStop(0.5, "rgba(44, 94, 173, 0.08)");
        leaderGlow.addColorStop(1, "rgba(44, 94, 173, 0)");
        ctx.fillStyle = leaderGlow;
        ctx.beginPath();
        ctx.arc(mousePos.x, mousePos.y, 32, 0, Math.PI * 2);
        ctx.fill();
      }

      if (points.length > 0 || mousePos.active) {
        scheduleRender();
      }
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      if (animationFrameId !== null) cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, []);

  const validateFolio = (val: string): string | null => {
    const trimmed = val.trim();
    if (!trimmed) return "Ingresa tu número de folio (ej. BOB-2026-001).";
    if (trimmed.length < 5) return "El folio debe tener al menos 5 caracteres.";
    return null;
  };

  const handleLookup = async (e: React.FormEvent, overrideFolio?: string) => {
    e.preventDefault();
    const target = overrideFolio ?? folio;
    const err = validateFolio(target);
    setFolioError(err);
    setServerError(null);
    if (err) return;

    setLoading(true);
    setResult(null);
    try {
      const [data] = await Promise.all([
        bobbyApi.lookupByFolio(target),
        new Promise((resolve) => setTimeout(resolve, 5000)),
      ]);
      setResult(data);
    } catch (ex) {
      setResult(null);
      setServerError(
        ex instanceof Error ? ex.message : "No se encontró información para ese folio."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    const confirmed = await confirmLogoutAlert();
    if (confirmed) {
      await logout();
      navigate("/portal");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fbff] text-slate-800 font-sans antialiased flex flex-col justify-between relative overflow-x-hidden">
      {/* Interactive Canvas Mouse Trail Background */}
      <canvas
        className="pointer-events-none fixed inset-0 z-0"
        id="cursor-trail-canvas"
        ref={canvasRef}
      />

      {/* Ambient Background Blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-tr from-[#bae0fd]/50 via-[#c4e2f5]/40 to-transparent hero-glow-blob" />
        <div
          className="absolute top-[35%] left-[25%] w-[40vw] h-[40vw] rounded-full bg-gradient-to-br from-[#7cc5fb]/30 via-[#e0effe]/40 to-transparent hero-glow-blob"
          style={{ animationDelay: "-3s" }}
        />
        <div
          className="absolute -bottom-[20%] right-[5%] w-[45vw] h-[45vw] rounded-full bg-gradient-to-tl from-[#eaf6ff] via-[#c4e2f5]/40 to-transparent hero-glow-blob"
          style={{ animationDelay: "-5s" }}
        />
        <div className="absolute inset-0 bg-grid-dots opacity-40" />
      </div>

      {/* Landing Header (sin botón visible de login para clientes) */}
      <header className="relative z-20 w-full px-6 lg:px-12 py-5 flex items-center justify-between border-b border-white/70 bg-white/50 backdrop-blur-md">
        <Link to="/portal" className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2c5ead] to-[#1591dc] flex items-center justify-center text-white shadow-sm">
            <PawPrint className="w-5 h-5" />
          </div>
          <div>
            <span className="font-display font-extrabold text-lg text-[#1c3b6f] tracking-tight block leading-none">
              Bobby VetCare
            </span>
            <span className="text-[11px] font-medium text-slate-500">
              Clínica Veterinaria
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center space-x-2 glass-pill px-3.5 py-1.5 rounded-full shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-medium text-slate-600">
              Atención Lun–Sáb • 9:00 – 19:00 hrs
            </span>
          </div>

          {isAuthenticated && (
            <div className="flex items-center gap-2">
              {currentUser.role !== "CLIENTE" && (
                <Link
                  to="/dashboard"
                  className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-[#1d4586] hover:bg-slate-50"
                >
                  Ir al Panel
                </Link>
              )}
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:text-red-600 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" /> Salir
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Landing Content */}
      <main className="relative z-10 flex-1 max-w-4xl mx-auto w-full px-6 py-12 space-y-8">
        <section className="text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#e0effe] text-[#1d4586] text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-[#2c5ead]" />
            <span>Consulta Rápida para Tutores</span>
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-[#0c1b33] tracking-tight">
            Consulta tu próxima cita e historial clínico
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
            Ingresa el folio de atención de tu mascota para verificar el día y hora de su próxima cita y revisar las consultas registradas.
          </p>
        </section>

        {/* Folio Form Card */}
        <section className="glass-card rounded-3xl p-6 sm:p-8 space-y-4">
          <form onSubmit={(e) => handleLookup(e)} className="flex flex-col sm:flex-row gap-3" noValidate>
            <div className="flex-1">
              <div
                className={`relative rounded-xl border bg-white/90 input-focus-glow transition-all ${
                  folioError ? "border-red-400" : "border-slate-200"
                }`}
              >
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={folio}
                  onChange={(e) => {
                    setFolio(e.target.value);
                    setFolioError(validateFolio(e.target.value));
                  }}
                  placeholder="Ingresa tu folio (ej. BOB-2026-001)"
                  className="w-full pl-10 pr-4 py-3 text-sm bg-transparent border-0 rounded-xl focus:outline-none text-slate-800 font-medium uppercase"
                />
              </div>
              {folioError && <p className="text-xs text-red-500 font-medium mt-1.5">{folioError}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-xl font-display font-bold text-sm text-white bg-gradient-to-r from-[#2c5ead] via-[#1d4586] to-[#1591dc] shadow-md shadow-[#2c5ead]/20 hover:opacity-95 disabled:opacity-70 flex items-center justify-center gap-2 shrink-0 self-start sm:self-stretch cursor-pointer"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span>{loading ? "Buscando..." : "Consultar Folio"}</span>
            </button>
          </form>

          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 pt-1">
            <span>Folios de ejemplo:</span>
            {["BOB-2026-001", "BOB-2026-002", "BOB-2026-003"].map((sample) => (
              <button
                key={sample}
                type="button"
                onClick={(e) => {
                  setFolio(sample);
                  handleLookup(e, sample);
                }}
                className="px-2.5 py-1 rounded-lg bg-white/80 border border-slate-200 text-[#2c5ead] font-semibold hover:bg-white cursor-pointer"
              >
                {sample}
              </button>
            ))}
          </div>

          {serverError && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{serverError}</span>
            </div>
          )}
        </section>

        {/* Dog Spinner Loader */}
        {loading && <DogSpinnerLoader />}

        {/* Folio Result */}
        {!loading && result && (
          <section className="space-y-6">
            <div className="glass-card rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#e0effe] text-[#024594] flex items-center justify-center shrink-0">
                  <PawPrint className="w-7 h-7" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#2c5ead]">
                    Folio {result.folio}
                  </span>
                  <h2 className="text-xl font-extrabold text-[#0c1b33]">
                    {result.pacienteName} ({result.species} • {result.breed})
                  </h2>
                  <p className="text-xs text-slate-500">Tutor: {result.tutorName}</p>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-3xl p-6 border-l-4 border-l-[#024594]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#2c5ead] mb-2">
                Próxima Cita Programada
              </h3>
              {result.nextAppointment ? (
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-4 text-sm font-bold text-[#0c1b33]">
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-[#2c5ead]" />
                        {result.nextAppointment.scheduledDate}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-[#2c5ead]" />
                        {result.nextAppointment.startTime.slice(0, 5)} - {result.nextAppointment.endTime.slice(0, 5)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">
                      Especialidad: <span className="capitalize font-semibold">{result.nextAppointment.specialty}</span> • Atiende: {result.nextAppointment.veterinarioName}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                    {result.nextAppointment.status}
                  </span>
                </div>
              ) : (
                <p className="text-sm text-slate-500">
                  No hay una próxima cita programada actualmente para este folio.
                </p>
              )}
            </div>

            <div className="glass-card rounded-3xl p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-[#2c5ead]" />
                <h3 className="font-display text-base font-extrabold text-[#0c1b33]">
                  Historial de Consultas
                </h3>
              </div>

              {result.consultations.length === 0 ? (
                <p className="text-sm text-slate-500 py-4 text-center">
                  Sin consultas registradas.
                </p>
              ) : (
                <div className="divide-y divide-slate-200/60">
                  {result.consultations.map((c) => (
                    <div key={c.id} className="py-4 space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-bold text-sm text-[#0c1b33]">{c.reason}</p>
                        <span className="text-xs text-slate-500">
                          {new Date(c.startedAt).toLocaleDateString()}
                        </span>
                      </div>
                      {c.diagnosis && (
                        <p className="text-xs text-slate-600">
                          <strong>Diagnóstico:</strong> {c.diagnosis}
                        </p>
                      )}
                      {c.treatment && (
                        <p className="text-xs text-slate-600">
                          <strong>Tratamiento:</strong> {c.treatment}
                        </p>
                      )}
                      {c.servicios.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {c.servicios.map((srv) => (
                            <span
                              key={srv}
                              className="px-2 py-0.5 rounded-md bg-[#e0effe] text-[#1d4586] text-[11px] font-semibold"
                            >
                              {srv}
                            </span>
                          ))}
                        </div>
                      )}
                      <p className="text-[11px] text-slate-400">
                        Atendido por {c.veterinarioName}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}
      </main>

      {/* Landing Footer con enlace discreto al login */}
      <footer className="relative z-20 w-full px-6 lg:px-12 py-4 border-t border-slate-200/60 bg-white/40 backdrop-blur-md">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <span>© 2026 Bobby VetCare • Todos los derechos reservados</span>
          <Link
            to="/login"
            className="text-[11px] text-slate-400 hover:text-slate-600 transition-colors"
          >
            Acceso personal
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
