import { Panel } from "#/components/vtm/text";
import { DamageTrack, HumanityTrack } from "#/components/vtm/tracks";
import type { TrackKey } from "#/lib/types";
import { cn } from "#/lib/utils";
import { stains, toggleStain } from "#/rules/humanity";
import { cycleBox, trackBoxes, trackMax } from "#/rules/tracks";
import { patchSheet, useSheet } from "#/stores/character-store";

const TITLE =
  "mb-3 font-label font-semibold text-ink-soft text-xs uppercase leading-none tracking-[.12em]";
const HINT = "mt-2 text-base";
export const CYCLE_HINT =
  "Toque para marcar: vazio → / superficial → ✕ agravado";

export function TrackPanel({
  track,
  hint,
  hintClassName,
}: {
  track: TrackKey;
  hint: string;
  hintClassName?: string;
}) {
  const sheet = useSheet();
  const max = trackMax(sheet, track);
  const marks = trackBoxes(sheet[track], max);
  const label = track === "vit" ? "Vitalidade" : "Força de Vontade";
  return (
    <Panel>
      <h3 className={cn(TITLE, "mt-0")}>
        {label} · máx {max}
      </h3>
      <DamageTrack
        label={label}
        marks={marks}
        onCycle={(i) => patchSheet({ [track]: cycleBox(marks, i) })}
      />
      <div className={cn(HINT, hintClassName ?? "text-ink-faint")}>{hint}</div>
    </Panel>
  );
}

export function HumanityCompactPanel() {
  const sheet = useSheet();
  const marks = stains(sheet);
  const count = marks.filter(Boolean).length;
  return (
    <Panel>
      <h3 className={cn(TITLE, "mt-0")}>
        Humanidade · {sheet.humanidade || 0} / 10
      </h3>
      <HumanityTrack
        level={sheet.humanidade || 0}
        onToggle={(i) => patchSheet(toggleStain(sheet, i))}
        size="sm"
        stains={marks}
      />
      <div className={cn(HINT, "text-ink/55")}>
        Toque em qualquer quadrado para marcar mancha (✕) ·{" "}
        {count === 1 ? "1 mancha" : `${count} manchas`}
      </div>
    </Panel>
  );
}
