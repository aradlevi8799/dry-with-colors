"use client";

import WhatsAppIcon from "@/components/ui/WhatsAppIcon";

interface WhatsAppButtonProps {
  productName: string;
  className?: string;
  compact?: boolean;
}

export default function WhatsAppButton({
  productName,
  className = "",
  compact = false,
}: WhatsAppButtonProps) {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
  const message = encodeURIComponent(
    `שלום, אשמח לשאול לגבי המוצר: ${productName}`
  );
  const url = `https://wa.me/${phone.replace(/[^0-9]/g, "")}?text=${message}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      className={`inline-flex items-center gap-1.5 rounded-full bg-[#25D366] text-white transition-all duration-200 hover:bg-[#1ebe5d] hover:shadow-md active:scale-[0.97] ${
        compact ? "text-sm font-bold px-3 py-1.5" : "text-lg font-bold px-5 py-2.5"
      } ${className}`}
    >
      <WhatsAppIcon className={compact ? "h-3 w-3" : "h-4 w-4"} />
      {compact ? "להזמנה" : "להזמנה"}
    </a>
  );
}
