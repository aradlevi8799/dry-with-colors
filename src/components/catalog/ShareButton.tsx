"use client";

import { useState, useRef, useEffect } from "react";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";

interface ShareButtonProps {
  productName: string;
  productId: string;
}

export default function ShareButton({ productName, productId }: ShareButtonProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  const productUrl = typeof window !== "undefined"
    ? `${window.location.origin}?product=${productId}`
    : "";

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  function handleWhatsAppShare(e: React.MouseEvent) {
    e.stopPropagation();
    const text = encodeURIComponent(`${productName}\n${productUrl}`);
    window.open(`https://wa.me/?text=${text}`, "_blank");
    setOpen(false);
  }

  async function handleCopyLink(e: React.MouseEvent) {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(productUrl);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setOpen(false);
      }, 1500);
    } catch {
      setOpen(false);
    }
  }

  return (
    <div ref={popoverRef} className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
          setCopied(false);
        }}
        className="inline-flex items-center justify-center rounded-full bg-sand px-4 py-2 text-base font-bold text-charcoal-light transition-colors hover:bg-sand-dark hover:text-charcoal"
        aria-label="שיתוף מוצר"
        aria-expanded={open}
        aria-haspopup="true"
      >
        שתפי
      </button>

      {open && (
        <div role="menu" className="absolute bottom-full left-0 mb-2 w-48 rounded-lg bg-white shadow-lg ring-1 ring-charcoal/10 overflow-hidden z-30">
          <button
            role="menuitem"
            onClick={handleWhatsAppShare}
            className="flex w-full items-center gap-2 px-3 py-2.5 text-base font-bold text-charcoal transition-colors hover:bg-sand/60"
          >
            <WhatsAppIcon className="h-4 w-4 text-[#25D366]" />
            שתפי בוואטסאפ
          </button>
          <button
            role="menuitem"
            onClick={handleCopyLink}
            className="flex w-full items-center gap-2 px-3 py-2.5 text-base font-bold text-charcoal transition-colors hover:bg-sand/60 border-t border-sand-dark/20"
          >
            {copied ? (
              <>
                <svg className="h-4 w-4 text-[#25D366]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                הקישור הועתק!
              </>
            ) : (
              <>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                העתיקי קישור
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
