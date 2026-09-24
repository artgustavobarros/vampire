import { SelectableCard } from "#/components/vtm/selectable";
import { autoFit } from "#/components/vtm/trait-grid";
import { findPredator, PREDATORS } from "#/data/predators";
import { patchSheet, useSheet } from "#/lib/store";
import { cn } from "#/lib/utils";

const COST = /^−|Defeito|Exige|Perde/;
const GAIN = /^\+|Vantagem|pontos em|Rebanho|Contatos|Fama|Recursos/;

/** Cor da borda de cada ajuste: custo em sangue, ganho em verde. */
function adjustmentTone(text: string): string {
  if (COST.test(text)) {
    return "border-l-blood";
  }
  if (GAIN.test(text)) {
    return "border-l-moss";
  }
  return "border-l-ink/20";
}

const LABEL =
  "font-label font-semibold text-xs uppercase leading-none tracking-widest text-ink/60";

export function Step6Predator() {
  const sheet = useSheet();
  const predator = findPredator(sheet.predador);
  return (
    <>
      <div className="grid gap-2" style={autoFit(220)}>
        {PREDATORS.map((p) => (
          <SelectableCard
            key={p.name}
            onClick={() =>
              patchSheet({ predador: p.name, predDisc: "", predEspec: "" })
            }
            selected={sheet.predador === p.name}
          >
            <span className="block font-label font-semibold text-xs leading-none tracking-[.02em]">
              {p.name}
            </span>
            <span className="mt-1 block text-base leading-snug opacity-70">
              {p.description}
            </span>
          </SelectableCard>
        ))}
      </div>
      {predator && (
        <div className="mt-5 flex flex-col gap-4 border border-line p-4">
          <OptionGroup
            label="Especialidade — escolha uma"
            onPick={(v) => patchSheet({ predEspec: v })}
            options={predator.specialties}
            value={sheet.predEspec}
          />
          <OptionGroup
            label="Disciplina — um ponto em uma"
            onPick={(v) => patchSheet({ predDisc: v })}
            options={predator.disciplines}
            value={sheet.predDisc}
          />
          <div className="flex flex-col gap-2">
            <span className={LABEL}>Ajustes obrigatórios</span>
            {predator.adjustments.map((t) => (
              <span
                className={cn(
                  "border-l-2 py-1 pl-3 text-base",
                  adjustmentTone(t)
                )}
                key={t}
              >
                {t}
              </span>
            ))}
          </div>
          <div className="text-sm opacity-70">
            {sheet.predEspec && sheet.predDisc
              ? `Predador definido: ${predator.name} · ${sheet.predEspec} · +1 ${sheet.predDisc}`
              : "Escolha uma especialidade e uma Disciplina para completar o Predador."}
          </div>
        </div>
      )}
    </>
  );
}

function OptionGroup({
  label,
  options,
  value,
  onPick,
}: {
  label: string;
  options: readonly string[];
  value: string | undefined;
  onPick: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className={LABEL}>{label}</span>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            aria-pressed={value === o}
            className={cn(
              "cursor-pointer border px-3 py-2 text-base leading-tight focus-visible:outline-2 focus-visible:outline-ink",
              value === o
                ? "border-moss bg-field"
                : "border-ink/20 bg-transparent"
            )}
            key={o}
            onClick={() => onPick(o)}
            type="button"
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}
