"use client";

import { useState } from "react";
import { Product, ProductFormData } from "@/types/product";
import { addProduct, updateProduct } from "@/lib/products";
import { uploadProductImage, deleteProductImage } from "@/lib/storage";
import { ProductImage } from "@/types/product";
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
      const formData: ProductFormData = {
        name: name.trim(),
        description: description.trim(),
        price: parseFloat(price) || 0,
      };

      if (isEdit && product) {
        // Delete removed images from storage
        const removedImages = product.images.filter(
          (orig) => !images.some((img) => img.path === orig.path)
        );
        for (const img of removedImages) {
          await deleteProductImage(img.path);
        }

        // Upload new images
        const finalImages: ProductImage[] = [];
        for (let i = 0; i < images.length; i++) {
          const img = images[i];
          if (img.file) {
            const uploaded = await uploadProductImage(product.id, img.file, i);
            finalImages.push(uploaded);
          } else if (img.path) {
            finalImages.push({ url: img.url, path: img.path });
          }
        }

        await updateProduct(product.id, formData, finalImages);
      } else {
        // Create a temp ID, then update with uploaded images
        const newId = await addProduct(formData, []);

        const uploadedImages: ProductImage[] = [];
        for (let i = 0; i < images.length; i++) {
          const img = images[i];
          if (img.file) {
            const uploaded = await uploadProductImage(newId, img.file, i);
            uploadedImages.push(uploaded);
          }
        }

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
      <h2 className="font-heading text-2xl font-bold text-[#AB886D]">
        {isEdit ? "עריכת מוצר" : "הוספת מוצר חדש"}
      </h2>

      <ImageUpload images={images} onChange={setImages} />

      {/* Name */}
      <div>
        <label className="block text-lg font-bold text-charcoal-light mb-1">
          שם המוצר
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border border-taupe/30 bg-cream px-4 py-3 text-xl text-charcoal outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta/20"
          placeholder="למשל: סידור פמפס גראס"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-lg font-bold text-charcoal-light mb-1">
          תיאור
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full rounded-lg border border-taupe/30 bg-cream px-4 py-3 text-xl text-charcoal outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 resize-none"
          placeholder="תיאור המוצר, כולל מידות..."
        />
      </div>

      {/* Price */}
      <div>
        <label className="block text-lg font-bold text-charcoal-light mb-1">
          מחיר (₪)
        </label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          min="0"
          step="1"
          className="w-full rounded-lg border border-taupe/30 bg-cream px-4 py-3 text-xl text-charcoal outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta/20"
          placeholder="0"
        />
      </div>

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
          className="rounded-lg border border-taupe/30 bg-cream px-6 py-3.5 text-xl font-bold text-charcoal transition-colors hover:bg-sand"
        >
          ביטול
        </button>
      </div>
    </form>
  );
}
