"use client";

import { useRef, useState } from "react";
import Image from "next/image";

export interface ImageItem {
  file?: File;
  url: string;
  path?: string;
}

interface ImageUploadProps {
  images: ImageItem[];
  onChange: (images: ImageItem[]) => void;
  maxImages?: number;
}

export default function ImageUpload({
  images,
  onChange,
  maxImages = 5,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  function handleFiles(files: FileList | null) {
    if (!files) return;
    const remaining = maxImages - images.length;
    const newImages: ImageItem[] = Array.from(files)
      .slice(0, remaining)
      .map((file) => ({
        file,
        url: URL.createObjectURL(file),
      }));
    onChange([...images, ...newImages]);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  }

  function removeImage(index: number) {
    const updated = images.filter((_, i) => i !== index);
    onChange(updated);
  }

  function moveImage(from: number, to: number) {
    if (to < 0 || to >= images.length) return;
    const updated = [...images];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    onChange(updated);
  }

  return (
    <div>
      <label className="block text-lg font-bold text-charcoal-light mb-2">
        תמונות (עד {maxImages})
      </label>

      {/* Preview grid */}
      {images.length > 0 && (
        <div className="mb-3 grid grid-cols-3 gap-2">
          {images.map((img, i) => (
            <div
              key={i}
              className="group relative aspect-square overflow-hidden rounded-sm border-2 border-taupe/20"
            >
              <Image
                src={img.url}
                alt={`תמונה ${i + 1}`}
                fill
                className="object-cover"
                sizes="120px"
              />
              {i === 0 && (
                <span className="absolute top-1 right-1 rounded bg-terracotta px-1.5 py-0.5 text-sm font-bold text-white">
                  ראשית
                </span>
              )}
              <div className="absolute inset-0 flex items-center justify-center gap-1 bg-charcoal/50 opacity-0 transition-opacity group-hover:opacity-100">
                {i > 0 && (
                  <button
                    type="button"
                    onClick={() => moveImage(i, i - 1)}
                    className="rounded bg-cream/90 px-2 py-1 text-sm font-bold"
                  >
                    →
                  </button>
                )}
                {i < images.length - 1 && (
                  <button
                    type="button"
                    onClick={() => moveImage(i, i + 1)}
                    className="rounded bg-cream/90 px-2 py-1 text-sm font-bold"
                  >
                    ←
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="rounded bg-red-500 px-2 py-1 text-sm font-bold text-white"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload area */}
      {images.length < maxImages && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors ${
            dragOver
              ? "border-terracotta bg-terracotta/5"
              : "border-taupe/30 bg-cream hover:border-terracotta/50"
          }`}
        >
          <span className="text-3xl mb-2">📷</span>
          <p className="text-lg font-bold text-charcoal-light">
            גררי תמונות לכאן או לחצי להעלאה
          </p>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>
      )}
    </div>
  );
}
