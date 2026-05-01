import { TEMPLATE_LIST } from "@/lib/templates";
import CreateDeckClient from "./CreateDeckClient";

export function generateStaticParams() {
  return TEMPLATE_LIST.map((t) => ({ template: t.id }));
}

interface PageProps {
  params: Promise<{ template: string }>;
}

export default async function CreateDeckPage({ params }: PageProps) {
  const { template } = await params;
  return <CreateDeckClient templateId={template} />;
}
