import { useEffect, useState } from "react";
import { listSheets, type PlayerSheetResponse } from "#/lib/api";
import { apiError } from "#/lib/toast";
import { flushSheet } from "#/stores/character-store";
import { CharacterCard } from "./character-card";
import { summarize } from "./summary";

/** Lista de personagens do Mestre: todos os jogadores e suas fichas. */
export function CharacterList() {
  const [players, setPlayers] = useState<PlayerSheetResponse[] | null>(null);
  const [attempt, setAttempt] = useState(0);

  // biome-ignore lint/correctness/useExhaustiveDependencies: `attempt` só existe para buscar de novo
  useEffect(() => {
    let active = true;
    // o que o Mestre acabou de mudar numa ficha entra na lista
    flushSheet()
      .then(listSheets)
      .then((list) => {
        if (active) {
          setPlayers(list);
        }
      })
      .catch((err: unknown) => {
        if (active) {
          apiError(err, () => setAttempt((n) => n + 1));
        }
      });
    return () => {
      active = false;
    };
  }, [attempt]);

  return (
    <>
      <p className="mt-0 mb-5 max-w-[60ch] text-ink-soft text-lg">
        Fichas de todos os jogadores. Abra qualquer uma para consultar ou
        ajustar.
      </p>
      {players === null && (
        <p
          aria-busy="true"
          className="text-ink-soft text-lg italic"
          role="status"
        >
          Carregando fichas…
        </p>
      )}
      {players?.length === 0 && (
        <p className="text-ink-soft text-lg italic">
          Nenhum jogador cadastrado ainda.
        </p>
      )}
      {players && players.length > 0 && (
        <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0">
          {players.map(({ sheet, user }) => (
            <li key={user.id}>
              <CharacterCard summary={summarize(sheet)} user={user} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
