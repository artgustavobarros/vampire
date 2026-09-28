const STEP_BTN =
  "flex size-12 cursor-pointer items-center justify-center border border-line bg-field font-label font-semibold text-ink text-xl leading-none focus-visible:outline-2 focus-visible:outline-ink disabled:cursor-not-allowed disabled:opacity-40";

export const FORM_LABEL =
  "font-label font-semibold text-ink-soft text-xs uppercase leading-none tracking-[.12em]";

interface StepperProps {
  decrementLabel: string;
  incrementLabel: string;
  label: string;
  max: number;
  min: number;
  onChange: (value: number) => void;
  value: number;
}

/** Contador − valor + dos formulários do diálogo de regras. */
export function Stepper({
  decrementLabel,
  incrementLabel,
  label,
  max,
  min,
  onChange,
  value,
}: StepperProps) {
  return (
    <div className="flex items-center justify-between gap-3 bg-wash p-2">
      <button
        aria-label={decrementLabel}
        className={STEP_BTN}
        disabled={value <= min}
        onClick={() => onChange(value - 1)}
        type="button"
      >
        −
      </button>
      <output aria-live="polite" className="flex flex-col items-center gap-1">
        <span className="font-semibold font-serif text-2xl text-ink leading-none">
          {value}
        </span>
        <span className={FORM_LABEL}>{label}</span>
      </output>
      <button
        aria-label={incrementLabel}
        className={STEP_BTN}
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
        type="button"
      >
        +
      </button>
    </div>
  );
}
