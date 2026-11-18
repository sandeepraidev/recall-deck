"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ACCENT } from "@/lib/colors";

const INACTIVE = "#b0aaa0";

function NavIcon({ active, children, label, href }: { active: boolean; children: React.ReactNode; label: string; href: string }) {
  const color = active ? ACCENT : INACTIVE;
  return (
    <Link href={href} className="flex flex-1 flex-col items-center gap-1.5 pt-3">
      <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {children}
      </svg>
      <span className="text-[10.5px] font-bold" style={{ color }}>
        {label}
      </span>
    </Link>
  );
}

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-20 mx-auto flex h-[82px] max-w-md items-start border-t border-border bg-white/90 px-6 backdrop-blur-md"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <NavIcon href="/" active={pathname === "/"} label="Home">
        <path d="M3 10.5 12 3l9 7.5" />
        <path d="M5 9.5V21h14V9.5" />
      </NavIcon>
      <NavIcon href="/library" active={pathname === "/library"} label="Library">
        <rect x="3" y="4" width="18" height="5" rx="1.5" />
        <rect x="3" y="12" width="18" height="8" rx="1.5" />
      </NavIcon>
      <div className="mx-1.5 -mt-5 flex-none">
        <Link
          href="/card/new"
          className="flex h-[54px] w-[54px] items-center justify-center rounded-[18px]"
          style={{ background: ACCENT, boxShadow: `0 12px 24px -8px ${ACCENT}` }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </Link>
      </div>
      <NavIcon href="/stats" active={pathname === "/stats"} label="Stats">
        <line x1="6" y1="20" x2="6" y2="13" />
        <line x1="12" y1="20" x2="12" y2="8" />
        <line x1="18" y1="20" x2="18" y2="4" />
      </NavIcon>
      <NavIcon href="/profile" active={pathname === "/profile"} label="Profile">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
      </NavIcon>
    </div>
  );
}
