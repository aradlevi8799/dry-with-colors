"use client";

import Modal from "@/components/ui/Modal";

interface DeleteConfirmProps {
  isOpen: boolean;
  productName: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function DeleteConfirm({
  isOpen,
  productName,
  onConfirm,
  onCancel,
  loading,
}: DeleteConfirmProps) {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} ariaLabel="מחיקת מוצר">
      <div className="p-6 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-2xl">
          🗑️
        </div>
        <h3 className="text-2xl font-bold text-charcoal">מחיקת מוצר</h3>
        <p className="mt-3 text-lg text-charcoal-light">
          האם למחוק את <strong>&quot;{productName}&quot;</strong>?
        </p>
        <p className="mt-1 text-base text-taupe">פעולה זו לא ניתנת לביטול</p>

        <div className="mt-6 flex gap-3 justify-center">
          <button
            onClick={onCancel}
            disabled={loading}
            className="rounded-lg border border-taupe/30 bg-white px-6 py-2.5 text-lg font-bold text-charcoal transition-colors hover:bg-sand"
          >
            ביטול
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="rounded-lg bg-red-500 px-6 py-2.5 text-lg font-bold text-white transition-colors hover:bg-red-600 active:scale-[0.97] disabled:opacity-50"
          >
            {loading ? "מוחק..." : "מחק"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
