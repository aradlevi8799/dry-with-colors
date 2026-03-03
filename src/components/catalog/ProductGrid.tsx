"use client";

import { Product } from "@/types/product";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  onProductClick: (product: Product) => void;
}

export default function ProductGrid({
  products,
  onProductClick,
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="py-24 text-center animate-fade-in">
        <p className="font-heading text-3xl text-taupe font-bold">
          אין מוצרים להצגה כרגע
        </p>
        <p className="mt-3 text-lg text-taupe/60">בקרוב יתווספו מוצרים חדשים</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-x-5 sm:gap-y-10 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product, i) => (
        <ProductCard
          key={product.id}
          product={product}
          onClick={() => onProductClick(product)}
          index={i}
        />
      ))}
    </div>
  );
}
