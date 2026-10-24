import React, { useState } from "react";

export const HeroSection: React.FC = () => {
  const [spotlightPos, setSpotlightPos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setSpotlightPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div className="lg:col-span-7 flex flex-col justify-center relative select-none">
      <div
        className="relative flex flex-col justify-center py-4 lg:py-6 group select-none"
        id="hero-spotlight-wrapper"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseMove={handleMouseMove}
      >
        {/* Dynamic Cursor Spotlight Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-px rounded-3xl transition-opacity duration-300"
          id="cursor-spotlight"
          style={{
            background: `radial-gradient(550px circle at ${spotlightPos.x}px ${spotlightPos.y}px, rgba(44, 94, 173, 0.16), transparent 70%)`,
            opacity: isHovered ? 1 : 0,
          }}
        />

        {/* Pill Status Tag Linear Style */}
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/70 backdrop-blur-md border border-slate-200/80 text-xs font-semibold text-slate-700 mb-6 w-fit shadow-xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4bb8fa] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2c5ead]" />
          </span>
          <span className="text-[#2c5ead] font-bold tracking-tight">
            Veterinaria Bobby&nbsp;
          </span>
          <span className="text-slate-300">•</span>
        </div>

        {/* Headline Premium Minimalist */}
        <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-display font-extrabold text-slate-900 leading-[1.12] tracking-tight mb-4">
          Gestión clínica de precisión, <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#1c3b6f] via-[#2c5ead] to-[#1591dc]">
            diseñada para el futuro médico.
          </span>
        </h1>

        {/* Subtitle with generous line-height and calm tone */}
        <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-lg mb-8">
          Una suite operativa integral que centraliza historias veterinarias, analíticas y gestión en tiempo real con seguridad de grado clínico.
        </p>

        {/* Refined Hero Showcase: Layered Glassmorphism Showcase */}
        <div className="relative w-full rounded-3xl bg-gradient-to-b from-white/80 via-white/50 to-white/30 border border-white/90 shadow-[0_24px_50px_-15px_rgba(44,94,173,0.15)] backdrop-blur-xl p-8 sm:p-12 overflow-hidden flex flex-col items-center justify-center">
          {/* Ambient Soft Glow Blobs behind centerpiece */}
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-72 h-44 rounded-full bg-gradient-to-r from-[#4bb8fa]/30 via-[#2c5ead]/20 to-[#1591dc]/30 blur-3xl pointer-events-none" />
          <div className="absolute inset-0 bg-grid-dots opacity-20 pointer-events-none" />

          {/* Centerpiece: Elevated Glass Tile with Bobby Emblem */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="relative p-8 sm:p-10 rounded-3xl bg-white/90 backdrop-blur-2xl border border-white shadow-2xl shadow-[#2c5ead]/15 flex items-center justify-center transform transition duration-500 hover:scale-[1.02]">
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-[#2c5ead]/15 to-[#4bb8fa]/20 blur-md pointer-events-none" />
              <img
                alt="Bobby Clínica y Estética Veterinaria"
                className="relative z-10 w-48 sm:w-56 h-auto object-contain drop-shadow-md"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDN9vsTiCyHkCw97uYyKH--GpAQhISDq3Y8_phJmLnll9u8pX2g98X0HcbwQv6Uq8_KGIrZoJ4N6DR07slths11nBATcBBnoi2txz7r5YznzLNhRRLAmirYJwmnAVVYneiSK7DIj2Y5nhV1RYWlO7CQ7B1tHu8_qEgDZKoQIASt6RuWBXczyAIhKclAJwqJSaxiv9KA72qR3ovQ-WPRSEzEC10wkfoNgH6d2jMcJkRILfFycs_cB4l1Hu9HUWLO0CaFKQ"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
