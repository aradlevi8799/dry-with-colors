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
          sizes="(max-width: 768px) 100vw, 600px"
        />
      </div>
    );
  }

  return (
    <div
      className="relative bg-sand"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* All images stacked for crossfade */}
      <div className="relative aspect-square w-full overflow-hidden">
        {images.map((img, i) => (
          <Image
            key={i}
            src={img.url}
            alt={`${alt} - ${i + 1}`}
            fill
            className={`object-cover transition-opacity duration-500 ${
              i === current ? "opacity-100" : "opacity-0"
            }`}
            sizes="(max-width: 768px) 100vw, 600px"
            priority={i === 0}
          />
        ))}
      </div>

      {/* Navigation arrows — hidden on mobile (use swipe instead) */}
      <button
        onClick={next}
        className="absolute top-1/2 left-2 sm:left-3 -translate-y-1/2 hidden sm:flex h-10 w-10 items-center justify-center rounded-full bg-cream/80 text-charcoal backdrop-blur-sm shadow-sm transition-all duration-200 hover:bg-cream hover:shadow"
        aria-label="תמונה הבאה"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={prev}
        className="absolute top-1/2 right-2 sm:right-3 -translate-y-1/2 hidden sm:flex h-10 w-10 items-center justify-center rounded-full bg-cream/80 text-charcoal backdrop-blur-sm shadow-sm transition-all duration-200 hover:bg-cream hover:shadow"
        aria-label="תמונה קודמת"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots indicator */}
      <div className="absolute bottom-3 sm:bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5 sm:gap-2">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`rounded-full transition-all duration-300 ${
              i === current
                ? "h-1.5 w-4 sm:h-2 sm:w-5 bg-white shadow-sm"
                : "h-1.5 w-1.5 sm:h-2 sm:w-2 bg-white/50 hover:bg-white/70"
            }`}
            aria-label={`תמונה ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
