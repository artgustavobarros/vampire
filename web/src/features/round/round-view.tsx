import type { ReactNode } from "react";
import { RichText } from "#/components/vtm/rich-text";
import {
  CharacterStats,
  STAT_LABEL,
  TrackStat,
} from "#/features/dm/status-card";
import { summarize } from "#/features/dm/summary";
import type { RoundView, RoundViewEntry } from "#/lib/api";
import { cn } from "#/lib/utils";
import type { EnemyTrack } from "#/rules/enemy";
import { enemyName } from "#/rules/enemy";
import { trackBoxes } from "#/rules/tracks";

/** Nome do participante como aparece nos cartões e na ordem. */
export function entryName(entry: RoundViewEntry): string {
  if (entry.tipo === "inimigo") {
    return enemyName(entry.nome);
  }
  return summarize(entry.sheet)?.nome ?? "Sem nome";
}

export type RoundMode = "mestre" | "jogador";

function typeLabel(entry: RoundViewEntry, mode: RoundMode): string {
  if (entry.tipo === "jogador") {
    return "Jogador";
  }
  if (mode === "jogador") {
    return "Inimigo";
  }
  return entry.visivel
    ? "Inimigo · visível aos jogadores"
    : "Inimigo · oculto aos jogadores";
}

/** "Rodada N" e "Vez de <nome>", com as ações do Mestre à direita. */
export function RoundTitle({
  actions,
  view,
}: {
  actions?: ReactNode;
  view: RoundView;
}) {
  const current = view.ordem[view.vez];
  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <h2 className="m-0 font-semibold text-4xl leading-tight">
          Rodada {view.rodada}
        </h2>
        {current ? (
          <span className={cn(STAT_LABEL, "text-ink-soft")}>
            Vez de {entryName(current)}
          </span>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}

function EnemyBody({
  entry,
  onCycle,
}: {
  entry: Extract<RoundViewEntry, { tipo: "inimigo" }>;
  onCycle?: (track: EnemyTrack, index: number) => void;
}) {
  const { dados } = entry;
  if (!dados) {
    return (
      <p className="m-0 text-ink-soft italic">Dados ocultos pelo Mestre.</p>
    );
  }
  return (
    <>
      <TrackStat
        label="Vitalidade"
        marks={trackBoxes(dados.vit, dados.vitMax)}
        onCycle={onCycle && ((i) => onCycle("vit", i))}
      />
      <TrackStat
        label="Força de vontade"
        marks={trackBoxes(dados.fdv, dados.fdvMax)}
        onCycle={onCycle && ((i) => onCycle("fdv", i))}
      />
      {dados.paradas.length > 0 && (
        <ul className="m-0 flex list-none flex-wrap gap-x-4 gap-y-1 p-0">
          {dados.paradas.map((p, i) => (
            <li className="text-lg" key={i}>
              {p.nome || "Parada"}{" "}
              <span className="font-bold font-label">{p.dados}</span>
            </li>
          ))}
        </ul>
      )}
      {dados.especiais.map((s, i) => (
        <div className="border-line border-t pt-2" key={i}>
          <div className={cn(STAT_LABEL, "text-blood")}>
            {s.nome || "Especial"}
          </div>
          <RichText className="mt-1 text-lg" html={s.texto} />
        </div>
      ))}
    </>
  );
}

interface RoundCardProps {
  current: boolean;
  entry: RoundViewEntry;
  mode: RoundMode;
  onCycleEnemy?: (track: EnemyTrack, index: number) => void;
  position: number;
}

function RoundCard({
  current,
  entry,
  mode,
  onCycleEnemy,
  position,
}: RoundCardProps) {
  const summary = entry.tipo === "jogador" ? summarize(entry.sheet) : null;
  return (
    <article
      aria-current={current ? "step" : undefined}
      aria-label={entryName(entry)}
      className={cn(
        "flex flex-col gap-3 border border-t-4 p-4",
        current
          ? "border-blood border-t-ink bg-white shadow-[0_12px_32px_rgba(122,17,32,.18)]"
          : "border-line border-t-blood bg-surface"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <span
            className={cn(
              "grid size-7 flex-none place-items-center font-bold font-label text-sm text-white",
              current ? "bg-blood" : "bg-ink"
            )}
          >
            {position}
          </span>
          <div className="min-w-0">
            <h3 className="m-0 font-semibold text-xl leading-tight">
              {entryName(entry)}
            </h3>
            <div
              className={cn(
                STAT_LABEL,
                "mt-1 leading-snug",
                entry.tipo === "jogador" ? "text-blood" : "text-ink-soft"
              )}
            >
              {typeLabel(entry, mode)}
            </div>
          </div>
        </div>
        <div className="flex flex-none flex-col items-end gap-1">
          <span className={cn(STAT_LABEL, "text-ink-soft")}>Inic.</span>
          <span className="font-bold font-label text-lg leading-none">
            {entry.iniciativa ?? "—"}
          </span>
        </div>
      </div>
      {current ? (
        <span className="self-start bg-blood px-2 py-1 font-label font-semibold text-white text-xs uppercase leading-none tracking-[.12em]">
          Vez de agir
        </span>
      ) : null}
      {entry.tipo === "inimigo" && (
        <EnemyBody entry={entry} onCycle={onCycleEnemy} />
      )}
      {summary !== null && (
        <CharacterStats
          fdv={summary.fdv}
          fome={summary.fome}
          vit={summary.vit}
        />
      )}
    </article>
  );
}

interface RoundCardsProps {
  mode: RoundMode;
  /** só o Mestre: tocar na caixa de um inimigo cicla o dano */
  onCycleEnemy?: (entryIndex: number, track: EnemyTrack, index: number) => void;
  view: RoundView;
}

/** Os cartões da rodada, na ordem, com a vez destacada. */
export function RoundCards({ mode, onCycleEnemy, view }: RoundCardsProps) {
  return (
    <ol className="m-0 grid list-none gap-4 p-0 sm:grid-cols-2 md:grid-cols-3">
      {view.ordem.map((entry, i) => (
        <li key={`${entry.tipo}:${entry.id}`}>
          <RoundCard
            current={i === view.vez}
            entry={entry}
            mode={mode}
            onCycleEnemy={
              onCycleEnemy && ((track, box) => onCycleEnemy(i, track, box))
            }
            position={i + 1}
          />
        </li>
      ))}
    </ol>
  );
}
