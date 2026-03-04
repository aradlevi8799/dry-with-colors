"use client";

import { useEffect, useRef, useState } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    clearTimeout(timeoutRef.current);

    if (isOpen) {
      setMounted(true);
      timeoutRef.current = setTimeout(() => setVisible(true), 20);
      document.body.style.overflow = "hidden";
    } else {
      setVisible(false);
      timeoutRef.current = setTimeout(() => setMounted(false), 300);
      document.body.style.overflow = "";
    }

    return () => clearTimeout(timeoutRef.current);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCloseRef.current();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen]);

  if (!mounted) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-charcoal/50 backdrop-blur-sm transition-opacity duration-300 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Content */}
      <div
        className={`relative z-10 max-h-[95vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl bg-white shadow-2xl transition-all duration-300 ease-out ${
          visible
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 translate-y-8"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="h-1 w-10 rounded-full bg-taupe/30" />
        </div>
        <button
          onClick={onClose}
          className="absolute top-3 left-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-charcoal-light shadow-sm transition-all duration-200 hover:bg-gray-100 hover:text-charcoal"
          aria-label="סגור"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        {children}
      </div>
    </div>
  );
}
