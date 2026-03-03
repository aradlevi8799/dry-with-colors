"use client";

export default function Header() {
  return (
    <header className="relative py-8 text-center">
      {/* Decorative top ornament */}
      <div className="animate-fade-in flex items-center justify-center gap-3 mb-4">
        <div className="h-px w-8 bg-gradient-to-l from-terracotta/40 to-transparent" />
        <svg
          className="h-3 w-3 text-terracotta/50"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 2C12 2 8 6 8 10C8 12.21 9.79 14 12 14C14.21 14 16 12.21 16 10C16 6 12 2 12 2Z" />
        </svg>
        <div className="h-px w-8 bg-gradient-to-r from-terracotta/40 to-transparent" />
      </div>

      {/* Brand name */}
      <h1 className="animate-fade-up font-heading text-4xl font-bold tracking-[0.06em] text-[#AB886D]">
        Dry With Colors
      </h1>

      {/* Subtitle */}
      <p className="animate-fade-up delay-2 mt-2 font-body text-lg text-[#AB886D] tracking-wide leading-snug">
        סידורי פרחים יבשים, כלי גבס מעוצבים בעבודת יד
      </p>

      {/* Decorative line */}
      <div className="mt-4 flex items-center justify-center">
        <div className="h-px w-20 bg-gradient-to-r from-transparent via-terracotta/35 to-transparent animate-grow-line" />
      </div>

      {/* Catalog notice */}
      <p className="animate-fade-up delay-3 mt-3 text-lg font-bold text-[#AB886D] tracking-wide">
        האתר הינו לתצוגה בלבד, רוצה להזמין? ממתינה לך בוואטסאפ
      </p>
    </header>
  );
}
