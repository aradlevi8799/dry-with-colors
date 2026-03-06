"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Product } from "@/types/product";
import { getAllProducts, deleteProduct, toggleOutOfStock, toggleIsNew, resetAllViewCounts } from "@/lib/products";
import { getCatalogVisits, resetCatalogVisits } from "@/lib/analytics";
import { deleteAllProductImages } from "@/lib/storage";
import ProductList from "@/components/admin/ProductList";
import ProductForm from "@/components/admin/ProductForm";
import DeleteConfirm from "@/components/admin/DeleteConfirm";
import Modal from "@/components/ui/Modal";
import StatsBar from "@/components/admin/StatsBar";

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [catalogVisits, setCatalogVisits] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "price-asc" | "price-desc" | "newest" | "views">("newest");
  const [filterBy, setFilterBy] = useState<"all" | "in-stock" | "out-of-stock">("all");

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by search
    if (search.trim()) {
      result = result.filter((p) => p.name.includes(search.trim()));
    }

    // Filter by status
    if (filterBy === "in-stock") result = result.filter((p) => !p.outOfStock);
    else if (filterBy === "out-of-stock") result = result.filter((p) => p.outOfStock);

    // Sort
    if (sortBy === "name") result.sort((a, b) => a.name.localeCompare(b.name, "he"));
    else if (sortBy === "price-asc") result.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-desc") result.sort((a, b) => b.price - a.price);
    else if (sortBy === "newest") result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    else if (sortBy === "views") result.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));

    return result;
  }, [products, search, sortBy, filterBy]);

  const loadProducts = useCallback(async () => {
    try {
      const [data, visits] = await Promise.all([
        getAllProducts(),
        getCatalogVisits(),
      ]);
      setProducts(data);
      setCatalogVisits(visits);
    } catch (err) {
      console.error("Failed to load products:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  function handleEdit(product: Product) {
    setEditingProduct(product);
    setShowForm(true);
  }

  function handleAdd() {
    setEditingProduct(null);
    setShowForm(true);
  }

  async function handleToggleStock(product: Product) {
    try {
      await toggleOutOfStock(product.id, !product.outOfStock);
      await loadProducts();
    } catch (err) {
      console.error("Toggle stock error:", err);
    }
  }

  async function handleToggleNew(product: Product) {
    try {
      await toggleIsNew(product.id, !product.isNew);
      await loadProducts();
    } catch (err) {
      console.error("Toggle new error:", err);
    }
  }

  async function handleDelete() {
    if (!deletingProduct) return;
    setDeleting(true);
    try {
      await deleteAllProductImages(deletingProduct.images);
      await deleteProduct(deletingProduct.id);
      setDeletingProduct(null);
      await loadProducts();
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setDeleting(false);
    }
  }

  async function handleSave(savedId?: string) {
    const isNew = !editingProduct;
    setShowForm(false);
    setEditingProduct(null);
    await loadProducts();

    // Show toast
    setToast(isNew ? "המוצר נוסף בהצלחה!" : "המוצר עודכן בהצלחה!");
    setTimeout(() => setToast(null), 3000);

    // Highlight the product
    if (savedId) {
      setHighlightId(savedId);
      setTimeout(() => setHighlightId(null), 3000);
      // Scroll to the product
      setTimeout(() => {
        document.getElementById(`product-${savedId}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
    }
  }

  async function handleLogout() {
    await fetch("/api/auth", { method: "DELETE" });
    window.location.reload();
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-sand shadow-sm">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <div>
            <h1 className="font-heading text-2xl font-bold text-brand">
              ניהול מוצרים
            </h1>
            <p className="text-base text-taupe font-bold">Dry With Colors</p>
          </div>
          <div className="flex items-center gap-2">
<a
              href="/"
              className="rounded-lg bg-white px-3 py-2 text-base font-bold text-charcoal transition-colors hover:bg-taupe/20"
            >
              צפה בקטלוג
            </a>
            <button
              onClick={handleLogout}
              className="rounded-lg border border-taupe/30 px-3 py-2 text-base font-bold text-charcoal-light transition-colors hover:bg-taupe/10"
            >
              יציאה
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-3xl px-4 py-6">
        {!loading && products.length > 0 && (
          <StatsBar
            products={products}
            catalogVisits={catalogVisits}
            onResetViews={async () => {
              if (!confirm("לאפס את כל הצפיות?")) return;
              await resetAllViewCounts();
              await loadProducts();
            }}
            onResetVisits={async () => {
              if (!confirm("לאפס את כניסות הקטלוג?")) return;
              await resetCatalogVisits();
              await loadProducts();
            }}
          />
        )}

        {/* Add button */}
        <button
          onClick={handleAdd}
          className="mb-6 w-full rounded-lg bg-terracotta py-4 text-2xl font-bold text-white transition-colors hover:bg-terracotta-dark active:scale-[0.99] shadow-md"
        >
          + הוסף מוצר חדש
        </button>

        {/* Search + Sort + Filter */}
        {!loading && products.length > 0 && (
          <div className="mb-4 space-y-3">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="חיפוש מוצר..."
                className="w-full rounded-lg border border-taupe/30 bg-sand/30 px-4 py-3 pr-10 text-lg font-bold text-charcoal placeholder:text-taupe/60 outline-none transition-colors focus:border-terracotta/50 focus:bg-white"
              />
              <svg
                className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-taupe"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-taupe hover:text-charcoal transition-colors"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Sort + Filter row */}
            <div className="flex gap-2 flex-wrap">
              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="rounded-lg border border-taupe/30 bg-white px-3 py-2 text-sm font-bold text-charcoal-light outline-none transition-colors focus:border-terracotta/50 cursor-pointer"
              >
                <option value="newest">חדש ביותר</option>
                <option value="name">לפי שם</option>
                <option value="price-asc">מחיר: נמוך לגבוה</option>
                <option value="price-desc">מחיר: גבוה לנמוך</option>
                <option value="views">הכי נצפה</option>
              </select>

              {/* Filter chips */}
              {(["all", "in-stock", "out-of-stock"] as const).map((f) => {
                const labels = { all: "הכל", "in-stock": "במלאי", "out-of-stock": "אזל" };
                return (
                  <button
                    key={f}
                    onClick={() => setFilterBy(f)}
                    className={`rounded-full px-3 py-1.5 text-sm font-bold transition-colors ${
                      filterBy === f
                        ? "bg-terracotta text-white"
                        : "bg-sand text-charcoal-light hover:bg-sand-dark"
                    }`}
                  >
                    {labels[f]}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-terracotta/30 border-t-terracotta" />
            <span className="text-lg text-taupe font-bold animate-pulse">טוען מוצרים...</span>
          </div>
        ) : (
          <ProductList
            products={filteredProducts}
            onEdit={handleEdit}
            onDelete={setDeletingProduct}
            onToggleStock={handleToggleStock}
            onToggleNew={handleToggleNew}
            highlightId={highlightId}
          />
        )}
      </div>

      {/* Product Form Modal */}
      <Modal
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingProduct(null);
        }}
        ariaLabel={editingProduct ? "עריכת מוצר" : "הוספת מוצר חדש"}
      >
        <div className="p-4">
          <ProductForm
            product={editingProduct}
            onSave={handleSave}
            onCancel={() => {
              setShowForm(false);
              setEditingProduct(null);
            }}
          />
        </div>
      </Modal>

      {/* Success Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-fade-up">
          <div className="flex items-center gap-2 rounded-full bg-charcoal px-5 py-3 text-sm font-bold text-white shadow-lg">
            <svg className="h-4 w-4 text-[#25D366]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            {toast}
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <DeleteConfirm
        isOpen={!!deletingProduct}
        productName={deletingProduct?.name || ""}
        onConfirm={handleDelete}
        onCancel={() => setDeletingProduct(null)}
        loading={deleting}
      />
    </div>
  );
}
