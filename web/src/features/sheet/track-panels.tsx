import { InfoTrigger } from "#/components/vtm/info-trigger";
import { Panel } from "#/components/vtm/text";
import { DamageIcon, HumanityTrack } from "#/components/vtm/tracks";
import { cn } from "#/lib/utils";
import { stains, toggleStain } from "#/rules/humanity";
import { patchSheet, useSheet } from "#/stores/character-store";

const TITLE =
  "mb-3 font-label font-semibold text-ink-soft text-xs uppercase leading-none tracking-[.12em]";
const HINT = "mt-2 text-base";
const INLINE_ICON = "inline-block size-[1em] align-[-0.125em]";

export const CYCLE_HINT = (
  <>
    Toque para marcar: vazio → <DamageIcon className={INLINE_ICON} mark={1} />{" "}
    superficial → <DamageIcon className={INLINE_ICON} mark={2} /> agravado
  </>
);

export function HumanityCompactPanel() {
  const sheet = useSheet();
  const marks = stains(sheet);
  const count = marks.filter(Boolean).length;
  return (
    <Panel>
      <h3 className={cn(TITLE, "mt-0")}>
        <InfoTrigger
          target={{
            atual: `${sheet.humanidade || 0} / 10`,
            kind: "humanidade",
            marca: String(sheet.humanidade || 0),
          }}
        >
          Humanidade
        </InfoTrigger>{" "}
        · {sheet.humanidade || 0} / 10
      </h3>
      <HumanityTrack
        level={sheet.humanidade || 0}
        onToggle={(i) => patchSheet(toggleStain(sheet, i))}
        size="sm"
        stains={marks}
      />
      <div className={cn(HINT, "text-ink/55")}>
        Toque em qualquer quadrado para marcar mancha (
        <DamageIcon className={INLINE_ICON} mark={2} />) ·{" "}
        {count === 1 ? "1 mancha" : `${count} manchas`}
      </div>
    </Panel>
  );
}
