"use client";

import { Product } from "@/types/product";
import Modal from "@/components/ui/Modal";
import ImageCarousel from "./ImageCarousel";
import WhatsAppButton from "./WhatsAppButton";

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
  if (!product) return null;

  return (
    <Modal isOpen={!!product} onClose={onClose}>
      <ImageCarousel images={product.images} alt={product.name} />

      <div className="p-4 sm:p-6 md:p-8">
        <h2 className="font-heading text-3xl sm:text-4xl font-bold text-charcoal leading-tight">
          {product.name}
        </h2>

        <p className="mt-3 sm:mt-4 text-lg sm:text-xl text-charcoal-light leading-snug">
          {product.description}
        </p>

        {/* Price + WhatsApp */}
        <div className="mt-5 sm:mt-6 flex items-center justify-between border-t border-sand pt-4 sm:pt-5">
          <span className="font-heading text-3xl sm:text-4xl font-bold text-terracotta">
            ₪{product.price}
          </span>
          <WhatsAppButton productName={product.name} />
        </div>
      </div>
    </Modal>
  );
}
