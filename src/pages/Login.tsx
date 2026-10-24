import React, { useEffect, useRef } from "react";
import { HeroSection } from "@/components/login/HeroSection";
import { LoginForm } from "@/components/login/LoginForm";

export const Login: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
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
    };

    const handlePointerLeave = () => {
      mousePos.active = false;
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerleave", handlePointerLeave);

    const render = () => {
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
          const grad = ctx.createRadialGradient(
            p.x,
            p.y,
            0,
            p.x,
            p.y,
            currentRadius * 1.8
          );

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
        const leaderGlow = ctx.createRadialGradient(
          mousePos.x,
          mousePos.y,
          0,
          mousePos.x,
          mousePos.y,
          32
        );
        leaderGlow.addColorStop(0, "rgba(28, 59, 111, 0.15)");
        leaderGlow.addColorStop(0.5, "rgba(44, 94, 173, 0.08)");
        leaderGlow.addColorStop(1, "rgba(44, 94, 173, 0)");
        ctx.fillStyle = leaderGlow;
        ctx.beginPath();
        ctx.arc(mousePos.x, mousePos.y, 32, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fbff] text-slate-800 font-sans antialiased selection:bg-[#2c5ead] selection:text-white flex flex-col justify-between relative overflow-x-hidden">
      {/* Interactive Canvas Mouse Trail Background */}
      <canvas
        className="pointer-events-none fixed inset-0 z-0"
        id="cursor-trail-canvas"
        ref={canvasRef}
      />

      {/* Fondos degradados globales con Mesh / Blobs suaves */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[25%] -left-[10%] w-[55vw] h-[55vw] rounded-full bg-gradient-to-tr from-[#bae0fd]/50 via-[#c4e2f5]/40 to-transparent hero-glow-blob" />
        <div
          className="absolute top-[35%] left-[25%] w-[40vw] h-[40vw] rounded-full bg-gradient-to-br from-[#7cc5fb]/30 via-[#e0effe]/40 to-transparent hero-glow-blob"
          style={{ animationDelay: "-3s" }}
        />
        <div
          className="absolute -bottom-[20%] right-[5%] w-[45vw] h-[45vw] rounded-full bg-gradient-to-tl from-[#eaf6ff] via-[#c4e2f5]/30 to-transparent hero-glow-blob"
          style={{ animationDelay: "-5s" }}
        />
        <div className="absolute inset-0 bg-grid-dots opacity-40" />
      </div>

      {/* Header Superior Minimalista */}
      <header className="relative z-20 w-full px-6 lg:px-12 py-5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-white/90 p-1.5 shadow-xs border border-white/80 flex items-center justify-center">
            <img
              alt="Bobby VetCare"
              className="h-full w-full object-contain"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC2vXquCCSvBHuQiE1DkmQpj4MCuqRRBvn692PCyyGycdDsPBkvgCSu8Hb2fZDTy8zBOSaP8C535f4V6Vy2ljByv0Fp-55E7yvfAZOVVAw3IbjIEkvOElENyy7cIvqlpQihg7xSWo3J2KSBoZngCo_qxi-TX1OIx3O_Xx6D6p32pq0nSNRtD8aCxXEpuEiotYISwaStWAR6ey-p2M6Mo4M5s8_KP5HObBi_JZ22a-CSUqlzAw2eXQjPvYb0xioLIn7EeA"
            />
          </div>
          <div>
            <span className="font-display font-extrabold text-lg tracking-tight text-[#1c3b6f]">
              Bobby
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-6 text-sm">
          <div className="hidden md:flex items-center space-x-2 text-slate-500 glass-pill px-3.5 py-1.5 rounded-full shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-medium text-slate-600">
              Sistemas operativos • Región MX (Oaxaca)
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <a
              className="text-xs font-medium text-slate-500 hover:text-[#2c5ead] transition-colors"
              href="#help"
            >
              ¿Necesitas ayuda?
            </a>
          </div>
        </div>
      </header>

      {/* Contenido Principal: Experiencia 2 Columnas Split Hero / Auth Card */}
      <main className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-6 lg:px-12 py-4 lg:py-8 flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center w-full">
          <HeroSection />
          <LoginForm />
        </div>
      </main>

      {/* Footer Minimalista */}
      <footer className="relative z-20 w-full px-6 lg:px-12 py-4 border-t border-slate-200/60 bg-white/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-700">
              © 2026 veterinaria Bobby.
            </span>
            <span className="text-slate-300">•</span>
            <span>Todos los derechos reservados</span>
          </div>
          <div className="flex items-center space-x-6 text-xs">
            <span className="text-slate-300">•</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
export default Login;
