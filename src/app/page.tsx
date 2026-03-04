"use client";

import { useState, useEffect, useMemo, Suspense, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Product } from "@/types/product";
import { getAllProducts, incrementViewCount } from "@/lib/products";
import { incrementCatalogVisit } from "@/lib/analytics";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import Header from "@/components/catalog/Header";
import ProductGrid from "@/components/catalog/ProductGrid";
import ProductModal from "@/components/catalog/ProductModal";
import SortControl from "@/components/catalog/SortControl";
import type { SortOption } from "@/components/catalog/SortControl";

function CatalogPageInner() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>("default");
  const searchParams = useSearchParams();

  const sortedProducts = useMemo(() => {
    if (sortOption === "default") return products;
    return [...products].sort((a, b) =>
      sortOption === "price-asc" ? a.price - b.price : b.price - a.price
    );
  }, [products, sortOption]);

  useEffect(() => {
    async function load() {
      try {
        const data = await getAllProducts();
        setProducts(data);
      } catch (err) {
        console.error("Failed to load products:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Track catalog visit once per session
  useEffect(() => {
    if (typeof window === "undefined") return;
    const key = "catalog_visit_tracked";
    if (!sessionStorage.getItem(key)) {
      sessionStorage.setItem(key, "1");
      incrementCatalogVisit();
    }
  }, []);

  // Auto-open product from URL query param
  useEffect(() => {
    if (products.length === 0) return;
    const productId = searchParams.get("product");
    if (productId) {
      const found = products.find((p) => p.id === productId);
      if (found) {
        setSelectedProduct(found);
        incrementViewCount(found.id);
      }
    }
  }, [products, searchParams]);

  const handleProductClick = useCallback((product: Product) => {
    setSelectedProduct(product);
    window.history.replaceState(null, "", `?product=${product.id}`);
    incrementViewCount(product.id);
  }, []);

  const handleModalClose = useCallback(() => {
    setSelectedProduct(null);
    window.history.replaceState(null, "", "/");
  }, []);

  return (
    <div className="mx-auto min-h-screen max-w-md sm:max-w-2xl lg:max-w-4xl px-4 pb-12">
      <Header />

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-terracotta/30 border-t-terracotta" />
          <span className="text-lg text-taupe animate-pulse font-bold">
            טוען מוצרים...
          </span>
        </div>
      ) : (
        <>
          {products.length > 1 && (
            <SortControl sortOption={sortOption} onSortChange={setSortOption} />
          )}
          <ProductGrid
            products={sortedProducts}
            onProductClick={handleProductClick}
          />
        </>
      )}

      <ProductModal
        product={selectedProduct}
        onClose={handleModalClose}
      />

      {/* Footer */}
      <footer className="mt-12 pt-6 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="h-px w-12 bg-gradient-to-l from-sand-dark to-transparent" />
          <div className="h-1.5 w-1.5 rounded-full bg-terracotta/40" />
          <div className="h-px w-12 bg-gradient-to-r from-sand-dark to-transparent" />
        </div>

        <p className="font-heading text-2xl font-bold tracking-[0.06em] text-brand">
          Dry With Colors
        </p>
        <p className="mt-2 text-base text-brand">
          סידורי פרחים יבשים, כלי גבס מעוצבים בעבודת יד
        </p>

        <div className="mt-4 flex items-center justify-center gap-4 flex-wrap">
          {process.env.NEXT_PUBLIC_WHATSAPP_NUMBER && (
            <a
              href={`https://wa.me/${(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "").replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-lg font-bold text-terracotta transition-colors hover:text-terracotta-dark"
            >
              <WhatsAppIcon />
              וואטסאפ
            </a>
          )}
          <a
            href="https://www.instagram.com/dry_with_colors/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-lg font-bold text-terracotta transition-colors hover:text-terracotta-dark"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="currentColor"
            >
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
            אינסטגרם
          </a>
        </div>

        <p className="mt-8 text-sm text-taupe pb-[max(1rem,env(safe-area-inset-bottom))]">
          &copy; {new Date().getFullYear()} Dry With Colors
        </p>
      </footer>
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto min-h-screen max-w-md sm:max-w-2xl lg:max-w-4xl px-4 pb-12">
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-terracotta/30 border-t-terracotta" />
            <span className="text-lg text-taupe animate-pulse font-bold">
              טוען מוצרים...
            </span>
          </div>
        </div>
      }
    >
      <CatalogPageInner />
    </Suspense>
  );
}
