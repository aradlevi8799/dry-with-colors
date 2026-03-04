"use client";

import { useState, useCallback, useRef } from "react";
import Image from "next/image";
import { ProductImage } from "@/types/product";

interface ImageCarouselProps {
  images: ProductImage[];
  alt: string;
}

export default function ImageCarousel({ images, alt }: ImageCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const touchStartX = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const goTo = useCallback(
    (index: number) => {
      if (transitioning || index === current) return;
      setTransitioning(true);
      setCurrent(index);
      setTimeout(() => setTransitioning(false), 400);
    },
    [transitioning, current]
  );

  const next = () => goTo((current + 1) % images.length);
  const prev = () => goTo((current - 1 + images.length) % images.length);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      // RTL: swipe left = prev, swipe right = next
      if (diff > 0) prev();
      else next();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // RTL-aware: ArrowRight = prev, ArrowLeft = next
    if (e.key === "ArrowRight") prev();
    else if (e.key === "ArrowLeft") next();
  };

  if (images.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center bg-sand text-taupe text-sm">
        אין תמונה
      </div>
    );
  }

  if (images.length === 1) {
    return (
      <div className="relative aspect-square w-full overflow-hidden bg-sand">
        <Image
          src={images[0].url}
          alt={alt}
          fill
          className="object-cover"
          sizes="100vw"
        />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative bg-sand"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label={`תמונות של ${alt}`}
      aria-roledescription="קרוסלה"
    >
      {/* Only render current and adjacent images for performance */}
      <div className="relative aspect-square w-full overflow-hidden">
        {images.map((img, i) => {
          const distance = Math.min(
            Math.abs(i - current),
            images.length - Math.abs(i - current)
          );
          // Only mount current + neighbors (for smooth crossfade)
          if (distance > 1) return null;
          return (
            <Image
              key={img.path || i}
              src={img.url}
              alt={`${alt} - תמונה ${i + 1} מתוך ${images.length}`}
              fill
              className={`object-cover transition-opacity duration-500 ${
                i === current ? "opacity-100" : "opacity-0"
              }`}
              sizes="(max-width: 640px) 100vw, 640px"
              priority={i === 0}
            />
          );
        })}
      </div>

      {/* Prev/Next buttons */}
      <button
        onClick={prev}
        className="absolute right-2 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-charcoal/40 text-white backdrop-blur-sm transition-colors hover:bg-charcoal/60 focus-visible:ring-2 focus-visible:ring-white"
        aria-label="תמונה קודמת"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
      <button
        onClick={next}
        className="absolute left-2 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-charcoal/40 text-white backdrop-blur-sm transition-colors hover:bg-charcoal/60 focus-visible:ring-2 focus-visible:ring-white"
        aria-label="תמונה הבאה"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Dots indicator — padded for touch targets */}
      <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1" role="tablist" aria-label="בחירת תמונה">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            role="tab"
            aria-selected={i === current}
            className={`flex items-center justify-center h-7 w-7 rounded-full transition-all duration-300 focus-visible:ring-2 focus-visible:ring-white`}
            aria-label={`תמונה ${i + 1} מתוך ${images.length}`}
          >
            <span
              className={`block rounded-full transition-all duration-300 ${
                i === current
                  ? "h-2 w-5 bg-white shadow-sm"
                  : "h-2 w-2 bg-white/50"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
