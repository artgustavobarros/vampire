import {
  SegmentedControl,
  SegmentedControlItem,
} from "#/components/vtm/segmented-control";
import { DamageIcon } from "#/components/vtm/tracks";
import type { TrackKey } from "#/lib/types";
import { cn } from "#/lib/utils";

const TRACKS: { key: TrackKey; label: string }[] = [
  { key: "vit", label: "Vitalidade" },
  { key: "fdv", label: "Força de Vontade" },
];

const LEVELS: { label: string; level: 1 | 2 }[] = [
  { label: "Superficial", level: 1 },
  { label: "Agravado", level: 2 },
];

export function trackLabel(track: TrackKey): string {
  return track === "vit" ? "Vitalidade" : "Força de Vontade";
}

interface TrackTabsProps {
  onChange: (track: TrackKey) => void;
  value: TrackKey;
}

/** Abas Vitalidade | Força de Vontade dos formulários de dano e cura. */
export function TrackTabs({ onChange, value }: TrackTabsProps) {
  return (
    <SegmentedControl
      aria-label="Trilha"
      onValueChange={(v) => onChange(v as TrackKey)}
      value={value}
    >
      {TRACKS.map((t) => (
        <SegmentedControlItem key={t.key} value={t.key}>
          {t.label}
        </SegmentedControlItem>
      ))}
    </SegmentedControl>
  );
}

interface LevelCardsProps {
  onChange: (level: 1 | 2) => void;
  value: 1 | 2;
}

/** Cartões de escolha única Superficial / Agravado, com o ícone da marca. */
export function LevelCards({ onChange, value }: LevelCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {LEVELS.map((l) => (
        <button
          aria-pressed={value === l.level}
          className={cn(
            "flex min-h-16 cursor-pointer flex-col items-center justify-center gap-1 border bg-field p-2 font-serif text-xl leading-none transition-colors focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2",
            value === l.level
              ? "border-ink text-ink"
              : "border-line text-ink-faint hover:border-ink"
          )}
          key={l.level}
          onClick={() => onChange(l.level)}
          type="button"
        >
          {l.label}
          <DamageIcon
            className={cn("size-5", value !== l.level && "opacity-60")}
            mark={l.level}
          />
        </button>
      ))}
    </div>
  );
}
