import { createFileRoute } from "@tanstack/react-router";
import { RoundPage } from "#/features/dm/round/round-page";

export const Route = createFileRoute("/personagens/_painel/rodada")({
  component: RoundPage,
});
