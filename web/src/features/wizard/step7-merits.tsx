import { Input } from "#/components/ui/input";
import { DotRating } from "#/components/vtm/dot-rating";
import { EmptyState } from "#/components/vtm/text";
import { patchSheet, useSheet } from "#/lib/store";
import type { Merit } from "#/lib/types";
import { cn } from "#/lib/utils";
import { meritTotals } from "#/rules/wizard";

const ACTION =
  "font-label font-semibold text-xs uppercase leading-none tracking-widest";

export function Step7Merits() {
  const sheet = useSheet();
  const merits = sheet.meritos ?? [];
  const totals = meritTotals(sheet);
  const update = (i: number, change: Partial<Merit>) =>
    patchSheet({
      meritos: merits.map((m, j) => (j === i ? { ...m, ...change } : m)),
    });

  return (
    <>
      <div className={cn(ACTION, "mb-3 flex gap-4 text-ink-soft")}>
        <span>{totals.vantagens} pts em vantagens</span>
        <span>{totals.defeitos} pts em defeitos</span>
      </div>
      {merits.map((m, i) => (
        <div
          className="flex flex-wrap items-center gap-3 border-line-soft border-b py-2"
          key={i}
        >
          <button
            className={cn(
              ACTION,
              "cursor-pointer whitespace-nowrap px-2 py-1",
              m.tipo === "defeito" ? "bg-blood text-white" : "bg-ink text-white"
            )}
            onClick={() =>
              update(i, { tipo: m.tipo === "defeito" ? "vantagem" : "defeito" })
            }
            title="Alternar vantagem/defeito"
            type="button"
          >
            {m.tipo === "defeito" ? "Defeito" : "Vantagem"}
          </button>
          <Input
            aria-label="Nome"
            className="min-w-[140px] flex-1"
            onChange={(e) => update(i, { nome: e.target.value })}
            placeholder="Nome"
            value={m.nome}
          />
          <DotRating
            label={`Pontos de ${m.nome || "linha"}`}
            onChange={(v) => update(i, { pontos: v })}
            size="sm"
            value={m.pontos}
          />
          <button
            className={cn(ACTION, "cursor-pointer text-ink/55")}
            onClick={() =>
              patchSheet({ meritos: merits.filter((_, j) => j !== i) })
            }
            type="button"
          >
            Remover
          </button>
        </div>
      ))}
      {merits.length === 0 && (
        <EmptyState title="Nenhum mérito ou defeito">
          Méritos custam pontos positivos; defeitos devolvem pontos. Adicione o
          primeiro abaixo.
        </EmptyState>
      )}
      <button
        className={cn(
          ACTION,
          "mt-3 inline-block cursor-pointer border border-line px-3 py-2"
        )}
        onClick={() =>
          patchSheet({
            meritos: [...merits, { nome: "", pontos: 1, tipo: "vantagem" }],
          })
        }
        type="button"
      >
        Adicionar
      </button>
    </>
  );
}
