import { useRef, useState } from "react";
import { Button } from "#/components/ui/button";
import { ConfirmDialog } from "#/components/vtm/confirm-dialog";
import { RoundCards, RoundTitle } from "#/features/round/round-view";
import { useApiLoad } from "#/hooks/use-api-load";
import { useDebouncedSave } from "#/hooks/use-debounced-save";
import {
  type EnemyRecord,
  getRound,
  listEnemies,
  listSheets,
  type PlayerSheetResponse,
  putRound,
  type RoundView,
  type RoundViewEntry,
  saveEnemy,
} from "#/lib/api";
import { apiError } from "#/lib/toast";
import type { Enemy, RoundState } from "#/lib/types";
import type { EnemyTrack } from "#/rules/enemy";
import {
  add,
  canPrev,
  clear,
  includes,
  move,
  next,
  prev,
  remove,
  restart,
  setInitiative,
  sortByInitiative,
  stateOf,
} from "#/rules/round";
import { cycleBox, trackBoxes } from "#/rules/tracks";
import { summarize } from "../summary";
import { OrderPanel } from "./order-panel";

interface Data {
  enemies: EnemyRecord[];
  players: PlayerSheetResponse[];
  view: RoundView;
}

const load = async (): Promise<Data> => {
  const [view, players, enemies] = await Promise.all([
    getRound(),
    listSheets(),
    listEnemies(),
  ]);
  return { enemies, players, view };
};

const keyOf = (e: { id: string; tipo: string }) => `${e.tipo}:${e.id}`;

/** A visão com o novo estado, usando os dados já conhecidos de cada um. */
function viewOf(state: RoundState, data: Data): RoundView {
  const known = new Map(data.view.ordem.map((e) => [keyOf(e), e]));
  const ordem = state.ordem.flatMap((e): RoundViewEntry[] => {
    const old = known.get(keyOf(e));
    if (old) {
      return [{ ...old, iniciativa: e.iniciativa }];
    }
    if (e.tipo === "jogador") {
      const player = data.players.find((p) => p.user.id === e.id);
      return [{ ...e, sheet: player?.sheet ?? null, tipo: "jogador" }];
    }
    const record = data.enemies.find((r) => r.id === e.id);
    if (!record) {
      return [];
    }
    const { nome, visivel, ...dados } = record.enemy;
    return [{ ...e, dados, nome, tipo: "inimigo", visivel }];
  });
  return { ...data.view, ordem, rodada: state.rodada, vez: state.vez };
}

/** Aba Rodada do Mestre. As mudanças aparecem na hora e são gravadas em fila. */
export function RoundPage() {
  const [data, setData] = useApiLoad(load);
  const [confirming, setConfirming] = useState(false);
  const dataRef = useRef(data);
  dataRef.current = data;
  const queue = useRef<Promise<unknown>>(Promise.resolve());

  const reload = async () => {
    try {
      setData(await load());
    } catch (err) {
      apiError(err);
    }
  };

  /** Grava em ordem; uma falha avisa e recarrega o que está na API. */
  const enqueue = (write: () => Promise<unknown>) => {
    queue.current = queue.current
      .then(write)
      .catch((err: unknown) => apiError(err, reload));
  };

  const saveRound = () => {
    const { current } = dataRef;
    if (current) {
      enqueue(() => putRound(stateOf(current.view)));
    }
  };
  // a iniciativa grava 500 ms depois da última tecla, com o estado mais novo
  const initiative = useDebouncedSave(() => {
    saveRound();
    return Promise.resolve();
  });

  if (data === null) {
    return (
      <p
        aria-busy="true"
        className="text-ink-soft text-lg italic"
        role="status"
      >
        Carregando rodada…
      </p>
    );
  }

  const state = stateOf(data.view);
  const commit = (nextState: RoundState) => {
    const view = viewOf(nextState, data);
    const nextData = { ...data, view };
    dataRef.current = nextData;
    setData(nextData);
    enqueue(() => putRound(stateOf(view)));
  };

  const cycleEnemy = (entryIndex: number, track: EnemyTrack, box: number) => {
    const entry = data.view.ordem[entryIndex];
    if (entry?.tipo !== "inimigo" || !entry.dados) {
      return;
    }
    const max = track === "vit" ? entry.dados.vitMax : entry.dados.fdvMax;
    const dados = {
      ...entry.dados,
      [track]: cycleBox(trackBoxes(entry.dados[track], max), box),
    };
    const enemy: Enemy = { ...dados, nome: entry.nome, visivel: entry.visivel };
    const view = {
      ...data.view,
      ordem: data.view.ordem.map((e, i) =>
        i === entryIndex ? { ...entry, dados } : e
      ),
    };
    const enemies = data.enemies.map((r) =>
      r.id === entry.id ? { ...r, enemy } : r
    );
    setData({ ...data, enemies, view });
    enqueue(() => saveEnemy(entry.id, enemy));
  };

  const freePlayers = data.players.filter(
    (p) => summarize(p.sheet) !== null && !includes(state, "jogador", p.user.id)
  );
  const freeEnemies = data.enemies.filter(
    (r) => !includes(state, "inimigo", r.id)
  );
  const empty = state.ordem.length === 0;

  return (
    <>
      <RoundTitle
        actions={
          <>
            <Button
              disabled={!canPrev(state)}
              onClick={() => commit(prev(state))}
              variant="outline"
            >
              ◀ Anterior
            </Button>
            <Button
              disabled={empty}
              onClick={() => commit(next(state))}
              variant="destructive"
            >
              Próximo ▶
            </Button>
            <Button onClick={() => commit(restart(state))} variant="outline">
              Reiniciar
            </Button>
          </>
        }
        view={data.view}
      />
      {!empty && (
        <div className="mb-6">
          <RoundCards
            mode="mestre"
            onCycleEnemy={cycleEnemy}
            view={data.view}
          />
        </div>
      )}
      <OrderPanel
        freeEnemies={freeEnemies}
        freePlayers={freePlayers}
        onAddEnemy={(id) => commit(add(state, "inimigo", id))}
        onAddPlayer={(id) => commit(add(state, "jogador", id))}
        onClear={() => setConfirming(true)}
        onInitiative={(i, value) => {
          const view = viewOf(setInitiative(state, i, value), data);
          const nextData = { ...data, view };
          dataRef.current = nextData;
          setData(nextData);
          initiative.schedule(null);
        }}
        onMove={(i, dir) => commit(move(state, i, dir))}
        onRemove={(i) => commit(remove(state, i))}
        onSort={() => commit(sortByInitiative(state))}
        view={data.view}
      />
      <ConfirmDialog
        confirm="Esvaziar"
        onCancel={() => setConfirming(false)}
        onConfirm={() => {
          setConfirming(false);
          commit(clear());
        }}
        open={confirming}
        text="Esvaziar a rodada?"
      />
    </>
  );
}
