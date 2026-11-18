interface StackPeekProps {
  remaining: number;
}

export default function StackPeek({ remaining }: StackPeekProps) {
  return (
    <>
      <div
        className="absolute inset-x-3.5 top-3.5 -bottom-1.5 rounded-[26px] border border-border bg-white"
        style={{ opacity: remaining >= 3 ? 1 : 0, transform: "rotate(-3deg) scale(0.97)", zIndex: 1 }}
      />
      <div
        className="absolute inset-x-[7px] top-[7px] -bottom-[3px] rounded-[26px] border border-border bg-white"
        style={{ opacity: remaining >= 2 ? 1 : 0, transform: "rotate(2deg) scale(0.985)", zIndex: 2 }}
      />
    </>
  );
}
