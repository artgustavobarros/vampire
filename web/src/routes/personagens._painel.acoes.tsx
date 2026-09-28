import { createFileRoute } from "@tanstack/react-router";
import { ResonanceRollTab } from "#/features/dm/resonance-roll";

export const Route = createFileRoute("/personagens/_painel/acoes")({
  component: ResonanceRollTab,
});
