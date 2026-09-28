import { createFileRoute } from "@tanstack/react-router";
import { DmShell } from "#/features/dm/dm-shell";

export const Route = createFileRoute("/personagens/_painel")({
  component: DmShell,
});
