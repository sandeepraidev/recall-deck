interface StatTileProps {
  value: number | string;
  label: string;
  color?: string;
  compact?: boolean;
}

export default function StatTile({ value, label, color = "var(--foreground-2)", compact = false }: StatTileProps) {
  return (
    <div
      className={`flex-1 rounded-2xl border border-border bg-white ${compact ? "p-3.5 text-center" : "p-3.5"}`}
    >
      <div className={compact ? "text-[19px] font-extrabold" : "text-[21px] font-extrabold"} style={{ color }}>
        {value}
      </div>
      <div className="mt-0.5 text-[11.5px] font-semibold text-muted">{label}</div>
    </div>
  );
}
