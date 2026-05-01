import Link from "next/link";
import TemplateCard from "@/components/TemplateCard";
import { TEMPLATE_LIST } from "@/lib/templates";

export default function ChooseTemplatePage() {
  return (
    <div className="min-h-screen bg-background px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <div className="mb-2">
          <Link href="/" className="text-sm text-muted hover:text-foreground transition-colors">
            ← Back to Decks
          </Link>
        </div>
        <div className="mb-10 mt-6">
          <h1 className="text-2xl font-bold">Choose a Template</h1>
          <p className="mt-1 text-muted">Pick a card format that fits what you&apos;re learning.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {TEMPLATE_LIST.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      </div>
    </div>
  );
}
