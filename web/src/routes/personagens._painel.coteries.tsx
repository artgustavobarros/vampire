import { createFileRoute } from "@tanstack/react-router";
import { CoteriesPage } from "#/features/dm/coteries/coteries-page";

export const Route = createFileRoute("/personagens/_painel/coteries")({
  component: CoteriesPage,
});
