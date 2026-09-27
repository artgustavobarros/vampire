import { useState } from "react";
import { Button } from "#/components/ui/button";
import {
  SegmentedControl,
  SegmentedControlItem,
} from "#/components/vtm/segmented-control";
import { SelectableCard } from "#/components/vtm/selectable";
import { RESONANCE_INTENSITIES, RESONANCES } from "#/data/fields";
import type { Sheet } from "#/lib/types";
import type { ActionResult } from "#/rules/actions";
import { feed } from "#/rules/feeding";

/** a presa sem Ressonância é simplesmente nenhuma marcada */
const PREY_RESONANCES = RESONANCES.filter((r) => r !== "Sem ressonância");

const STEP_BTN =
  "flex size-12 cursor-pointer items-center justify-center border border-line bg-field font-label font-semibold text-ink text-xl leading-none focus-visible:outline-2 focus-visible:outline-ink disabled:cursor-not-allowed disabled:opacity-40";
const LABEL =
  "font-label font-semibold text-ink-soft text-xs uppercase leading-none tracking-[.12em]";

interface FeedFormProps {
  onApply: (result: ActionResult) => void;
  onCancel: () => void;
  sheet: Sheet;
}

/** Formulário "Registrar alimentação": quanto saciou + Ressonância da presa. */
export function FeedForm({ onApply, onCancel, sheet }: FeedFormProps) {
  const hunger = sheet.fome || 0;
  const min = Math.min(1, hunger);
  const [amount, setAmount] = useState(hunger);
  const [resonance, setResonance] = useState("");
  const [intensity, setIntensity] = useState(RESONANCE_INTENSITIES[0]);

  const submit = () =>
    onApply(
      feed(
        sheet,
        amount,
        resonance ? { intensidade: intensity, tipo: resonance } : undefined
      )
    );

  return (
    <div className="mt-4 flex flex-col">
      <div className="flex items-center justify-between gap-3 bg-wash p-2">
        <button
          aria-label="Saciar menos"
          className={STEP_BTN}
          disabled={amount <= min}
          onClick={() => setAmount(amount - 1)}
          type="button"
        >
          −
        </button>
        <output aria-live="polite" className="flex flex-col items-center gap-1">
          <span className="font-semibold font-serif text-2xl text-ink leading-none">
            {amount}
          </span>
          <span className={LABEL}>Saciar</span>
        </output>
        <button
          aria-label="Saciar mais"
          className={STEP_BTN}
          disabled={amount >= hunger}
          onClick={() => setAmount(amount + 1)}
          type="button"
        >
          +
        </button>
      </div>

      <fieldset className="m-0 mt-5 border-0 p-0">
        <legend className={`${LABEL} mb-3 p-0`}>Ressonância da presa</legend>
        <div className="grid grid-cols-2 gap-2">
          {PREY_RESONANCES.map((r) => (
            <SelectableCard
              className="text-center font-serif text-xl"
              filled
              key={r}
              onClick={() => setResonance(resonance === r ? "" : r)}
              selected={resonance === r}
            >
              {r}
            </SelectableCard>
          ))}
        </div>
      </fieldset>
      <SegmentedControl
        aria-label="Intensidade"
        className="mt-3"
        disabled={!resonance}
        onValueChange={setIntensity}
        value={intensity}
      >
        {RESONANCE_INTENSITIES.map((i) => (
          <SegmentedControlItem key={i} value={i}>
            {i}
          </SegmentedControlItem>
        ))}
      </SegmentedControl>

      <div className="mt-6 flex flex-col gap-2">
        <Button
          className="h-auto w-full whitespace-normal px-3 py-4"
          disabled={amount === 0 && !resonance}
          onClick={submit}
          type="button"
          variant="destructive"
        >
          {hunger
            ? `Alimentar · Fome ${hunger} → ${hunger - amount}`
            : "Registrar ressonância"}
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
