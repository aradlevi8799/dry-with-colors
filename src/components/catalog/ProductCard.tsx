"use client";

import Image from "next/image";
import { Product } from "@/types/product";
import WhatsAppButton from "./WhatsAppButton";

interface ProductCardProps {
  product: Product;
  onClick: () => void;
  index?: number;
}

export default function ProductCard({ product, onClick, index = 0 }: ProductCardProps) {
  const coverImage = product.images[0]?.url;

  return (
    <div
      role="button"
      tabIndex={0}
      className="group cursor-pointer animate-fade-up outline-none focus-visible:ring-2 focus-visible:ring-terracotta/50 focus-visible:ring-offset-2 rounded-sm"
      style={{ animationDelay: `${0.1 + index * 0.07}s` }}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={`${product.name} - ₪${product.price}`}
    >
      {/* Image */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-sand">
        {coverImage ? (
          <Image
            src={coverImage}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            sizes="(max-width: 639px) 50vw, (max-width: 1023px) 33vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-taupe text-sm">
            אין תמונה
          </div>
        )}

        {/* Image count badge */}
        {product.images.length > 1 && (
          <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-charcoal/50 backdrop-blur-sm px-2 py-0.5 text-[10px] text-white/90">
            <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
            </svg>
            {product.images.length}
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-charcoal/0 transition-colors duration-500 group-hover:bg-charcoal/[0.04]" />
      </div>

      {/* Info */}
      <div className="pt-2.5 pb-1">
        <h3 className="font-heading text-xl font-bold text-charcoal leading-tight line-clamp-1">
          {product.name}
        </h3>
        <p className="mt-0.5 text-sm text-taupe line-clamp-2 leading-snug whitespace-pre-line">
          {product.description}
        </p>
        <div className="mt-2 flex items-center justify-between">
          <span className="font-heading text-2xl font-bold text-terracotta">
            ₪{product.price}
          </span>
          <WhatsAppButton
            productName={product.name}
            compact
          />
        </div>
      </div>
    </div>
  );
}
