import { createFileRoute, Navigate } from "@tanstack/react-router";
import { WizardShell } from "#/features/wizard/wizard-shell";
import { useAppState } from "#/lib/store";

interface CriarSearch {
  passo: number;
}

export const Route = createFileRoute("/criar")({
  component: Criar,
  validateSearch: (search: Record<string, unknown>): CriarSearch => {
    const n = Number(search.passo);
    return { passo: Number.isInteger(n) && n >= 1 && n <= 8 ? n : 1 };
  },
});

function Criar() {
  const { passo } = Route.useSearch();
  const { user } = useAppState();
  if (!user) {
    return <Navigate replace to="/entrar" />;
  }
  return <WizardShell step={passo} />;
}
