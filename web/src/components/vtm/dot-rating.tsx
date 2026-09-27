import { cn } from "#/lib/utils";
import { nextDotValue } from "#/rules/dots";

interface DotRatingProps {
  /** valores aceitos; pontos acima do maior ficam tracejados e desativados */
  allowed?: readonly number[];
  className?: string;
  count?: number;
  label: string;
  /** omitido = somente leitura */
  onChange?: (value: number) => void;
  size?: "sm" | "md" | "lg";
  tone?: "ink" | "blood" | "inverse";
  value: number;
}

const SIZES = { lg: "size-10", md: "size-6", sm: "size-5" } as const;
const OFF = "border-dashed border-ink/25 bg-transparent";

const TONES = {
  blood: { fill: "bg-blood", ring: "border-blood bg-field" },
  ink: { fill: "bg-ink", ring: "border-ink bg-field" },
  inverse: { fill: "bg-white/60", ring: "border-white/60 bg-transparent" },
} as const;

/** Pontos circulares do standalone. Clicar no valor atual diminui 1. */
export function DotRating({
  allowed,
  value,
  onChange,
  count = 5,
  label,
  size = "md",
  tone = "ink",
  className,
}: DotRatingProps) {
  const t = TONES[tone];
  const dots = Array.from({ length: count }, (_, i) => i + 1);
  const top = allowed ? Math.max(...allowed) : count;
  const off = (n: number) => n > top;
  if (!onChange) {
    return (
      <span
        aria-label={`${label}: ${value} de ${count}`}
        className={cn("flex gap-1", className)}
        role="img"
      >
        {dots.map((n) => (
          <span
            className={cn(
              "block rounded-full border p-1",
              SIZES[size],
              off(n) ? OFF : t.ring
            )}
            key={n}
          >
            {value >= n && !off(n) && (
              <span className={cn("block size-full rounded-full", t.fill)} />
            )}
          </span>
        ))}
      </span>
    );
  }
  return (
    <fieldset
      aria-label={label}
      className={cn("m-0 flex gap-1 border-0 p-0", className)}
    >
      {dots.map((n) => (
        <button
          aria-label={`${label} ${n}`}
          aria-pressed={value >= n}
          className={cn(
            "block shrink-0 cursor-pointer rounded-full border p-1 focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-1 disabled:cursor-default",
            SIZES[size],
            off(n) ? OFF : t.ring
          )}
          disabled={off(n)}
          key={n}
          onClick={() => {
            const next = nextDotValue(value, n);
            if (allowed === undefined || allowed.includes(next)) {
              onChange(next);
            }
          }}
          type="button"
        >
          {value >= n && !off(n) && (
            <span className={cn("block size-full rounded-full", t.fill)} />
          )}
        </button>
      ))}
    </fieldset>
  );
}
