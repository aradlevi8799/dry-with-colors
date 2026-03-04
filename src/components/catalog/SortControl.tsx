"use client";

export type SortOption = "default" | "price-asc" | "price-desc";

interface SortControlProps {
  sortOption: SortOption;
  onSortChange: (option: SortOption) => void;
}

const OPTIONS: { value: SortOption; label: string }[] = [
  { value: "default", label: "ברירת מחדל" },
  { value: "price-asc", label: "מחיר: נמוך → גבוה" },
  { value: "price-desc", label: "מחיר: גבוה → נמוך" },
];

export default function SortControl({ sortOption, onSortChange }: SortControlProps) {
  function cycle() {
    const currentIndex = OPTIONS.findIndex((o) => o.value === sortOption);
    const nextIndex = (currentIndex + 1) % OPTIONS.length;
    onSortChange(OPTIONS[nextIndex].value);
  }

  const currentLabel = OPTIONS.find((o) => o.value === sortOption)?.label;

  return (
    <div className="mb-4 flex justify-start">
      <button
        onClick={cycle}
        className="inline-flex items-center gap-1.5 rounded-full bg-sand px-4 py-2 text-base font-bold text-charcoal transition-colors hover:bg-sand-dark"
        aria-label={`מיון: ${currentLabel}`}
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
        </svg>
        {currentLabel}
      </button>
    </div>
  );
}
