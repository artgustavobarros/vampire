import { createFileRoute } from "@tanstack/react-router";
import { CharacterList } from "#/features/dm/character-list";

export const Route = createFileRoute("/personagens/")({
  component: CharacterList,
});
