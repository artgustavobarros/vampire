import { Input } from "#/components/ui/input";
import { DotRating } from "#/components/vtm/dot-rating";
import { InfoButton, InfoTrigger } from "#/components/vtm/info-trigger";
import { EmptyState } from "#/components/vtm/text";
import type { Discipline, Power } from "#/lib/types";
import {
  patchSheet,
  useCharacterStore,
  useSheet,
} from "#/stores/character-store";

function updateDiscipline(index: number, change: Partial<Discipline>) {
  const disc = useCharacterStore
    .getState()
    .sheet.disc.map((d, i) => (i === index ? { ...d, ...change } : d));
  patchSheet({ disc });
}

export function DisciplinasTab() {
  const sheet = useSheet();

  return (
    <>
      {sheet.disc.map((d, i) => (
        <DisciplineCard discipline={d} index={i} key={i} />
      ))}
      {sheet.disc.length === 0 && (
        <EmptyState title="Nenhuma disciplina registrada">
          As disciplinas e os poderes são definidos na criação do personagem.
        </EmptyState>
      )}
    </>
  );
}

function DisciplineCard({
  discipline: d,
  index,
}: {
  discipline: Discipline;
  index: number;
}) {
  const setPowers = (powers: Power[]) => updateDiscipline(index, { powers });
  const label = d.nome || "Disciplina";

  return (
    <div className="mb-4 border border-line bg-surface">
      <div className="flex flex-wrap items-center gap-4 border-line-soft border-b p-4">
        <Input
          aria-label="Nome da disciplina"
          className="min-w-0 flex-[1_1_100%] font-semibold text-2xl leading-tight sm:flex-1"
          onChange={(e) => updateDiscipline(index, { nome: e.target.value })}
          placeholder="Disciplina"
          value={d.nome}
        />
        <InfoButton
          aria-label={`Sobre ${label}`}
          target={{ key: d.nome, kind: "disc", nivel: d.nivel || 0 }}
        />
        <DotRating
          className="flex-none gap-2"
          label={`Nível de ${label}`}
          onChange={(v) => updateDiscipline(index, { nivel: v })}
          value={d.nivel || 0}
        />
      </div>
      {d.powers.map((p, j) => {
        const desc = (p.desc ?? "").replace(/\s+/g, " ").trim();
        let summary = "sem descrição";
        if (desc) {
          summary = desc.length > 90 ? `${desc.slice(0, 90)}…` : desc;
        }
        const nome = p.nome || "Poder sem nome";
        return (
          <div className="flex items-stretch border-line-soft border-b" key={j}>
            <InfoTrigger
              className="flex min-h-12 min-w-0 flex-1 items-center gap-3 px-4 py-3 focus-visible:outline-ink focus-visible:-outline-offset-2"
              target={{
                desc: p.desc,
                disc: d.nome,
                key: p.nome,
                kind: "poder",
                nivel: p.nivel || 1,
              }}
            >
              <span className="grid size-6 flex-none place-items-center border border-line font-label font-semibold text-ink text-xs leading-none">
                {p.nivel || 1}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold text-xl leading-tight">
                  {nome}
                </span>
                <span className="mt-1 block text-base text-ink-soft">
                  {summary}
                </span>
              </span>
            </InfoTrigger>
            <button
              aria-label={`Remover ${nome}`}
              className="grid w-12 flex-none cursor-pointer place-items-center text-2xl text-ink-faint leading-none hover:text-blood focus-visible:outline-2 focus-visible:outline-ink focus-visible:-outline-offset-2"
              onClick={() => setPowers(d.powers.filter((_, k) => k !== j))}
              type="button"
            >
              ×
            </button>
          </div>
        );
      })}
    </div>
  );
}
