interface ProgressBarProps {
  pct: number;
  fill: string;
  track?: string;
  heightPx?: number;
}

export default function ProgressBar({ pct, fill, track = "rgba(255,255,255,0.25)", heightPx = 6 }: ProgressBarProps) {
  return (
    <div className="flex-1 overflow-hidden rounded-full" style={{ height: heightPx, background: track }}>
      <div
        className="h-full rounded-full transition-[width] duration-300 ease-out"
        style={{ width: `${Math.max(0, Math.min(100, pct))}%`, background: fill }}
      />
    </div>
  );
}
