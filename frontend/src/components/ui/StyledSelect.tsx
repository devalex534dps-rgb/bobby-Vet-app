import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
}

interface StyledSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  icon?: React.ReactNode;
  className?: string;
  buttonClassName?: string;
}

export const StyledSelect: React.FC<StyledSelectProps> = ({
  value,
  onChange,
  options,
  placeholder = "Seleccionar...",
  icon,
  className,
  buttonClassName,
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "w-full flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200/90 bg-white/90 hover:bg-white text-left text-xs sm:text-sm font-semibold text-on-surface shadow-xs transition-all focus:outline-none focus:ring-2 focus:ring-primary/25 cursor-pointer",
          open && "ring-2 ring-primary/25 border-primary/50 bg-white",
          buttonClassName
        )}
      >
        <span className="flex items-center gap-2 min-w-0 truncate">
          {icon && <span className="text-primary shrink-0">{icon}</span>}
          <span className={cn("truncate", !selected && "text-slate-400 font-normal")}>
            {selected ? selected.label : placeholder}
          </span>
        </span>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-on-surface-variant shrink-0 transition-transform duration-200",
            open && "rotate-180 text-primary"
          )}
        />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute left-0 right-0 mt-1.5 z-50 min-w-[180px] max-h-60 overflow-y-auto rounded-2xl bg-white/95 backdrop-blur-xl border border-slate-200/80 shadow-xl shadow-[#024594]/10 p-1.5 space-y-0.5"
        >
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={cn(
                  "w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm text-left transition-colors cursor-pointer",
                  isSelected
                    ? "bg-gradient-to-r from-[#024594] to-[#1591dc] text-white font-bold shadow-xs"
                    : "text-on-surface hover:bg-[#e0effe]/70 hover:text-[#024594] font-medium"
                )}
              >
                <span className="truncate">{opt.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StyledSelect;
