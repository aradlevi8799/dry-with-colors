"use client";

import { useState, useCallback, useRef } from "react";
import Image from "next/image";
import { ProductImage } from "@/types/product";

interface ImageCarouselProps {
  images: ProductImage[];
  alt: string;
}

function getDistance(t1: React.Touch, t2: React.Touch) {
  return Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
}

function getMidpoint(t1: React.Touch, t2: React.Touch) {
  return { x: (t1.clientX + t2.clientX) / 2, y: (t1.clientY + t2.clientY) / 2 };
}

const MIN_SCALE = 1;
const MAX_SCALE = 3;

export default function ImageCarousel({ images, alt }: ImageCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  // Zoom state
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const isZoomed = scale > 1.05;

  // Refs for gesture tracking
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const isPinching = useRef(false);
  const isPanning = useRef(false);
  const isGesturing = useRef(false);
  const initialPinchDistance = useRef(0);
  const initialScale = useRef(1);
  const lastTouchPos = useRef({ x: 0, y: 0 });
  const initialTranslate = useRef({ x: 0, y: 0 });

  const resetZoom = useCallback(() => {
    setScale(1);
    setTranslate({ x: 0, y: 0 });
  }, []);

  const clampTranslate = useCallback(
    (tx: number, ty: number, s: number) => {
      if (!containerRef.current || s <= 1) return { x: 0, y: 0 };
      const rect = containerRef.current.getBoundingClientRect();
      const maxX = (rect.width * (s - 1)) / (2 * s);
      const maxY = (rect.height * (s - 1)) / (2 * s);
      return {
        x: Math.max(-maxX, Math.min(maxX, tx)),
        y: Math.max(-maxY, Math.min(maxY, ty)),
      };
    },
    []
  );

  const goTo = useCallback(
    (index: number) => {
      if (transitioning || index === current) return;
      setTransitioning(true);
      setCurrent(index);
      resetZoom();
      setTimeout(() => setTransitioning(false), 400);
    },
    [transitioning, current, resetZoom]
  );

  const next = () => goTo((current + 1) % images.length);
  const prev = () => goTo((current - 1 + images.length) % images.length);

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      isPinching.current = true;
      isGesturing.current = true;
      initialPinchDistance.current = getDistance(e.touches[0], e.touches[1]);
      initialScale.current = scale;
      initialTranslate.current = { ...translate };
    } else if (e.touches.length === 1) {
      if (isZoomed) {
        isPanning.current = true;
        isGesturing.current = true;
        lastTouchPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        initialTranslate.current = { ...translate };
      } else {
        touchStartX.current = e.touches[0].clientX;
      }
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isPinching.current && e.touches.length === 2) {
      const dist = getDistance(e.touches[0], e.touches[1]);
      const ratio = dist / initialPinchDistance.current;
      const newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, initialScale.current * ratio));
      setScale(newScale);

      if (newScale > 1) {
        const mid = getMidpoint(e.touches[0], e.touches[1]);
        const rect = containerRef.current?.getBoundingClientRect();
        if (rect) {
          const offsetX = (mid.x - rect.left - rect.width / 2) * (1 - newScale / initialScale.current);
          const offsetY = (mid.y - rect.top - rect.height / 2) * (1 - newScale / initialScale.current);
          const newTranslate = clampTranslate(
            initialTranslate.current.x + offsetX / newScale,
            initialTranslate.current.y + offsetY / newScale,
            newScale
          );
          setTranslate(newTranslate);
        }
      }
    } else if (isPanning.current && e.touches.length === 1) {
      const dx = (e.touches[0].clientX - lastTouchPos.current.x) / scale;
      const dy = (e.touches[0].clientY - lastTouchPos.current.y) / scale;
      lastTouchPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      setTranslate((prev) => clampTranslate(prev.x + dx, prev.y + dy, scale));
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (isPinching.current) {
      isPinching.current = false;
      isGesturing.current = false;
      if (scale < 1.1) resetZoom();
      return;
    }
    if (isPanning.current) {
      isPanning.current = false;
      isGesturing.current = false;
      return;
    }

    // Swipe navigation (only when not zoomed)
    if (!isZoomed && e.changedTouches.length > 0) {
      const diff = touchStartX.current - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) prev();
        else next();
      }
    }
    isGesturing.current = false;
  };

  // Desktop: double-click to toggle zoom
  const handleDoubleClick = (e: React.MouseEvent) => {
    if (isZoomed) {
      resetZoom();
    } else {
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        const newScale = 2;
        const offsetX = (e.clientX - rect.left - rect.width / 2) / newScale;
        const offsetY = (e.clientY - rect.top - rect.height / 2) / newScale;
        setScale(newScale);
        setTranslate(clampTranslate(-offsetX, -offsetY, newScale));
      }
    }
  };

  // Desktop: scroll wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    if (!e.ctrlKey && !e.metaKey) return;
    e.preventDefault();
    const delta = -e.deltaY * 0.01;
    const newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, scale + delta));

    if (newScale <= 1.05) {
      resetZoom();
    } else {
      setScale(newScale);
      setTranslate((prev) => clampTranslate(prev.x, prev.y, newScale));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape" && isZoomed) {
      resetZoom();
      return;
    }
    if (e.key === "ArrowRight") prev();
    else if (e.key === "ArrowLeft") next();
  };

  const imageStyle = {
    transform: `scale(${scale}) translate(${translate.x}px, ${translate.y}px)`,
    transition: isGesturing.current ? "none" : "transform 0.3s ease-out",
    willChange: isZoomed ? "transform" as const : "auto" as const,
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
      <div
        ref={containerRef}
        className="relative aspect-square w-full overflow-hidden bg-sand"
        style={{ touchAction: isZoomed ? "none" : "pan-y" }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onDoubleClick={handleDoubleClick}
        onWheel={handleWheel}
      >
        <Image
          src={images[0].url}
          alt={alt}
          fill
          className="object-cover"
          style={imageStyle}
          sizes="100vw"
          draggable={false}
        />
        {isZoomed && (
          <button
            onClick={resetZoom}
            className="absolute top-2 right-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-charcoal/40 text-white backdrop-blur-sm transition-colors hover:bg-charcoal/60"
            aria-label="איפוס זום"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
            </svg>
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative bg-sand"
      style={{ touchAction: isZoomed ? "none" : "pan-y" }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onDoubleClick={handleDoubleClick}
      onWheel={handleWheel}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label={`תמונות של ${alt}`}
      aria-roledescription="קרוסלה"
    >
      <div className="relative aspect-square w-full overflow-hidden">
        {images.map((img, i) => {
          const distance = Math.min(
            Math.abs(i - current),
            images.length - Math.abs(i - current)
          );
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
              style={i === current ? imageStyle : undefined}
              sizes="(max-width: 640px) 100vw, 640px"
              priority={i === 0}
              draggable={false}
            />
          );
        })}
      </div>

      {/* Reset zoom button */}
      {isZoomed && (
        <button
          onClick={resetZoom}
          className="absolute top-2 right-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-charcoal/40 text-white backdrop-blur-sm transition-colors hover:bg-charcoal/60"
          aria-label="איפוס זום"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
          </svg>
        </button>
      )}

      {/* Prev/Next buttons — hidden when zoomed */}
      {!isZoomed && (
        <>
          <button
            onClick={prev}
            className="absolute right-2 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-charcoal/40 text-white backdrop-blur-sm transition-colors hover:bg-charcoal/60 focus-visible:ring-2 focus-visible:ring-white"
            aria-label="תמונה קודמת"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <button
            onClick={next}
            className="absolute left-2 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-charcoal/40 text-white backdrop-blur-sm transition-colors hover:bg-charcoal/60 focus-visible:ring-2 focus-visible:ring-white"
            aria-label="תמונה הבאה"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </>
      )}

      {/* Dots indicator */}
      {!isZoomed && (
        <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1" role="group" aria-label="בחירת תמונה">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-current={i === current ? "true" : undefined}
              className="flex items-center justify-center h-10 w-10 rounded-full transition-all duration-300 focus-visible:ring-2 focus-visible:ring-white"
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
      )}
    </div>
  );
}
