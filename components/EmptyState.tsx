import Link from "next/link";

interface EmptyStateProps {
  title: string;
  subtitle: string;
  actionLabel?: string;
  actionHref?: string;
}

export default function EmptyState({ title, subtitle, actionLabel, actionHref }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <div className="text-5xl">🗂️</div>
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="max-w-sm text-muted">{subtitle}</p>
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="mt-2 inline-flex h-10 items-center rounded-lg bg-accent px-5 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
