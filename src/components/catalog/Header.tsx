"use client";

export default function Header() {
  return (
    <header className="relative py-8 sm:py-12 md:py-16 text-center">
      {/* Decorative top ornament */}
      <div className="animate-fade-in flex items-center justify-center gap-3 sm:gap-4 mb-4 sm:mb-5">
        <div className="h-px w-8 sm:w-12 bg-gradient-to-l from-terracotta/40 to-transparent" />
        <svg
          className="h-3 w-3 sm:h-[14px] sm:w-[14px] text-terracotta/50"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 2C12 2 8 6 8 10C8 12.21 9.79 14 12 14C14.21 14 16 12.21 16 10C16 6 12 2 12 2Z" />
        </svg>
        <div className="h-px w-8 sm:w-12 bg-gradient-to-r from-terracotta/40 to-transparent" />
      </div>

      {/* Brand name */}
      <h1 className="animate-fade-up font-heading text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-[0.06em] sm:tracking-[0.1em] text-[#AB886D]">
        Dry With Colors
      </h1>

      {/* Subtitle */}
      <p className="animate-fade-up delay-2 mt-2 sm:mt-3 font-body text-lg sm:text-xl md:text-2xl text-[#AB886D] tracking-wide leading-snug">
        סידורי פרחים יבשים, כלי גבס מעוצבים בעבודת יד
      </p>

      {/* Decorative line */}
      <div className="mt-4 sm:mt-6 flex items-center justify-center">
        <div className="h-px w-20 sm:w-28 bg-gradient-to-r from-transparent via-terracotta/35 to-transparent animate-grow-line" />
      </div>
    </header>
  );
}
