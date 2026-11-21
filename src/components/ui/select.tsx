import React, { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  prefixLabel?: string;
  topLabel?: string;
  icon?: React.ReactNode;
  ariaLabel?: string;
  className?: string;
  menuClassName?: string;
  variant?: "glass" | "pill" | "form" | "compact";
  fullWidth?: boolean;
}

interface MenuPosition {
  top: number;
  left: number;
  minWidth: number;
  openUpward: boolean;
}

export function CustomSelect({
  value,
  onChange,
  options,
  placeholder = "Seleccionar...",
  prefixLabel,
  topLabel,
  icon,
  ariaLabel,
  className = "",
  menuClassName = "",
  variant = "glass",
  fullWidth = false,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const [menuPos, setMenuPos] = useState<MenuPosition | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();

  const selectedOption = options.find((opt) => opt.value === value);

  const updatePosition = () => {
    const el = triggerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const estimatedMenuHeight = Math.min(options.length * 40 + 16, 260);
    const spaceBelow = window.innerHeight - rect.bottom;
    const openUpward = spaceBelow < estimatedMenuHeight && rect.top > estimatedMenuHeight;

    setMenuPos({
      top: openUpward ? rect.top - 6 : rect.bottom + 6,
      left: Math.min(rect.left, window.innerWidth - Math.max(rect.width, 190) - 12),
      minWidth: Math.max(rect.width, 180),
      openUpward,
    });
  };

  useEffect(() => {
    if (!isOpen) return;
    updatePosition();

    const handleReposition = () => updatePosition();
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        triggerRef.current &&
        !triggerRef.current.contains(target) &&
        menuRef.current &&
        !menuRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightedIndex((prev) => (prev + 1) % options.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightedIndex((prev) => (prev - 1 + options.length) % options.length);
      } else if (e.key === "Enter" && highlightedIndex >= 0) {
        e.preventDefault();
        const opt = options[highlightedIndex];
        if (opt) {
          onChange(opt.value);
          setIsOpen(false);
          triggerRef.current?.focus();
        }
      }
    };

    window.addEventListener("scroll", handleReposition, true);
    window.addEventListener("resize", handleReposition);
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("scroll", handleReposition, true);
      window.removeEventListener("resize", handleReposition);
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, highlightedIndex, options, onChange]);

  const toggleOpen = () => {
    if (!isOpen) {
      const currentIdx = options.findIndex((o) => o.value === value);
      setHighlightedIndex(currentIdx >= 0 ? currentIdx : 0);
      updatePosition();
    }
    setIsOpen((prev) => !prev);
  };

  const variantClasses: Record<NonNullable<CustomSelectProps["variant"]>, string> = {
    glass:
      "px-3 py-2 rounded-xl bg-surface-container-lowest/90 backdrop-blur-md border border-white/80 shadow-xs hover:border-primary/40 hover:bg-surface-container-lowest text-xs",
    pill:
      "px-3 py-1.5 rounded-xl bg-surface-container-low/90 hover:bg-surface-container-high/80 border border-white/70 shadow-[0_1px_2px_rgba(2,69,148,0.05)] hover:border-primary/30 text-xs",
    form:
      "px-3.5 py-2.5 rounded-xl bg-surface-container-lowest border border-slate-200/80 hover:border-primary/40 shadow-xs text-sm",
    compact:
      "px-2.5 py-1 rounded-lg bg-surface-container-lowest border border-slate-200/70 hover:border-primary/40 shadow-xs text-xs",
  };

  return (
    <div className={`relative ${fullWidth ? "w-full" : "inline-block"}`}>
      <button
        ref={triggerRef}
        type="button"
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={listboxId}
        aria-label={ariaLabel || topLabel || prefixLabel || placeholder}
        onClick={toggleOpen}
        className={`group flex items-center justify-between gap-2 text-left text-on-surface transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/25 ${
          variantClasses[variant]
        } ${isOpen ? "ring-2 ring-primary/20 border-primary/40 bg-surface-container-lowest" : ""} ${
          fullWidth ? "w-full" : ""
        } ${className}`}
      >
        <span className="flex items-center gap-2 min-w-0">
          {icon && (
            <span className="shrink-0 flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
              {icon}
            </span>
          )}
          {topLabel ? (
            <span className="flex flex-col text-left leading-tight min-w-0">
              <span className="text-[10px] font-bold text-outline uppercase tracking-wider">
                {topLabel}
              </span>
              <span className="font-semibold text-on-surface truncate">
                {selectedOption ? selectedOption.label : placeholder}
              </span>
            </span>
          ) : (
            <span className="flex items-center gap-1.5 min-w-0 truncate">
              {prefixLabel && (
                <span className="text-on-surface-variant font-medium shrink-0">
                  {prefixLabel}
                </span>
              )}
              <span className="font-semibold text-on-surface truncate">
                {selectedOption ? selectedOption.label : placeholder}
              </span>
            </span>
          )}
        </span>

        <ChevronDown
          className={`w-3.5 h-3.5 text-on-surface-variant group-hover:text-primary shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-primary" : ""
          }`}
        />
      </button>

      {isOpen &&
        menuPos &&
        createPortal(
          <div
            ref={menuRef}
            id={listboxId}
            role="listbox"
            style={{
              position: "fixed",
              top: menuPos.top,
              left: menuPos.left,
              minWidth: menuPos.minWidth,
              transform: menuPos.openUpward ? "translateY(-100%)" : undefined,
              zIndex: 9999,
            }}
            className={`max-h-64 overflow-y-auto rounded-2xl bg-white/95 backdrop-blur-2xl border border-white/90 shadow-[0_20px_50px_-12px_rgba(44,94,173,0.26)] ring-1 ring-primary/10 p-1.5 animate-in fade-in duration-150 ${menuClassName}`}
          >
            {options.map((opt, idx) => {
              const isSelected = opt.value === value;
              const isHighlighted = idx === highlightedIndex;
              return (
                <button
                  key={opt.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onMouseEnter={() => setHighlightedIndex(idx)}
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                    triggerRef.current?.focus();
                  }}
                  className={`w-full flex items-center justify-between gap-2.5 px-3 py-2 rounded-xl text-left text-xs transition-all cursor-pointer ${
                    isSelected
                      ? "bg-primary/10 text-primary font-semibold"
                      : isHighlighted
                        ? "bg-surface-container-low text-on-surface font-medium"
                        : "text-on-surface-variant hover:bg-surface-container-low/80 hover:text-on-surface font-medium"
                  }`}
                >
                  <span className="flex flex-col min-w-0">
                    <span className="truncate">{opt.label}</span>
                    {opt.description && (
                      <span className="text-[10px] text-outline truncate">
                        {opt.description}
                      </span>
                    )}
                  </span>
                  {isSelected && (
                    <span className="w-4 h-4 rounded-full bg-primary/15 text-primary flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>,
          document.body
        )}
    </div>
  );
}
