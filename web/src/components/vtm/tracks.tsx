import type { DamageMark } from "#/lib/types";
import { cn } from "#/lib/utils";

const MARK = ["", "/", "✕"] as const;
const MARK_NAME = ["vazio", "superficial", "agravado"] as const;

interface DamageTrackProps {
  label: string;
  marks: readonly DamageMark[];
  onCycle: (index: number) => void;
}

/** Caixas de Vitalidade / Força de Vontade: vazio → / → ✕. */
export function DamageTrack({ label, marks, onCycle }: DamageTrackProps) {
  return (
    <fieldset
      aria-label={label}
      className="m-0 flex flex-wrap gap-1 border-0 p-0"
    >
      {marks.map((m, i) => (
        <button
          aria-label={`${label} ${i + 1}: ${MARK_NAME[m]}`}
          className="grid size-6 cursor-pointer place-items-center border border-ink bg-field font-bold font-label text-base text-ink leading-none focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-1"
          key={i}
          onClick={() => onCycle(i)}
          type="button"
        >
          {MARK[m]}
        </button>
      ))}
    </fieldset>
  );
}

interface HumanityTrackProps {
  level: number;
  onToggle: (index: number) => void;
  size?: "sm" | "lg";
  stains: readonly boolean[];
}

/** 10 caixas: preenchidas até o nível; ✕ marca mancha. */
export function HumanityTrack({
  level,
  stains,
  onToggle,
  size = "lg",
}: HumanityTrackProps) {
  return (
    <fieldset
      aria-label="Humanidade"
      className={cn(
        "m-0 flex flex-wrap border-0 p-0",
        size === "lg" ? "gap-2" : "gap-1"
      )}
    >
      {stains.map((stained, i) => {
        const filled = level >= i + 1;
        return (
          <button
            aria-label={`Humanidade ${i + 1}${filled ? " preenchida" : ""}${stained ? ", com mancha" : ""}`}
            aria-pressed={stained}
            className={cn(
              "grid cursor-pointer place-items-center border border-ink font-bold font-label leading-none focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-1",
              size === "lg" ? "size-10 text-base" : "size-6 text-sm",
              filled ? "bg-ink text-white" : "bg-field text-ink"
            )}
            key={i}
            onClick={() => onToggle(i)}
            type="button"
          >
            {stained ? "✕" : ""}
          </button>
        );
      })}
    </fieldset>
  );
}
