"use client";

import { useEffect, useRef, useState, useCallback } from "react";

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
  const contentRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  onCloseRef.current = onClose;

  useEffect(() => {
    clearTimeout(timeoutRef.current);

    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      setMounted(true);
      timeoutRef.current = setTimeout(() => setVisible(true), 20);
      document.body.style.overflow = "hidden";
    } else {
      setVisible(false);
      timeoutRef.current = setTimeout(() => {
        setMounted(false);
        previousFocusRef.current?.focus();
      }, 300);
      document.body.style.overflow = "";
    }

    return () => clearTimeout(timeoutRef.current);
  }, [isOpen]);

  // Focus the close button when modal opens
  useEffect(() => {
    if (!visible || !contentRef.current) return;
    const closeBtn = contentRef.current.querySelector<HTMLElement>("button[aria-label]");
    closeBtn?.focus();
  }, [visible]);

  // Focus trap
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onCloseRef.current();
      return;
    }
    if (e.key !== "Tab" || !contentRef.current) return;

    const focusable = contentRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }, []);

  if (!mounted) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      onKeyDown={handleKeyDown}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-charcoal/50 backdrop-blur-sm transition-opacity duration-300 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden="true"
      />

      {/* Content */}
      <div
        ref={contentRef}
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
          className="absolute top-3 left-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-charcoal-light shadow-sm transition-all duration-200 hover:bg-gray-100 hover:text-charcoal focus-visible:ring-2 focus-visible:ring-terracotta/50"
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
