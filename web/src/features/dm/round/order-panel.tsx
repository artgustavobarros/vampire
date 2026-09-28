import { useId } from "react";
import { Button } from "#/components/ui/button";
import { entryName } from "#/features/round/round-view";
import type { EnemyRecord, PlayerSheetResponse, RoundView } from "#/lib/api";
import { cn } from "#/lib/utils";
import { enemyName } from "#/rules/enemy";
import { INITIATIVE_MAX } from "#/rules/round";
import { STAT_LABEL } from "../status-card";
import { summarize } from "../summary";

const ARROW =
  "grid size-10 flex-none cursor-pointer place-items-center border border-line bg-white font-label text-lg text-ink leading-none focus-visible:outline-2 focus-visible:outline-ink disabled:cursor-not-allowed disabled:opacity-40";
const SELECT =
  "min-h-11 w-full cursor-pointer border border-line bg-white px-3 font-serif text-ink text-lg disabled:cursor-not-allowed disabled:opacity-45";

interface OrderPanelProps {
  /** inimigos do Bestiário fora da rodada */
  freeEnemies: EnemyRecord[];
  /** jogadores com personagem criado fora da rodada */
  freePlayers: PlayerSheetResponse[];
  onAddEnemy: (id: string) => void;
  onAddPlayer: (userId: string) => void;
  onClear: () => void;
  onInitiative: (index: number, value: number | null) => void;
  onMove: (index: number, dir: -1 | 1) => void;
  onRemove: (index: number) => void;
  onSort: () => void;
  view: RoundView;
}

/** "Ordem da rodada": iniciativa, ↑/↓, ×, colocar, ordenar e esvaziar. */
export function OrderPanel({
  freeEnemies,
  freePlayers,
  onAddEnemy,
  onAddPlayer,
  onClear,
  onInitiative,
  onMove,
  onRemove,
  onSort,
  view,
}: OrderPanelProps) {
  const playerSelect = useId();
  const enemySelect = useId();
  const last = view.ordem.length - 1;

  return (
    <section
      aria-labelledby="ordem-da-rodada"
      className="flex flex-col gap-4 border border-line bg-surface p-4 md:max-w-[50%]"
    >
      <h2 className={cn(STAT_LABEL, "m-0 text-ink")} id="ordem-da-rodada">
        Ordem da rodada
      </h2>
      {view.ordem.length === 0 ? (
        <p className="m-0 text-ink-soft text-lg italic">
          Ninguém na rodada ainda.
        </p>
      ) : (
        <ol className="m-0 flex list-none flex-col p-0">
          {view.ordem.map((entry, i) => {
            const name = entryName(entry);
            return (
              <li
                className="flex items-center gap-2 border-line border-t py-2"
                key={`${entry.tipo}:${entry.id}`}
              >
                <span className="w-5 flex-none font-label text-ink-soft text-sm">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-lg leading-tight">{name}</div>
                  <div
                    className={cn(
                      STAT_LABEL,
                      "mt-0.5",
                      entry.tipo === "jogador" ? "text-blood" : "text-ink-soft"
                    )}
                  >
                    {entry.tipo === "jogador" ? "Jogador" : "Inimigo"}
                  </div>
                </div>
                <input
                  aria-label={`Iniciativa de ${name}`}
                  className="h-10 w-14 flex-none border border-line bg-white text-center font-label text-ink"
                  inputMode="numeric"
                  max={INITIATIVE_MAX}
                  min={0}
                  onChange={(e) => {
                    const n = Number.parseInt(e.target.value, 10);
                    onInitiative(i, Number.isNaN(n) ? null : n);
                  }}
                  type="number"
                  value={entry.iniciativa ?? ""}
                />
                <button
                  aria-label={`Subir ${name}`}
                  className={ARROW}
                  disabled={i === 0}
                  onClick={() => onMove(i, -1)}
                  type="button"
                >
                  ↑
                </button>
                <button
                  aria-label={`Descer ${name}`}
                  className={ARROW}
                  disabled={i === last}
                  onClick={() => onMove(i, 1)}
                  type="button"
                >
                  ↓
                </button>
                <button
                  aria-label={`Tirar ${name} da rodada`}
                  className="grid size-8 flex-none cursor-pointer place-items-center text-ink-soft hover:text-blood focus-visible:outline-2 focus-visible:outline-ink"
                  onClick={() => onRemove(i)}
                  type="button"
                >
                  ×
                </button>
              </li>
            );
          })}
        </ol>
      )}

      <div className="grid gap-2 sm:grid-cols-2">
        <label className="sr-only" htmlFor={playerSelect}>
          Colocar personagem na rodada
        </label>
        <select
          className={SELECT}
          disabled={freePlayers.length === 0}
          id={playerSelect}
          onChange={(e) => e.target.value && onAddPlayer(e.target.value)}
          value=""
        >
          <option value="">+ Colocar personagem…</option>
          {freePlayers.map((p) => (
            <option key={p.user.id} value={p.user.id}>
              {summarize(p.sheet)?.nome ?? p.user.name}
            </option>
          ))}
        </select>
        <label className="sr-only" htmlFor={enemySelect}>
          Colocar inimigo na rodada
        </label>
        <select
          className={SELECT}
          disabled={freeEnemies.length === 0}
          id={enemySelect}
          onChange={(e) => e.target.value && onAddEnemy(e.target.value)}
          value=""
        >
          <option value="">+ Colocar inimigo…</option>
          {freeEnemies.map((r) => (
            <option key={r.id} value={r.id}>
              {enemyName(r.enemy.nome)}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          disabled={view.ordem.length < 2}
          onClick={onSort}
          size="sm"
          variant="outline"
        >
          Ordenar por iniciativa
        </Button>
        <Button
          className="text-blood"
          disabled={view.ordem.length === 0}
          onClick={onClear}
          size="sm"
          variant="outline"
        >
          Esvaziar
        </Button>
      </div>
    </section>
  );
}
