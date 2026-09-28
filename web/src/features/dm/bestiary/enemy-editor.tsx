import { useId, useState } from "react";
import { Button } from "#/components/ui/button";
import { ConfirmDialog } from "#/components/vtm/confirm-dialog";
import { RichTextEditor } from "#/components/vtm/rich-text";
import { DamageTrack } from "#/components/vtm/tracks";
import { useDebouncedSave } from "#/hooks/use-debounced-save";
import { type EnemyRecord, saveEnemy } from "#/lib/api";
import type { Enemy } from "#/lib/types";
import { cn } from "#/lib/utils";
import {
  cycleEnemyBox,
  ENEMY_TRACK_MAX,
  ENEMY_TRACK_MIN,
  type EnemyTrack,
  enemyMarks,
  enemyName,
  POOL_MAX,
  setTrackMax,
} from "#/rules/enemy";
import { STAT_LABEL } from "../status-card";

const FIELD =
  "min-h-12 w-full min-w-0 border border-line bg-white px-3 font-serif text-ink text-lg outline-none placeholder:text-ink-ghost focus:border-line-focus";
const SMALL_BTN =
  "grid size-9 flex-none cursor-pointer place-items-center border border-line bg-white font-label font-semibold text-ink leading-none focus-visible:outline-2 focus-visible:outline-ink disabled:cursor-not-allowed disabled:opacity-40";
const ADD_BTN =
  "cursor-pointer self-start font-label font-semibold text-blood text-xs uppercase leading-none tracking-[.12em] hover:underline focus-visible:outline-2 focus-visible:outline-ink";
const REMOVE_BTN =
  "grid size-9 flex-none cursor-pointer place-items-center text-ink-soft hover:text-blood focus-visible:outline-2 focus-visible:outline-ink";

const TRACKS: { label: string; track: EnemyTrack }[] = [
  { label: "Vitalidade", track: "vit" },
  { label: "Força de vontade", track: "fdv" },
];

interface EnemyEditorProps {
  autoFocus: boolean;
  /** trava os botões do rodapé enquanto uma ação está em andamento */
  busy: boolean;
  inRound: boolean;
  onDelete: () => void;
  onDuplicate: (enemy: Enemy) => void;
  onToggleRound: () => void;
  record: EnemyRecord;
}

