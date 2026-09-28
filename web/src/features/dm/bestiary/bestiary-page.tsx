import { useState } from "react";
import { Button } from "#/components/ui/button";
import { useApiLoad } from "#/hooks/use-api-load";
import {
  createEnemy,
  deleteEnemy,
  type EnemyRecord,
  getRound,
  listEnemies,
  putRound,
} from "#/lib/api";
import { apiError } from "#/lib/toast";
import type { Enemy, RoundState } from "#/lib/types";
import { duplicateEnemy, NEW_ENEMY } from "#/rules/enemy";
import { add, includes, removeEntry, stateOf } from "#/rules/round";
import { STAT_LABEL } from "../status-card";
import { EnemyEditor } from "./enemy-editor";

interface Data {
  enemies: EnemyRecord[];
  round: RoundState;
}

const load = async (): Promise<Data> => {
  const [enemies, round] = await Promise.all([listEnemies(), getRound()]);
  return { enemies, round: stateOf(round) };
};

/** Aba Bestiário do Mestre: os inimigos salvos e o editor de cada um. */
export function BestiaryPage() {
  const [data, setData] = useApiLoad(load);
  const [created, setCreated] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const run = async (action: () => Promise<void>) => {
    setBusy(true);
    try {
      await action();
    } catch (err) {
      apiError(err);
    } finally {
      setBusy(false);
    }
  };

  const append = async (enemy: Enemy) => {
    const record = await createEnemy(enemy);
    setCreated(record.id);
    setData((d) => d && { ...d, enemies: [...d.enemies, record] });
  };

  return (
    <>
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className={`${STAT_LABEL} m-0 text-ink`}>Inimigos</h2>
        <Button
          disabled={busy || data === null}
          onClick={() => run(() => append(NEW_ENEMY))}
        >
          + Novo inimigo
        </Button>
      </div>
      {data === null && (
        <p
          aria-busy="true"
          className="text-ink-soft text-lg italic"
          role="status"
        >
          Carregando bestiário…
        </p>
      )}
      {data?.enemies.length === 0 && (
        <p className="text-ink-soft text-lg italic">
          Nenhum inimigo no bestiário ainda.
        </p>
      )}
      {data && data.enemies.length > 0 && (
        <ul className="m-0 flex list-none flex-col gap-5 p-0">
          {data.enemies.map((record) => {
            const inRound = includes(data.round, "inimigo", record.id);
            return (
              <li key={record.id}>
                <EnemyEditor
                  autoFocus={record.id === created}
                  busy={busy}
                  inRound={inRound}
                  onDelete={() =>
                    run(async () => {
                      await deleteEnemy(record.id);
                      setData(
                        (d) =>
                          d && {
                            enemies: d.enemies.filter(
                              (e) => e.id !== record.id
                            ),
                            round: removeEntry(d.round, "inimigo", record.id),
                          }
                      );
                    })
                  }
                  onDuplicate={(enemy) =>
                    run(() => append(duplicateEnemy(enemy)))
                  }
                  onToggleRound={() =>
                    run(async () => {
                      const next = inRound
                        ? removeEntry(data.round, "inimigo", record.id)
                        : add(data.round, "inimigo", record.id);
                      const saved = await putRound(next);
                      setData((d) => d && { ...d, round: stateOf(saved) });
                    })
                  }
                  record={record}
                />
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
