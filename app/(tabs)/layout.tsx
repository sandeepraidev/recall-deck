import BottomNav from "@/components/layout/BottomNav";

export default function TabsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto min-h-screen max-w-md bg-background">
      <div className="px-5 pb-[96px] pt-1">{children}</div>
      <BottomNav />
    </div>
  );
}
