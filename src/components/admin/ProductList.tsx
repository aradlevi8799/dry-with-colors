"use client";

import Image from "next/image";
import { Product } from "@/types/product";

interface ProductListProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export default function ProductList({
  products,
  onEdit,
  onDelete,
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
          className="flex items-center gap-3 rounded-lg bg-sand p-3 shadow-sm transition-all duration-200 hover:shadow-md animate-fade-up"
          style={{ animationDelay: `${i * 0.05}s` }}
        >
          {/* Thumbnail */}
          <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-sm">
            {product.images[0] ? (
              <Image
                src={product.images[0].url}
                alt={product.name}
                fill
                className="object-cover"
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
            <h3 className="text-lg font-bold text-charcoal truncate">
              {product.name}
            </h3>
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

          {/* Actions */}
          <div className="flex gap-2 flex-shrink-0">
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
      ))}
    </div>
  );
}
