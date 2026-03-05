"use client";

import { useMemo } from "react";
import { Product } from "@/types/product";

interface StatsBarProps {
  products: Product[];
  catalogVisits: number;
  onResetViews?: () => void;
}

export default function StatsBar({ products, catalogVisits, onResetViews }: StatsBarProps) {
  const stats = useMemo(() => {
    const total = products.length;
    const inStock = products.filter((p) => !p.outOfStock).length;
    const outOfStock = total - inStock;
    const totalViews = products.reduce((sum, p) => sum + (p.viewCount || 0), 0);

    const sorted = [...products].sort(
      (a, b) => (b.viewCount || 0) - (a.viewCount || 0)
    );

    return { total, inStock, outOfStock, totalViews, sorted };
  }, [products]);

  return (
    <div className="mb-6 space-y-4">
      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-lg bg-sand p-3">
          <p className="text-sm text-taupe font-bold">כניסות לקטלוג</p>
          <p className="font-heading text-3xl font-bold text-charcoal">
            {catalogVisits.toLocaleString()}
          </p>
        </div>

        <div className="rounded-lg bg-sand p-3">
          <p className="text-sm text-taupe font-bold">סה״כ מוצרים</p>
          <p className="font-heading text-3xl font-bold text-charcoal">
            {stats.total}
          </p>
        </div>

        <div className="rounded-lg bg-sand p-3">
          <p className="text-sm text-taupe font-bold">במלאי / אזל</p>
          <p className="font-heading text-2xl font-bold">
            <span className="text-red-500">{stats.outOfStock}</span>
            <span className="text-taupe mx-1">/</span>
            <span className="text-brand">{stats.inStock}</span>
          </p>
        </div>

        <div className="rounded-lg bg-sand p-3">
          <p className="text-sm text-taupe font-bold">סה״כ צפיות מוצרים</p>
          <p className="font-heading text-3xl font-bold text-terracotta">
            {stats.totalViews.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Per-product views table */}
      {stats.sorted.length > 0 && stats.totalViews > 0 && (
        <div className="rounded-lg bg-sand overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 border-b border-sand-dark/30">
            <h3 className="text-base font-bold text-charcoal">צפיות לפי מוצר</h3>
            {onResetViews && (
              <button
                onClick={onResetViews}
                className="flex items-center gap-1 rounded-full border border-red-200 bg-white px-2.5 py-1 text-xs font-bold text-red-500 shadow-sm transition-all duration-200 hover:bg-red-500 hover:text-white hover:border-red-500 hover:shadow-md active:scale-[0.95]"
                aria-label="אפס צפיות"
              >
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                איפוס
              </button>
            )}
          </div>
          <div className="divide-y divide-sand-dark/20">
            {stats.sorted.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between gap-3 px-3 py-2 min-w-0"
              >
                <div className="flex items-center gap-2 min-w-0 overflow-hidden">
                  <span className="text-base font-bold text-charcoal truncate">
                    {product.name}
                  </span>
                  {product.outOfStock && (
                    <span className="flex-shrink-0 rounded-full bg-red-50 px-1.5 py-0.5 text-[10px] font-bold text-red-600">
                      אזל
                    </span>
                  )}
                </div>
                <span className="flex-shrink-0 text-base font-bold text-taupe whitespace-nowrap">
                  {(product.viewCount || 0).toLocaleString()} צפיות
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
