import type { TraitGroup } from "#/data/traits";
import { cn } from "#/lib/utils";
import { DotRating } from "./dot-rating";
import { InfoTrigger } from "./info-trigger";

interface TraitGridProps {
  className?: string;
  groups: readonly TraitGroup[];
  /** o nome de cada traço abre o painel de descrição deste tipo */
  infoKind: "attr" | "skill";
  /** largura mínima da coluna (auto-fit) */
  minColumn: number;
  onChange: (name: string, value: number) => void;
  /** cor do título do grupo: tinta (assistente) ou suave (ficha) */
  strongLabels?: boolean;
  values: Record<string, number>;
}

/** Grupos de atributos ou habilidades com pontos. */
export function TraitGrid({
  groups,
  infoKind,
  values,
  onChange,
  minColumn,
  strongLabels,
  className,
}: TraitGridProps) {
  return (
    <div
      className={cn("grid gap-6", className)}
      style={{
        gridTemplateColumns: `repeat(auto-fit, minmax(min(${minColumn}px, 100%), 1fr))`,
      }}
    >
      {groups.map((g) => (
        <div key={g.label}>
          <div
            className={cn(
              "mb-1 border-line border-b pb-2 font-label font-semibold text-xs uppercase leading-none tracking-[.12em]",
              strongLabels ? "text-ink" : "text-ink-soft"
            )}
          >
            {g.label}
          </div>
          {g.traits.map((name) => (
            <div
              className="flex items-center gap-3 border-line-soft border-b py-2"
              key={name}
            >
              <span className="flex-1 text-lg">
                <InfoTrigger
                  target={{
                    key: name,
                    kind: infoKind,
                    nivel: values[name] || 0,
                  }}
                >
                  {name}
                </InfoTrigger>
              </span>
              <DotRating
                label={name}
                onChange={(v) => onChange(name, v)}
                value={values[name] || 0}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

/** Grade auto-fit que colapsa para uma coluna no celular. */
export function autoFit(min: number) {
  return {
    gridTemplateColumns: `repeat(auto-fit, minmax(min(${min}px, 100%), 1fr))`,
  };
}
