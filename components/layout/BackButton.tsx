"use client";

interface BackButtonProps {
  onClick: () => void;
  variant?: "chevron" | "close";
}

export default function BackButton({ onClick, variant = "chevron" }: BackButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={variant === "close" ? "Close" : "Back"}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white"
    >
      {variant === "close" ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3a3730" strokeWidth="2.4" strokeLinecap="round">
          <line x1="6" y1="6" x2="18" y2="18" />
          <line x1="18" y1="6" x2="6" y2="18" />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3a3730" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      )}
    </button>
  );
}
