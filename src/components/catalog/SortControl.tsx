"use client";

import { useState, useRef, useEffect } from "react";

export type SortOption = "default" | "price-asc" | "price-desc";

interface SortControlProps {
  sortOption: SortOption;
  onSortChange: (option: SortOption) => void;
}

const OPTIONS: { value: SortOption; label: string }[] = [
  { value: "default", label: "ברירת מחדל" },
  { value: "price-desc", label: "מחיר: מהגבוה לנמוך" },
  { value: "price-asc", label: "מחיר: מהנמוך לגבוה" },
];

export default function SortControl({ sortOption, onSortChange }: SortControlProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const currentLabel = OPTIONS.find((o) => o.value === sortOption)?.label;

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div className="mb-4 flex justify-start" ref={ref}>
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="inline-flex items-center gap-1 rounded-full bg-sand px-3 py-1.5 text-sm font-bold text-charcoal transition-all duration-200 hover:bg-sand-dark active:scale-[0.97]"
          aria-label={`מיון: ${currentLabel}`}
          aria-expanded={open}
          aria-haspopup="true"
        >
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
          </svg>
          {currentLabel}
          <svg className={`h-2.5 w-2.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {open && (
          <div className="absolute top-full right-0 mt-1.5 w-48 rounded-lg bg-white shadow-lg ring-1 ring-charcoal/10 overflow-hidden z-30 animate-popover-in origin-top-right">
            {OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onSortChange(option.value);
                  setOpen(false);
                }}
                className={`flex w-full items-center px-3 py-2.5 text-sm transition-colors hover:bg-sand/60 ${
                  sortOption === option.value
                    ? "text-terracotta font-bold"
                    : "text-charcoal"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
