"use client";

import { Product } from "@/types/product";
import Modal from "@/components/ui/Modal";
import ImageCarousel from "./ImageCarousel";
import WhatsAppButton from "./WhatsAppButton";
import ShareButton from "./ShareButton";

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
  if (!product) return null;

  return (
    <Modal isOpen={!!product} onClose={onClose} ariaLabel={product.name}>
      <ImageCarousel images={product.images} alt={product.name} />

      <div className="p-4 pb-6">
        <h2 className="font-heading text-3xl font-bold text-charcoal leading-tight">
          {product.name}
        </h2>

        <p className="mt-3 text-lg text-charcoal-light leading-snug whitespace-pre-line">
          {product.description}
        </p>

        {product.outOfStock ? (
          <div className="mt-4 rounded-lg bg-red-50 p-3 text-center">
            <p className="text-lg font-bold text-red-600">
              אזל המלאי, יחודש בהקדם
            </p>
          </div>
        ) : (
          <p className="mt-4 text-xs font-bold text-brand text-center tracking-wide whitespace-nowrap">
            הקטלוג לתצוגה בלבד, להזמנות אני ממתינה לך בוואטסאפ 🤍
          </p>
        )}

        {/* Price + Actions */}
        <div className="mt-3 flex items-center justify-between border-t border-sand-dark/40 pt-4">
          <span className="font-heading text-3xl font-bold text-terracotta">
            ₪{product.price}
          </span>
          <div className="flex items-center gap-2">
            <ShareButton productName={product.name} productId={product.id} />
            {!product.outOfStock && (
              <WhatsAppButton productName={product.name} />
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
