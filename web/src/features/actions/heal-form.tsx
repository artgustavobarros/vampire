import { useState } from "react";
import { Button } from "#/components/ui/button";
import { DamagePreview } from "#/components/vtm/tracks";
import { CYCLE_HINT } from "#/features/sheet/track-panels";
import type { DamageMark, Sheet, TrackKey } from "#/lib/types";
import { cn } from "#/lib/utils";
import { type ActionResult, healHint } from "#/rules/actions";
import {
  cycleBox,
  healable,
  healDamage,
  trackBoxes,
  trackMax,
} from "#/rules/tracks";
import { FORM_LABEL, Stepper } from "./stepper";
import { LevelCards, TrackTabs, trackLabel } from "./track-form";

interface HealFormProps {
  onApply: (result: ActionResult) => void;
  onCancel: () => void;
  sheet: Sheet;
}

/** Formulário "Curar-se": trilha, dano curado, tipo e prévia clicável do resultado. */
export function HealForm({ onApply, onCancel, sheet }: HealFormProps) {
  const [track, setTrack] = useState<TrackKey>("vit");
  const [healed, setHealed] = useState(0);
  const [level, setLevel] = useState<1 | 2>(1);
  /** Caixas marcadas à mão; `null` parte da ficha. */
  const [base, setBase] = useState<DamageMark[] | null>(null);
  const fromSheet = (t: TrackKey) => trackBoxes(sheet[t], trackMax(sheet, t));
  const max = healable(base ?? fromSheet(track), level);
  const result = healDamage(sheet, track, level, healed, base ?? undefined);
  const label = `${trackLabel(track)} depois`;
  // O clique age no que está na tela: a prévia vira o ponto de partida.
  const cycle = (i: number) => {
    setBase(cycleBox(result.marks, i));
    setHealed(0);
  };

  return (
    <div className="mt-2 flex flex-col">
      <TrackTabs
        onChange={(t) => {
          setTrack(t);
          setBase(null);
          setHealed((n) => Math.min(n, healable(fromSheet(t), level)));
        }}
        value={track}
      />

      <div className="mt-4">
        <Stepper
          decrementLabel="Menos cura"
          incrementLabel="Mais cura"
          label="Dano curado"
          max={max}
          min={0}
          onChange={setHealed}
          value={healed}
        />
      </div>

      <div className="mt-4">
        <LevelCards
          onChange={(l) => {
            setLevel(l);
            setHealed((n) =>
              Math.min(n, healable(base ?? fromSheet(track), l))
            );
          }}
          value={level}
        />
      </div>

      <div className={cn(FORM_LABEL, "mt-5 mb-3")}>{label}</div>
      <DamagePreview
        changed={result.changed}
        label={label}
        marks={result.marks}
        onCycle={cycle}
      />
      <div className="mt-2 text-base text-ink-faint">{CYCLE_HINT}</div>
      <p className="m-0 mt-3 text-ink-soft text-lg">
        {healHint(sheet, track, level)}
      </p>

      <div className="mt-6 flex flex-col gap-2">
        <Button
          className="h-auto w-full whitespace-normal px-3 py-4"
          disabled={!result.changed.some(Boolean)}
          onClick={() => onApply(result)}
          type="button"
        >
          {base ? "Curar dano" : `Curar ${healed} de dano`}
        </Button>
        <Button
          className="h-auto w-full whitespace-normal px-3 py-4"
          onClick={onCancel}
          type="button"
          variant="outline"
        >
          Cancelar
        </Button>
      </div>
    </div>
  );
}
