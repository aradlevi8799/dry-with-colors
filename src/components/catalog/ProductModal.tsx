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

      <div className="p-4">
        <h2 className="font-heading text-3xl font-bold text-charcoal leading-tight">
          {product.name}
        </h2>

        <p className="mt-3 text-lg text-charcoal-light leading-snug whitespace-pre-line">
          {product.description}
        </p>

        {/* Catalog notice */}
        <p className="mt-4 text-lg font-bold text-[#8B6F57] text-center tracking-wide">
          האתר הינו לתצוגה בלבד, רוצה להזמין? ממתינה לך בוואטסאפ
        </p>

        {/* Price + WhatsApp */}
        <div className="mt-3 flex items-center justify-between border-t border-sand pt-4">
          <span className="font-heading text-3xl font-bold text-terracotta">
            ₪{product.price}
          </span>
          <WhatsAppButton productName={product.name} />
        </div>
      </div>
    </Modal>
  );
}
