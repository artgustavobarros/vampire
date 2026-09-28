import { useId } from "react";
import { DotRating } from "#/components/vtm/dot-rating";
import { InfoTrigger } from "#/components/vtm/info-trigger";
import {
  SegmentedTabs,
  SegmentedTabsContent,
  SegmentedTabsList,
  SegmentedTabsTrigger,
} from "#/components/vtm/segmented-tabs";
import { Chip } from "#/components/vtm/selectable";
import { EmptyState, Panel, SectionTitle } from "#/components/vtm/text";
import { RESONANCE_INTENSITIES, RESONANCES } from "#/data/fields";
import type { Discipline } from "#/lib/types";
import {
  patchSheet,
  useCharacterStore,
  useSheet,
} from "#/stores/character-store";

const PANEL_TITLE =
  "mt-0 mb-4 font-label font-semibold text-ink-soft text-xs uppercase leading-none tracking-[.12em]";
/** painel sempre montado: some só quando inativo abaixo de lg */
const TAB_PANE = "max-lg:data-[state=inactive]:hidden";
/** sem escolha gravada, a ficha vale como "Sem ressonância" */
const NO_RESONANCE = "Sem ressonância";

function updateDiscipline(index: number, change: Partial<Discipline>) {
  const disc = useCharacterStore
    .getState()
    .sheet.disc.map((d, i) => (i === index ? { ...d, ...change } : d));
  patchSheet({ disc });
}

export function DisciplinasTab() {
  const sheet = useSheet();
  const resonanceTitleId = useId();
  const discTitleId = useId();

  return (
    // abaixo de lg, um bloco por vez; a partir de lg, os dois
    <SegmentedTabs className="flex flex-col gap-8" defaultValue="ressonancia">
      <SegmentedTabsList className="-mb-3 lg:hidden">
        <SegmentedTabsTrigger value="ressonancia">
          Ressonância
        </SegmentedTabsTrigger>
        <SegmentedTabsTrigger value="disciplinas">
          Disciplinas
        </SegmentedTabsTrigger>
      </SegmentedTabsList>

      <SegmentedTabsContent
        aria-labelledby={resonanceTitleId}
        className={TAB_PANE}
        forceMount
        value="ressonancia"
      >
        <ResonancePanel titleId={resonanceTitleId} />
      </SegmentedTabsContent>

      <SegmentedTabsContent
        aria-labelledby={discTitleId}
        className={TAB_PANE}
        forceMount
        value="disciplinas"
      >
        <SectionTitle className="max-lg:hidden" id={discTitleId}>
          Disciplinas
        </SectionTitle>
        {sheet.disc.map((d, i) => (
          <DisciplineCard discipline={d} index={i} key={i} />
        ))}
        {sheet.disc.length === 0 && (
          <EmptyState title="Nenhuma disciplina registrada">
            As disciplinas e os poderes são definidos na criação do personagem.
          </EmptyState>
        )}
      </SegmentedTabsContent>
    </SegmentedTabs>
  );
}

function ResonancePanel({ titleId }: { titleId: string }) {
  const sheet = useSheet();
  const ressonancia = sheet.ressonancia || NO_RESONANCE;
  return (
    <Panel className="p-6">
      <h3 className={PANEL_TITLE} id={titleId}>
        <InfoTrigger
          target={{
            atual: [ressonancia, sheet.resIntensidade]
              .filter(Boolean)
              .join(" · "),
            kind: "ressonancia",
            marca: ressonancia,
          }}
        >
          Ressonância
        </InfoTrigger>
      </h3>
      <div className="flex flex-wrap gap-2">
        {RESONANCES.map((r) => (
          <Chip
            key={r}
            onClick={() => patchSheet({ ressonancia: r })}
            selected={ressonancia === r}
          >
            {r}
          </Chip>
        ))}
      </div>
      <div className="mt-4 mb-2 font-label font-semibold text-ink-faint text-xs uppercase leading-none tracking-[.12em]">
        Intensidade
      </div>
      <div className="flex flex-wrap gap-2">
        {RESONANCE_INTENSITIES.map((r) => (
          <Chip
            key={r}
            onClick={() =>
              patchSheet({
                resIntensidade: sheet.resIntensidade === r ? "" : r,
              })
            }
            selected={sheet.resIntensidade === r}
          >
            {r}
          </Chip>
        ))}
      </div>
    </Panel>
  );
}

function DisciplineCard({
  discipline: d,
  index,
}: {
  discipline: Discipline;
  index: number;
}) {
  const label = d.nome || "Disciplina";

  return (
    <div className="mb-4 border border-line bg-surface">
      <div className="flex flex-wrap items-center gap-4 border-line-soft border-b p-4">
        <InfoTrigger
          className="min-w-0 flex-[1_1_100%] font-semibold text-2xl leading-tight sm:flex-1"
          target={{ key: d.nome, kind: "disc", nivel: d.nivel || 0 }}
        >
          {label}
        </InfoTrigger>
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
          <InfoTrigger
            className="flex min-h-12 w-full min-w-0 items-start gap-3 border-line-soft border-b px-4 py-3 focus-visible:outline-ink focus-visible:-outline-offset-2"
            key={j}
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
        );
      })}
    </div>
  );
}
