import { createFileRoute, Navigate } from "@tanstack/react-router";
import { firstIncompleteStep } from "#/features/wizard/schema";
import { WIZARD_STEPS, WizardShell } from "#/features/wizard/wizard-shell";
import { useCharacterStore } from "#/stores/character-store";
import { usePlayerStore } from "#/stores/player-store";

interface CriarSearch {
  passo: number;
}

export const Route = createFileRoute("/criar")({
  component: Criar,
  validateSearch: (search: Record<string, unknown>): CriarSearch => {
    const n = Number(search.passo);
    const passo = Number.isInteger(n) && n >= 1 && n <= WIZARD_STEPS ? n : 1;
    return { passo };
  },
});

function Criar() {
  const { passo } = Route.useSearch();
  const user = usePlayerStore((s) => s.user);
  const role = usePlayerStore((s) => s.role);
  const sheet = useCharacterStore((s) => s.sheet);
  if (!user) {
    return <Navigate replace to="/entrar" />;
  }
  if (role === "dm") {
    return <Navigate replace to="/personagens" />;
  }
  // um personagem por jogador; criado, Atributos e Habilidades são do Mestre
  if (sheet.criada) {
    return (
      <Navigate params={{ aba: "caracteristicas" }} replace to="/ficha/$aba" />
    );
  }
  const first = firstIncompleteStep(sheet);
  if (passo > first) {
    return <Navigate replace search={{ passo: first }} to="/criar" />;
  }
  return <WizardShell step={passo} />;
}
