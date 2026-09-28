import type { ReactNode } from "react";
import { DamageTrack } from "#/components/vtm/tracks";
import type { DamageMark } from "#/lib/types";
import { cn } from "#/lib/utils";
import { summarize, type TrackSummary } from "./summary";

export const STAT_LABEL =
  "font-label font-semibold text-xs uppercase leading-none tracking-[.12em]";

/** "Vitalidade · 3/5" e as caixas da trilha, só para leitura ou não. */
export function TrackStat({
  label,
  marks,
  onCycle,
}: {
  label: string;
  marks: readonly DamageMark[];
  onCycle?: (index: number) => void;
}) {
  const atual = marks.filter((m) => m === 0).length;
  return (
    <div className="flex flex-col gap-1.5">
      <div className={cn(STAT_LABEL, "text-ink-soft")}>
        {label} · {atual}/{marks.length}
      </div>
      <DamageTrack label={label} marks={marks} onCycle={onCycle} />
    </div>
  );
}

/** Fome e as duas trilhas de um personagem. */
export function CharacterStats({
  fome,
  fdv,
  vit,
}: {
  fdv: TrackSummary;
  fome: number;
  vit: TrackSummary;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between gap-3">
        <span className={cn(STAT_LABEL, "text-blood")}>Fome</span>
        <span className="font-bold font-label text-2xl text-blood leading-none">
          {fome}
        </span>
      </div>
      <TrackStat label="Vitalidade" marks={vit.marks} />
      <TrackStat label="Força de vontade" marks={fdv.marks} />
    </div>
  );
}

/**
 * Cartão de um personagem (Coterie do Mestre e do jogador): nome, clã, Fome
 * e as trilhas só para leitura, com `footer` opcional (ex.: "Ver ficha").
 */
export function CharacterStatusCard({
  footer,
  sheet,
}: {
  footer?: ReactNode;
  sheet: unknown;
}) {
  const summary = summarize(sheet);
  if (!summary) {
    return null;
  }
  return (
    <article className="flex flex-col gap-3 border border-line bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="m-0 truncate font-semibold text-xl leading-tight">
            {summary.nome}
          </h3>
          {summary.cla ? (
            <div className="text-ink-soft">{summary.cla}</div>
          ) : null}
        </div>
        <div className="flex flex-none flex-col items-end gap-1">
          <span className={cn(STAT_LABEL, "text-blood")}>Fome</span>
          <span className="font-bold font-label text-2xl text-blood leading-none">
            {summary.fome}
          </span>
        </div>
      </div>
      <TrackStat label="Vitalidade" marks={summary.vit.marks} />
      <TrackStat label="Força de vontade" marks={summary.fdv.marks} />
      {footer ? (
        <div className="flex flex-wrap items-center gap-4 border-line border-t pt-3">
          {footer}
        </div>
      ) : null}
    </article>
  );
}
