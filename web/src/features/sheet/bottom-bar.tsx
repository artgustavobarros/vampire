import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { useState } from "react";
import { InfoTrigger } from "#/components/vtm/info-trigger";
import { DamageTrack } from "#/components/vtm/tracks";
import { useRuleDialog } from "#/features/actions/rule-dialog";
import type { Sheet, TrackKey } from "#/lib/types";
import { cn } from "#/lib/utils";
import { cycleBox, trackBoxes, trackMax } from "#/rules/tracks";
import { patchSheet, useSheet } from "#/stores/character-store";

const LABEL =
  "font-label font-semibold text-white/60 text-xs uppercase leading-none tracking-[.12em]";

const SUMMARY =
  "font-bold font-label text-sm uppercase leading-none tracking-[.12em]";

/** Caixas vazias e máximo da trilha, para o resumo da barra recolhida. */
function trackSummary(sheet: Sheet, track: TrackKey): string {
  const max = trackMax(sheet, track);
  const empty = trackBoxes(sheet[track], max).filter((m) => m === 0).length;
  return `${empty}/${max}`;
}

/**
 * Barra fixa do rodapé: Checagem de sangue, Vitalidade, Fome e Vontade.
 * Abaixo de `sm` começa recolhida numa linha de resumo; a partir de `sm` fica sempre completa.
 */
export function BottomBar() {
  const sheet = useSheet();
  const dialog = useRuleDialog();
  const [expanded, setExpanded] = useState(false);
  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-blood border-t-4 bg-ink px-3 sm:px-4 sm:pt-12 sm:pb-3",
        expanded && "pt-12 pb-3"
      )}
    >
      <button
        aria-expanded={false}
        aria-label="Expandir barra"
        className={cn(
          "relative w-full cursor-pointer items-center justify-center gap-5 py-4 text-white focus-visible:outline-2 focus-visible:outline-white sm:hidden",
          expanded ? "hidden" : "flex"
        )}
        onClick={() => setExpanded(true)}
        type="button"
      >
        <span className={SUMMARY}>{`Vit ${trackSummary(sheet, "vit")}`}</span>
        <span className={cn(SUMMARY, "text-ember")}>
          {`Fome ${sheet.fome || 0}`}
        </span>
        <span className={SUMMARY}>{`Vont ${trackSummary(sheet, "fdv")}`}</span>
        <ChevronUpIcon aria-hidden className="absolute right-1 size-5" />
      </button>
      {expanded ? (
        <button
          aria-expanded
          aria-label="Recolher barra"
          className="absolute top-2 right-2 flex size-9 cursor-pointer items-center justify-center text-white focus-visible:outline-2 focus-visible:outline-white sm:hidden"
          onClick={() => setExpanded(false)}
          type="button"
        >
          <ChevronDownIcon aria-hidden className="size-5" />
        </button>
      ) : null}
      <div className={cn(expanded ? "block" : "hidden", "sm:block")}>
        <button
          className="absolute top-0 left-1/2 min-h-16 -translate-x-1/2 -translate-y-1/2 cursor-pointer whitespace-nowrap border-4 border-ink bg-blood px-10 py-5 font-label font-semibold text-sm text-white uppercase leading-none tracking-widest transition-colors hover:bg-blood-hover focus-visible:outline-2 focus-visible:outline-white sm:px-16"
          onClick={() => dialog.open("rouse")}
          type="button"
        >
          Checagem de sangue
        </button>
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 items-center gap-2 sm:grid-cols-[1fr_auto_1fr] sm:gap-4">
          <BarTrack track="vit" />
          <div aria-live="polite" className="px-1 text-center">
            <div className={LABEL}>Fome</div>
            <div className="mt-1 font-bold font-label text-2xl text-ember leading-tight">
              {sheet.fome || 0}
            </div>
          </div>
          <BarTrack track="fdv" />
        </div>
      </div>
    </div>
  );
}

function BarTrack({ track }: { track: TrackKey }) {
  const sheet = useSheet();
  const max = trackMax(sheet, track);
  const marks = trackBoxes(sheet[track], max);
  const vit = track === "vit";
  return (
    <div className="flex min-w-0 flex-col items-center gap-3 border border-white/25 px-2 py-3">
      <InfoTrigger
        className={LABEL}
        onDark
        target={{
          atual: `Máximo ${max}`,
          kind: vit ? "vitalidade" : "vontade",
        }}
      >
        {vit ? "Vitalidade" : "Vontade"}
      </InfoTrigger>
      <DamageTrack
        className="justify-center"
        label={vit ? "Vitalidade" : "Força de Vontade"}
        marks={marks}
        onCycle={(i) => patchSheet({ [track]: cycleBox(marks, i) })}
        tone="inverse"
      />
    </div>
  );
}
