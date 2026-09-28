import { useState } from "react";
import { Button } from "#/components/ui/button";
import { DamagePreview } from "#/components/vtm/tracks";
import { CYCLE_HINT } from "#/features/sheet/track-panels";
import type { DamageMark, Sheet, TrackKey } from "#/lib/types";
import { cn } from "#/lib/utils";
import type { ActionResult } from "#/rules/actions";
import { cycleBox, takeDamage } from "#/rules/tracks";
import { FORM_LABEL, Stepper } from "./stepper";
import { LevelCards, TrackTabs, trackLabel } from "./track-form";

const MAX_RECEIVED = 20;

const HALVE_HINT =
  "Vampiros dividem dano Superficial por 2, arredondando para cima";
const ADJUST_HINT = "Ajuste o dano recebido se for o caso.";

/** Dica da divisão: o jogador decide se ela vale; o app marca o valor escolhido. */
function explanation(track: TrackKey, level: 1 | 2, received: number) {
  if (track === "fdv") {
    return "Dano de Força de Vontade não é dividido.";
  }
  if (level === 2) {
    return "Dano Agravado não é dividido.";
  }
  if (received === 0) {
    return `${HALVE_HINT}. ${ADJUST_HINT}`;
  }
  const verb = received === 1 ? "viraria" : "virariam";
  return `${HALVE_HINT}: ${received} ${verb} ${Math.ceil(received / 2)}. ${ADJUST_HINT}`;
}

interface DamageFormProps {
  onApply: (result: ActionResult) => void;
  onCancel: () => void;
  sheet: Sheet;
}

/** Formulário "Sofrer dano": trilha, dano recebido, tipo e prévia clicável do resultado. */
export function DamageForm({ onApply, onCancel, sheet }: DamageFormProps) {
  const [track, setTrack] = useState<TrackKey>("vit");
  const [received, setReceived] = useState(0);
  const [level, setLevel] = useState<1 | 2>(1);
  /** Caixas marcadas à mão; `null` parte da ficha. */
  const [base, setBase] = useState<DamageMark[] | null>(null);
  const result = takeDamage(sheet, track, level, received, base ?? undefined);
  const label = `${trackLabel(track)} depois`;
  const unchanged = received === 0 && !result.changed.some(Boolean);
  // O clique age no que está na tela: a prévia vira o ponto de partida.
  const cycle = (i: number) => {
    setBase(cycleBox(result.marks, i));
    setReceived(0);
  };

  return (
    <div className="mt-2 flex flex-col">
      <TrackTabs
        onChange={(t) => {
          setTrack(t);
          setBase(null);
        }}
        value={track}
      />

      <div className="mt-4">
        <Stepper
          decrementLabel="Menos dano"
          incrementLabel="Mais dano"
          label="Dano recebido"
          max={MAX_RECEIVED}
          min={0}
          onChange={setReceived}
          value={received}
        />
      </div>

      <div className="mt-4">
        <LevelCards onChange={setLevel} value={level} />
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
        {explanation(track, level, received)}
      </p>

      <div className="mt-6 flex flex-col gap-2">
        <Button
          className="h-auto w-full whitespace-normal px-3 py-4"
          disabled={unchanged}
          onClick={() => onApply(result)}
          type="button"
        >
          {base ? "Marcar dano" : `Marcar ${received} de dano`}
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
