import type { DamageMark } from "#/lib/types";
import { cn } from "#/lib/utils";

const MARK_NAME = ["vazio", "superficial", "agravado"] as const;

const SUPERFICIAL_PATH =
  "M21.5 1.5L18.2 6.2L19.1 6.6L14.6 12.4L15.5 12.8L3.2 22.5L2.4 21.7L9.6 13.4L8.7 13L13.4 7.6L12.5 7.2Z";
const AGRAVADO_PATH =
  "M22.5 1.5L14.2 12L22.5 22.5L20.8 21.9L12 13.6L3.2 21.9L1.5 22.5L9.8 12L1.5 1.5L3.2 2.1L12 10.4L20.8 2.1Z";

/** Marca de dano: superficial (traço) ou agravado (X). */
export function DamageIcon({
  mark,
  className,
}: {
  mark: DamageMark;
  className?: string;
}) {
  if (mark === 0) {
    return null;
  }
  return (
    <svg
      aria-hidden="true"
      className={cn(
        "size-4 flex-none",
        mark === 2 ? "text-blood" : "text-ink",
        className
      )}
      data-mark={MARK_NAME[mark]}
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d={mark === 2 ? AGRAVADO_PATH : SUPERFICIAL_PATH} />
    </svg>
  );
}

interface DamageTrackProps {
  label: string;
  marks: readonly DamageMark[];
  onCycle: (index: number) => void;
}

/** Caixas de Vitalidade / Força de Vontade: vazio → superficial → agravado. */
export function DamageTrack({ label, marks, onCycle }: DamageTrackProps) {
  return (
    <fieldset
      aria-label={label}
      className="m-0 flex flex-wrap gap-1 border-0 p-0"
    >
      {marks.map((m, i) => (
        <button
          aria-label={`${label} ${i + 1}: ${MARK_NAME[m]}`}
          className="grid size-6 cursor-pointer place-items-center border border-ink bg-field focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-1"
          key={i}
          onClick={() => onCycle(i)}
          type="button"
        >
          <DamageIcon mark={m} />
        </button>
      ))}
    </fieldset>
  );
}

interface DamagePreviewProps {
  changed: readonly boolean[];
  label: string;
  marks: readonly DamageMark[];
  onCycle?: (index: number) => void;
}

const PREVIEW_BOX =
  "grid h-10 min-w-0 flex-1 place-items-center border bg-field";

function countLabel(n: number, one: string, many: string): string {
  return `${n} ${n === 1 ? one : many}`;
}

/**
 * Caixas do resultado; as alteradas ficam tracejadas em vermelho.
 * Com `onCycle`, cada caixa é um botão: vazio → superficial → agravado.
 */
export function DamagePreview({
  changed,
  label,
  marks,
  onCycle,
}: DamagePreviewProps) {
  const count = (mark: DamageMark) => marks.filter((m) => m === mark).length;
  const summary = [
    countLabel(count(1), "superficial", "superficiais"),
    countLabel(count(2), "agravado", "agravados"),
    countLabel(count(0), "vazia", "vazias"),
  ].join(", ");
  const boxClass = (i: number) =>
    cn(PREVIEW_BOX, changed[i] ? "border-blood border-dashed" : "border-ink");
  const icon = (m: DamageMark, i: number) => (
    <DamageIcon className={cn("size-5", changed[i] && "text-blood")} mark={m} />
  );

  if (onCycle) {
    return (
      <fieldset
        aria-label={`${label}: ${summary}`}
        className="m-0 flex gap-2 border-0 p-0"
      >
        {marks.map((m, i) => (
          <button
            aria-label={`${label} ${i + 1}: ${MARK_NAME[m]}`}
            className={cn(
              boxClass(i),
              "cursor-pointer focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-1"
            )}
            data-changed={changed[i] || undefined}
            key={i}
            onClick={() => onCycle(i)}
            type="button"
          >
            {icon(m, i)}
          </button>
        ))}
      </fieldset>
    );
  }

  return (
    <div aria-label={`${label}: ${summary}`} className="flex gap-2" role="img">
      {marks.map((m, i) => (
        <div
          className={boxClass(i)}
          data-changed={changed[i] || undefined}
          key={i}
        >
          {icon(m, i)}
        </div>
      ))}
    </div>
  );
}

interface HumanityTrackProps {
  level: number;
  onToggle: (index: number) => void;
  size?: "sm" | "lg";
  stains: readonly boolean[];
}

/** 10 caixas: preenchidas até o nível; X agravado marca mancha. */
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
              "grid cursor-pointer place-items-center border border-ink focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-1",
              size === "lg" ? "size-10" : "size-6",
              filled ? "bg-ink" : "bg-field"
            )}
            key={i}
            onClick={() => onToggle(i)}
            type="button"
          >
            {stained ? (
              <DamageIcon
                className={cn(
                  size === "lg" && "size-5",
                  filled && "text-white"
                )}
                mark={2}
              />
            ) : null}
          </button>
        );
      })}
    </fieldset>
  );
}
