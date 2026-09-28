import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BootScreen } from "#/features/auth/boot-screen";
import { SheetLayout } from "#/features/sheet/sheet-layout";
import { ApiError } from "#/lib/api";
import { apiError, notify } from "#/lib/toast";
import { useCharacterStore } from "#/stores/character-store";

export const Route = createFileRoute("/personagens/$id")({
  component: PlayerSheet,
});

/** A ficha de um jogador, aberta pelo Mestre com o mesmo layout da ficha. */
function PlayerSheet() {
  const { id } = Route.useParams();
  const open = useCharacterStore((s) => s.owner?.userId === id);
  const [attempt, setAttempt] = useState(0);
  const [failed, setFailed] = useState(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: `attempt` só existe para abrir de novo
  useEffect(() => {
    let active = true;
    setFailed(false);
    useCharacterStore
      .getState()
      .openPlayerSheet(id)
      .then(() => {
        const { owner, sheet } = useCharacterStore.getState();
        if (active && owner?.userId === id && !sheet.criada) {
          notify("Este jogador ainda não criou o personagem.");
          setFailed(true);
        }
      })
      .catch((err: unknown) => {
        if (!active) {
          return;
        }
        // 401 já encerrou a sessão; 400/404 não adianta tentar de novo
        if (err instanceof ApiError && err.status < 500) {
          if (err.status !== 401) {
            notify(err.message);
            setFailed(true);
          }
          return;
        }
        apiError(err, () => setAttempt((n) => n + 1));
      });
    return () => {
      active = false;
    };
  }, [id, attempt]);

  if (failed) {
    return <Navigate replace to="/personagens" />;
  }
  if (!open) {
    return <BootScreen />;
  }
  return <SheetLayout tabs={{ id, to: "/personagens/$id/$aba" }} />;
}
