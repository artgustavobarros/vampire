import { createFileRoute, Navigate } from "@tanstack/react-router";
import { firstIncompleteStep } from "#/features/wizard/schema";
import { WIZARD_STEPS, WizardShell } from "#/features/wizard/wizard-shell";
import { useCharacterStore } from "#/stores/character-store";
import { usePlayerStore } from "#/stores/player-store";

interface CriarSearch {
  passo: number;
  /** edita o personagem existente em vez de exigir uma ficha nova */
  refazer?: boolean;
}

export const Route = createFileRoute("/criar")({
  component: Criar,
  validateSearch: (search: Record<string, unknown>): CriarSearch => {
    const n = Number(search.passo);
    const passo = Number.isInteger(n) && n >= 1 && n <= WIZARD_STEPS ? n : 1;
    return search.refazer === true || search.refazer === "true"
      ? { passo, refazer: true }
      : { passo };
  },
});

function Criar() {
  const { passo, refazer = false } = Route.useSearch();
  const user = usePlayerStore((s) => s.user);
  const sheet = useCharacterStore((s) => s.sheet);
  if (!user) {
    return <Navigate replace to="/entrar" />;
  }
  // um personagem por jogador: com a ficha criada, só dá para refazer
  if (sheet.criada && !refazer) {
    return <Navigate params={{ aba: "ficha" }} replace to="/ficha/$aba" />;
  }
  const first = firstIncompleteStep(sheet);
  if (passo > first) {
    return (
      <Navigate
        replace
        search={refazer ? { passo: first, refazer } : { passo: first }}
        to="/criar"
      />
    );
  }
  return <WizardShell refazer={refazer} step={passo} />;
}
