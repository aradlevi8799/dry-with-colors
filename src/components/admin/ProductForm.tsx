"use client";

import { useState } from "react";
import { Product, ProductImage } from "@/types/product";
import { addProduct, updateProduct } from "@/lib/products";
import { uploadProductImage, deleteProductImage } from "@/lib/storage";
import ImageUpload, { ImageItem } from "./ImageUpload";

interface ProductFormProps {
  product?: Product | null;
  onSave: () => void;
  onCancel: () => void;
}

export default function ProductForm({
  product,
  onSave,
  onCancel,
}: ProductFormProps) {
  const isEdit = !!product;

  const [name, setName] = useState(product?.name || "");
  const [description, setDescription] = useState(product?.description || "");
  const [price, setPrice] = useState(product?.price?.toString() || "");
  const [outOfStock, setOutOfStock] = useState(product?.outOfStock || false);
  const [images, setImages] = useState<ImageItem[]>(
    product?.images.map((img) => ({ url: img.url, path: img.path })) || []
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("נא להזין שם מוצר");
      return;
    }
    if (images.length === 0) {
      setError("נא להעלות לפחות תמונה אחת");
      return;
    }

    setSaving(true);

    try {
      const formData = {
        name: name.trim(),
        description: description.trim(),
        price: parseFloat(price) || 0,
        outOfStock,
      };

      if (isEdit && product) {
        // Delete removed images in parallel
        const removedImages = product.images.filter(
          (orig) => !images.some((img) => img.path === orig.path)
        );
        await Promise.all(removedImages.map((img) => deleteProductImage(img.path)));

        // Upload new images in parallel, preserve order
        const finalImages = await Promise.all(
          images.map(async (img, i) => {
            if (img.file) {
              return uploadProductImage(product.id, img.file, i);
            }
            return { url: img.url, path: img.path! } as ProductImage;
          })
        );

        await updateProduct(product.id, formData, finalImages);
      } else {
        const newId = await addProduct(formData, []);

        // Upload images in parallel
        const uploadedImages = await Promise.all(
          images
            .filter((img) => img.file)
            .map((img, i) => uploadProductImage(newId, img.file!, i))
        );

        await updateProduct(newId, {}, uploadedImages);
      }

      onSave();
    } catch (err) {
      console.error("Save error:", err);
      setError("שגיאה בשמירה. נסי שוב.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h2 className="font-heading text-2xl font-bold text-brand">
        {isEdit ? "עריכת מוצר" : "הוספת מוצר חדש"}
      </h2>

      <ImageUpload images={images} onChange={setImages} />

      {/* Name */}
      <div>
        <label htmlFor="product-name" className="block text-lg font-bold text-charcoal-light mb-1">
          שם המוצר
        </label>
        <input
          id="product-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border border-taupe/30 bg-sand/30 px-4 py-3 text-xl text-charcoal outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 focus:bg-white"
          placeholder="למשל: סידור פמפס גראס"
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="product-description" className="block text-lg font-bold text-charcoal-light mb-1">
          תיאור
        </label>
        <textarea
          id="product-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full rounded-lg border border-taupe/30 bg-sand/30 px-4 py-3 text-xl text-charcoal outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 focus:bg-white resize-none"
          placeholder="תיאור המוצר, כולל מידות..."
        />
      </div>

      {/* Price */}
      <div>
        <label htmlFor="product-price" className="block text-lg font-bold text-charcoal-light mb-1">
          מחיר (₪)
        </label>
        <input
          id="product-price"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          min="0"
          step="1"
          className="w-full rounded-lg border border-taupe/30 bg-sand/30 px-4 py-3 text-xl text-charcoal outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 focus:bg-white"
          placeholder="0"
        />
      </div>

      {/* Out of Stock Toggle */}
      <label className="flex items-center gap-3 cursor-pointer select-none">
        <div className="relative">
          <input
            type="checkbox"
            checked={outOfStock}
            onChange={(e) => setOutOfStock(e.target.checked)}
            className="sr-only peer"
          />
          <div className="h-6 w-11 rounded-full bg-taupe/30 transition-colors peer-checked:bg-red-500" />
          <div className="absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
        </div>
        <span className="text-lg font-bold text-charcoal-light">
          אזל המלאי כרגע
        </span>
      </label>

      {error && (
        <p className="text-lg font-bold text-red-500 bg-red-50 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="flex-1 rounded-lg bg-terracotta py-3.5 text-xl font-bold text-white transition-colors hover:bg-terracotta-dark active:scale-[0.98] disabled:opacity-50"
        >
          {saving ? "שומר..." : "שמור"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="rounded-lg border border-taupe/30 bg-white px-6 py-3.5 text-xl font-bold text-charcoal transition-colors hover:bg-sand"
        >
          ביטול
        </button>
      </div>
    </form>
  );
}
