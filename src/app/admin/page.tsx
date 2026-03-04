"use client";

import { useState, useEffect, useCallback } from "react";
import { Product } from "@/types/product";
import { getAllProducts, deleteProduct } from "@/lib/products";
import { deleteAllProductImages } from "@/lib/storage";
import ProductList from "@/components/admin/ProductList";
import ProductForm from "@/components/admin/ProductForm";
import DeleteConfirm from "@/components/admin/DeleteConfirm";
import Modal from "@/components/ui/Modal";

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadProducts = useCallback(async () => {
    try {
      const data = await getAllProducts();
      setProducts(data);
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

  function handleSave() {
    setShowForm(false);
    setEditingProduct(null);
    loadProducts();
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
            <h1 className="font-heading text-2xl font-bold text-[#8B6F57]">
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
              className="rounded-lg border border-taupe/30 px-3 py-2 text-base font-bold text-charcoal-light transition-colors hover:bg-white"
            >
              יציאה
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-3xl px-4 py-6">
        {/* Add button */}
        <button
          onClick={handleAdd}
          className="mb-6 w-full rounded-lg bg-terracotta py-4 text-2xl font-bold text-white transition-colors hover:bg-terracotta-dark active:scale-[0.99] shadow-md"
        >
          + הוסף מוצר חדש
        </button>

        {loading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-terracotta/30 border-t-terracotta" />
            <span className="text-lg text-taupe font-bold animate-pulse">טוען מוצרים...</span>
          </div>
        ) : (
          <ProductList
            products={products}
            onEdit={handleEdit}
            onDelete={setDeletingProduct}
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
