import { ACCENT } from "@/lib/colors";

interface ToggleSwitchProps {
  checked: boolean;
  onChange: () => void;
}

export default function ToggleSwitch({ checked, onChange }: ToggleSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={(e) => {
        // The card-edit row also toggles on click anywhere in it; stop
        // propagation here so clicking the switch itself doesn't double-fire.
        e.stopPropagation();
        onChange();
      }}
      className="relative h-[27px] w-[46px] flex-none rounded-full transition-colors duration-200"
      style={{ background: checked ? ACCENT : "#d8d3c9" }}
    >
      <div
        className="absolute top-[3px] h-[21px] w-[21px] rounded-full bg-white transition-[left] duration-200"
        style={{ left: checked ? 22 : 3 }}
      />
    </button>
  );
}
