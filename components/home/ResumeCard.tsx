import Link from "next/link";
import ProgressBar from "@/components/ui/ProgressBar";
import { ACCENT_GRADIENT } from "@/lib/colors";

interface ResumeCardProps {
  href: string;
  title: string;
  subtitle: string;
  pct: number;
}

export default function ResumeCard({ href, title, subtitle, pct }: ResumeCardProps) {
  return (
    <Link
      href={href}
      className="relative block overflow-hidden rounded-3xl p-[22px] text-white shadow-[0_18px_34px_-16px_oklch(0.55_0.16_288_/_0.6)]"
      style={{ background: ACCENT_GRADIENT }}
    >
      <div className="text-[12px] font-bold tracking-[0.08em] opacity-85">CONTINUE STUDYING</div>
      <div className="mt-2 mb-1 text-[21px] font-bold tracking-tight">{title}</div>
      <div className="text-[13px] opacity-85">{subtitle}</div>
      <div className="mt-[18px] flex items-center gap-2.5">
        <ProgressBar pct={pct} fill="#fff" />
        <div className="text-[12px] font-bold">{Math.round(pct)}%</div>
      </div>
      <div className="pointer-events-none absolute -right-[30px] -top-[30px] h-[120px] w-[120px] rounded-full bg-white/10" />
    </Link>
  );
}
