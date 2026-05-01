import Link from "next/link";
import type { TemplateDefinition } from "@/lib/types";

interface TemplateCardProps {
  template: TemplateDefinition;
}

export default function TemplateCard({ template }: TemplateCardProps) {
  const requiredFields = template.fields.filter((f) => f.required).length;
  const optionalFields = template.fields.filter((f) => !f.required).length;

  return (
    <Link
      href={`/create/${template.id}`}
      className="group flex flex-col gap-4 rounded-xl border border-border bg-surface p-6 transition-colors hover:bg-surface-hover hover:border-accent"
    >
      <div className="text-4xl">{template.icon}</div>
      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-semibold">{template.name}</h3>
        <p className="text-sm text-muted leading-relaxed">{template.description}</p>
      </div>
      <div className="mt-auto pt-2 text-xs text-muted">
        {requiredFields} required field{requiredFields !== 1 ? "s" : ""}
        {optionalFields > 0 && ` · ${optionalFields} optional`}
      </div>
    </Link>
  );
}

