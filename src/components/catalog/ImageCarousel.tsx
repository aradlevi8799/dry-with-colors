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
          sizes="100vw"
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
            sizes="100vw"
            priority={i === 0}
          />
        ))}
      </div>

      {/* Dots indicator */}
      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`rounded-full transition-all duration-300 ${
              i === current
                ? "h-1.5 w-4 bg-white shadow-sm"
                : "h-1.5 w-1.5 bg-white/50 hover:bg-white/70"
            }`}
            aria-label={`תמונה ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
