import type { PowerTemplate } from "#/data/disciplines";
import { cn } from "#/lib/utils";
import { InfoTrigger } from "./info-trigger";

/** Cartão de poder: o cartão todo alterna a escolha; o nome abre o painel do poder. */
export function PowerCard({
  disc,
  power,
  selected,
  onToggle,
}: {
  disc: string;
  power: PowerTemplate;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={cn(
        "relative min-h-12 max-w-70 border p-3",
        selected
          ? "border-ink bg-ink text-white"
          : "border-line bg-transparent text-ink"
      )}
    >
      <InfoTrigger
        className="relative z-10 inline-block font-label font-semibold text-xs leading-tight"
        onDark={selected}
        target={{ disc, key: power.name, kind: "poder", nivel: power.level }}
      >
        {power.name}
      </InfoTrigger>
      {/* camada que estende o clique ao cartão todo, abaixo do nome */}
      <button
        aria-label={`${selected ? "Remover" : "Incluir"} ${power.name}`}
        aria-pressed={selected}
        className="block cursor-pointer text-left outline-none after:absolute after:inset-0 after:content-[''] focus-visible:after:outline-2 focus-visible:after:outline-ink focus-visible:after:outline-offset-2"
        onClick={onToggle}
        type="button"
      >
        <span className="mt-0.5 block text-sm leading-snug opacity-70">
          Nível {power.level} · {power.cost}
        </span>
      </button>
    </div>
  );
}
