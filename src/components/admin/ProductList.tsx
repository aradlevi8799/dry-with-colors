"use client";

import Image from "next/image";
import { Product } from "@/types/product";

interface ProductListProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onToggleStock: (product: Product) => void;
  onToggleNew: (product: Product) => void;
  highlightId?: string | null;
}

export default function ProductList({
  products,
  onEdit,
  onDelete,
  onToggleStock,
  onToggleNew,
  highlightId,
}: ProductListProps) {
  if (products.length === 0) {
    return (
      <div className="rounded-xl bg-sand p-12 text-center animate-fade-in">
        <p className="text-3xl mb-3">🌸</p>
        <p className="text-2xl font-bold text-charcoal-light">אין מוצרים עדיין</p>
        <p className="mt-2 text-lg text-taupe">לחצי על &quot;הוסף מוצר&quot; כדי להתחיל</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {products.map((product, i) => (
        <div
          key={product.id}
          id={`product-${product.id}`}
          className={`rounded-lg p-3 shadow-sm transition-all duration-200 hover:shadow-md animate-fade-up ${
            product.outOfStock ? "bg-sand/60 opacity-75" : "bg-sand"
          } ${highlightId === product.id ? "ring-2 ring-terracotta shadow-md animate-pulse" : ""}`}
          style={{ animationDelay: `${i * 0.05}s` }}
        >
          <div className="flex items-center gap-3">
            {/* Thumbnail */}
            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-sm">
              {product.images[0] ? (
                <Image
                  src={product.images[0].url}
                  alt={product.name}
                  fill
                  className={`object-cover ${product.outOfStock ? "grayscale" : ""}`}
                  sizes="72px"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-taupe/10 text-taupe text-sm">
                  📷
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-charcoal truncate">
                  {product.name}
                </h3>
                {product.isNew && (
                  <span className="flex-shrink-0 rounded-full bg-terracotta px-2 py-0.5 text-xs font-bold text-white">
                    חדש!
                  </span>
                )}
                {product.outOfStock && (
                  <span className="flex-shrink-0 rounded-full bg-red-50 px-2 py-0.5 text-xs font-bold text-red-600">
                    אזל
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-base text-charcoal-light">
                <span className="font-bold text-terracotta">
                  ₪{product.price}
                </span>
                {product.images.length > 1 && (
                  <>
                    <span className="text-taupe">·</span>
                    <span>{product.images.length} תמונות</span>
                  </>
                )}
              </div>
            </div>

            {/* Actions — desktop inline */}
            <div className="hidden sm:flex gap-2 flex-shrink-0">
              <button
                onClick={() => onToggleNew(product)}
                className={`rounded-lg px-3 py-2 text-base font-bold transition-colors active:scale-[0.97] ${
                  product.isNew
                    ? "bg-terracotta text-white hover:bg-terracotta-dark"
                    : "bg-white border border-taupe/30 text-charcoal-light hover:bg-sand"
                }`}
              >
                {product.isNew ? "הסר חדש" : "חדש!"}
              </button>
              <button
                onClick={() => onToggleStock(product)}
                className={`rounded-lg px-3 py-2 text-base font-bold transition-colors active:scale-[0.97] ${
                  product.outOfStock
                    ? "bg-sand text-brand hover:bg-sand-dark"
                    : "bg-terracotta-light/20 text-terracotta-dark hover:bg-terracotta-light/30"
                }`}
              >
                {product.outOfStock ? "החזר למלאי" : "אזל"}
              </button>
              <button
                onClick={() => onEdit(product)}
                className="rounded-lg bg-white px-3 py-2 text-base font-bold text-charcoal transition-colors hover:bg-taupe/20 active:scale-[0.97]"
              >
                ערוך
              </button>
              <button
                onClick={() => onDelete(product)}
                className="rounded-lg bg-red-50 px-3 py-2 text-base font-bold text-red-500 transition-colors hover:bg-red-500 hover:text-white active:scale-[0.97]"
              >
                מחק
              </button>
            </div>
          </div>

          {/* Actions — mobile row below */}
          <div className="flex sm:hidden gap-2 mt-2 pt-2 border-t border-sand-dark/20 flex-wrap">
            <button
              onClick={() => onToggleNew(product)}
              className={`flex-1 rounded-lg px-3 py-2 text-base font-bold transition-colors active:scale-[0.97] ${
                product.isNew
                  ? "bg-terracotta text-white hover:bg-terracotta-dark"
                  : "bg-white border border-taupe/30 text-charcoal-light hover:bg-sand"
              }`}
            >
              {product.isNew ? "הסר חדש" : "חדש!"}
            </button>
            <button
              onClick={() => onToggleStock(product)}
              className={`flex-1 rounded-lg px-3 py-2 text-base font-bold transition-colors active:scale-[0.97] ${
                product.outOfStock
                  ? "bg-sand text-brand hover:bg-sand-dark"
                  : "bg-terracotta-light/20 text-terracotta-dark hover:bg-terracotta-light/30"
              }`}
            >
              {product.outOfStock ? "החזר למלאי" : "אזל"}
            </button>
            <button
              onClick={() => onEdit(product)}
              className="flex-1 rounded-lg bg-white px-3 py-2 text-base font-bold text-charcoal transition-colors hover:bg-taupe/20 active:scale-[0.97]"
            >
              ערוך
            </button>
            <button
              onClick={() => onDelete(product)}
              className="flex-1 rounded-lg bg-red-50 px-3 py-2 text-base font-bold text-red-500 transition-colors hover:bg-red-500 hover:text-white active:scale-[0.97]"
            >
              מחק
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
