import { createFileRoute } from "@tanstack/react-router";
import { BestiaryPage } from "#/features/dm/bestiary/bestiary-page";

export const Route = createFileRoute("/personagens/_painel/bestiario")({
  component: BestiaryPage,
});
