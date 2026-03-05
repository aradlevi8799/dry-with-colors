"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  ariaLabel?: string;
}

const DISMISS_THRESHOLD = 100;

export default function Modal({ isOpen, onClose, children, ariaLabel }: ModalProps) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const onCloseRef = useRef(onClose);
  const contentRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Swipe refs (no React state — direct DOM for 60fps)
  const touchStartY = useRef(0);
  const currentDragY = useRef(0);
  const isDragging = useRef(false);
  const wasAtTop = useRef(false);

  onCloseRef.current = onClose;

  useEffect(() => {
    clearTimeout(timeoutRef.current);

    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      setMounted(true);
      timeoutRef.current = setTimeout(() => setVisible(true), 20);
      document.body.style.overflow = "hidden";
      contentRef.current?.scrollTo(0, 0);
    } else {
      setVisible(false);
      // Reset drag transform on close
      if (contentRef.current) {
        contentRef.current.style.transform = "";
        contentRef.current.style.opacity = "";
      }
      timeoutRef.current = setTimeout(() => {
        setMounted(false);
        previousFocusRef.current?.focus();
      }, 300);
      document.body.style.overflow = "";
    }

    return () => {
      clearTimeout(timeoutRef.current);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Focus the close button when modal opens
  useEffect(() => {
    if (!visible || !contentRef.current) return;
    contentRef.current.scrollTo(0, 0);
    const closeBtn = contentRef.current.querySelector<HTMLElement>("button[aria-label]");
    closeBtn?.focus();
  }, [visible]);

  // Swipe-to-dismiss via native touch events (bypasses React for performance)
  useEffect(() => {
    const el = contentRef.current;
    if (!el || !visible) return;

    function onTouchStart(e: TouchEvent) {
      if (!el) return;
      wasAtTop.current = el.scrollTop <= 0;
      if (!wasAtTop.current) return;
      touchStartY.current = e.touches[0].clientY;
      currentDragY.current = 0;
      isDragging.current = false;
    }

    function onTouchMove(e: TouchEvent) {
      if (!wasAtTop.current || !el) return;
      const delta = e.touches[0].clientY - touchStartY.current;

      // Only start dragging downward
      if (!isDragging.current) {
        if (delta < 5) return; // not enough movement or moving up
        isDragging.current = true;
        el.style.transition = "none";
      }

      if (isDragging.current) {
        // Resist upward dragging, allow downward with slight resistance
        const dampened = Math.max(0, delta * 0.8);
        currentDragY.current = dampened;
        el.style.transform = `translateY(${dampened}px)`;
        el.style.opacity = `${Math.max(0.3, 1 - dampened / 500)}`;

        if (backdropRef.current) {
          backdropRef.current.style.opacity = `${Math.max(0.1, 1 - dampened / 400)}`;
        }

        // Prevent scroll while dragging
        e.preventDefault();
      }
    }

    function onTouchEnd() {
      if (!isDragging.current || !el) return;
      isDragging.current = false;
      wasAtTop.current = false;

      if (currentDragY.current > DISMISS_THRESHOLD) {
        // Dismiss: animate out
        el.style.transition = "transform 0.25s ease-out, opacity 0.25s ease-out";
        el.style.transform = "translateY(100%)";
        el.style.opacity = "0";
        if (backdropRef.current) {
          backdropRef.current.style.transition = "opacity 0.25s ease-out";
          backdropRef.current.style.opacity = "0";
        }
        setTimeout(() => onCloseRef.current(), 250);
      } else {
        // Snap back
        el.style.transition = "transform 0.3s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s ease-out";
        el.style.transform = "translateY(0)";
        el.style.opacity = "1";
        if (backdropRef.current) {
          backdropRef.current.style.transition = "opacity 0.3s ease-out";
          backdropRef.current.style.opacity = "1";
        }
      }

      currentDragY.current = 0;
    }

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
    };
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
      aria-label={ariaLabel}
      onKeyDown={handleKeyDown}
    >
      {/* Backdrop */}
      <div
        ref={backdropRef}
        className={`absolute inset-0 bg-charcoal/50 backdrop-blur-sm transition-opacity duration-300 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden="true"
      />

      {/* Content */}
      <div
        ref={contentRef}
        className={`relative z-10 max-h-[95vh] w-full max-w-2xl overflow-y-auto overscroll-contain rounded-t-2xl bg-white shadow-2xl transition-all duration-300 ease-out ${
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
          className="absolute top-2 left-2 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-charcoal-light shadow-sm transition-all duration-200 hover:bg-sand hover:text-charcoal focus-visible:ring-2 focus-visible:ring-terracotta/50"
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
