import { useRef, useState } from "react";
import { RoundCards, RoundTitle } from "#/features/round/round-view";
import { usePolling } from "#/hooks/use-polling";
import { getRound, type RoundView } from "#/lib/api";
import { apiError } from "#/lib/toast";

/**
 * Aba Rodada do jogador: a rodada do Mestre só para leitura, atualizada a
 * cada 5 s. Inimigos ocultos chegam sem os dados.
 */
export function RodadaTab() {
  const [view, setView] = useState<RoundView | null>(null);
  /** só a primeira carga (ou o "Tentar de novo") avisa a falha */
  const first = useRef(true);

  const refresh = async () => {
    const warn = first.current;
    first.current = false;
    try {
      setView(await getRound());
    } catch (err) {
      // falha periódica não abre toast
      if (warn === true) {
        apiError(err, () => {
          first.current = true;
          refresh();
        });
      }
    }
  };
  usePolling(refresh);

  if (view === null) {
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
  return (
    <section>
      <RoundTitle view={view} />
      {view.ordem.length === 0 ? (
        <p className="text-ink-soft text-lg italic">
          Nenhum combate em andamento.
        </p>
      ) : (
        <RoundCards mode="jogador" view={view} />
      )}
    </section>
  );
}