/** Editor de um inimigo do Bestiário, com gravação automática. */
export function EnemyEditor({
  autoFocus,
  busy,
  inRound,
  onDelete,
  onDuplicate,
  onToggleRound,
  record,
}: EnemyEditorProps) {
  const [enemy, setEnemy] = useState(record.enemy);
  const [confirming, setConfirming] = useState(false);
  const visibleId = useId();
  const save = useDebouncedSave((value: Enemy, options) =>
    saveEnemy(record.id, value, options)
  );
  const name = enemyName(enemy.nome);

  const update = (next: Enemy) => {
    setEnemy(next);
    save.schedule(next);
  };

  return (
    <section
      aria-label={name}
      className="flex flex-col gap-4 border border-line border-t-4 border-t-ink bg-surface p-4"
    >
      <input
        aria-label="Nome do inimigo"
        autoFocus={autoFocus}
        className={cn(FIELD, "min-h-14 text-2xl")}
        maxLength={120}
        onChange={(e) => update({ ...enemy, nome: e.target.value })}
        placeholder="Nome do inimigo"
        value={enemy.nome}
      />

      <label
        className={cn(
          STAT_LABEL,
          "flex cursor-pointer items-center gap-3 text-ink"
        )}
        htmlFor={visibleId}
      >
        <input
          checked={enemy.visivel}
          className="size-5 cursor-pointer accent-ink"
          id={visibleId}
          onChange={(e) => update({ ...enemy, visivel: e.target.checked })}
          type="checkbox"
        />
        Jogadores veem os dados
      </label>

      {TRACKS.map(({ label, track }) => {
        const max = enemy[track === "vit" ? "vitMax" : "fdvMax"];
        return (
          <div className="flex flex-col gap-2" key={track}>
            <div className="flex items-center justify-between gap-3">
              <span className={cn(STAT_LABEL, "text-ink-soft")}>{label}</span>
              <div className="flex items-center gap-3">
                <button
                  aria-label={`Diminuir ${label}`}
                  className={SMALL_BTN}
                  disabled={max <= ENEMY_TRACK_MIN}
                  onClick={() => update(setTrackMax(enemy, track, max - 1))}
                  type="button"
                >
                  −
                </button>
                <output
                  aria-label={`${label} máxima`}
                  className="min-w-6 text-center font-bold font-label"
                >
                  {max}
                </output>
                <button
                  aria-label={`Aumentar ${label}`}
                  className={SMALL_BTN}
                  disabled={max >= ENEMY_TRACK_MAX}
                  onClick={() => update(setTrackMax(enemy, track, max + 1))}
                  type="button"
                >
                  +
                </button>
              </div>
            </div>
            <DamageTrack
              label={label}
              marks={enemyMarks(enemy, track)}
              onCycle={(i) => update(cycleEnemyBox(enemy, track, i))}
            />
          </div>
        );
      })}

      <div className="flex flex-col gap-2">
        <span className={cn(STAT_LABEL, "text-ink-soft")}>
          Paradas de dados
        </span>
        {enemy.paradas.map((pool, i) => (
          <div className="flex items-center gap-2" key={i}>
            <input
              aria-label={`Nome da parada ${i + 1}`}
              className={cn(FIELD, "flex-1")}
              maxLength={60}
              onChange={(e) =>
                update({
                  ...enemy,
                  paradas: enemy.paradas.map((p, k) =>
                    k === i ? { ...p, nome: e.target.value } : p
                  ),
                })
              }
              placeholder="Ataque, Esquiva…"
              value={pool.nome}
            />
            <input
              aria-label={`Dados da parada ${pool.nome || i + 1}`}
              className={cn(FIELD, "w-16 flex-none text-center")}
              inputMode="numeric"
              max={POOL_MAX}
              min={0}
              onChange={(e) => {
                const n = Number.parseInt(e.target.value, 10);
                const dados = Number.isNaN(n)
                  ? 0
                  : Math.min(POOL_MAX, Math.max(0, n));
                update({
                  ...enemy,
                  paradas: enemy.paradas.map((p, k) =>
                    k === i ? { ...p, dados } : p
                  ),
                });
              }}
              type="number"
              value={pool.dados}
            />
            <button
              aria-label={`Remover a parada ${pool.nome || i + 1}`}
              className={REMOVE_BTN}
              onClick={() =>
                update({
                  ...enemy,
                  paradas: enemy.paradas.filter((_, k) => k !== i),
                })
              }
              type="button"
            >
              ×
            </button>
          </div>
        ))}
        {enemy.paradas.length < 20 && (
          <button
            className={ADD_BTN}
            onClick={() =>
              update({
                ...enemy,
                paradas: [...enemy.paradas, { dados: 0, nome: "" }],
              })
            }
            type="button"
          >
            + Parada
          </button>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <span
          className={cn(STAT_LABEL, "border-line border-b pb-2 text-ink-soft")}
        >
          Especiais
        </span>
        {enemy.especiais.map((special, i) => (
          <div className="flex flex-col gap-2" key={i}>
            <div className="flex items-center gap-2">
              <input
                aria-label={`Nome do especial ${i + 1}`}
                className={cn(FIELD, "flex-1")}
                maxLength={80}
                onChange={(e) =>
                  update({
                    ...enemy,
                    especiais: enemy.especiais.map((s, k) =>
                      k === i ? { ...s, nome: e.target.value } : s
                    ),
                  })
                }
                placeholder="Garras, Presença…"
                value={special.nome}
              />
              <button
                aria-label={`Remover o especial ${special.nome || i + 1}`}
                className={REMOVE_BTN}
                onClick={() =>
                  update({
                    ...enemy,
                    especiais: enemy.especiais.filter((_, k) => k !== i),
                  })
                }
                type="button"
              >
                ×
              </button>
            </div>
            <RichTextEditor
              label={`Texto do especial ${special.nome || i + 1}`}
              onChange={(texto) =>
                update({
                  ...enemy,
                  especiais: enemy.especiais.map((s, k) =>
                    k === i ? { ...s, texto } : s
                  ),
                })
              }
              value={special.texto}
            />
          </div>
        ))}
        {enemy.especiais.length < 20 && (
          <button
            className={ADD_BTN}
            onClick={() =>
              update({
                ...enemy,
                especiais: [...enemy.especiais, { nome: "", texto: "" }],
              })
            }
            type="button"
          >
            + Especial
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3 border-line border-t pt-4">
        <Button
          disabled={busy}
          onClick={onToggleRound}
          size="sm"
          variant={inRound ? "default" : "outline"}
        >
          {inRound ? "Na rodada · tirar" : "Colocar na rodada"}
        </Button>
        <Button
          disabled={busy}
          onClick={() => {
            save.flush();
            onDuplicate(enemy);
          }}
          size="sm"
          variant="outline"
        >
          Duplicar
        </Button>
        <Button
          className="text-blood"
          disabled={busy}
          onClick={() => setConfirming(true)}
          size="sm"
          variant="ghost"
        >
          Excluir
        </Button>
      </div>

      <ConfirmDialog
        confirm="Excluir"
        onCancel={() => setConfirming(false)}
        onConfirm={() => {
          setConfirming(false);
          onDelete();
        }}
        open={confirming}
        text={`Excluir ${name} do bestiário?`}
      />
    </section>
  );
}
