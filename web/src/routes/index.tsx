import { createFileRoute, Navigate } from "@tanstack/react-router";
import { homeTarget } from "#/features/auth/home-path";
import { useCharacterStore } from "#/stores/character-store";
import { usePlayerStore } from "#/stores/player-store";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const user = usePlayerStore((s) => s.user);
  const criada = useCharacterStore((s) => s.sheet.criada);
  const target = homeTarget({ criada, user });
  return target === "/criar" ? (
    <Navigate replace search={{ passo: 1 }} to="/criar" />
  ) : (
    <Navigate replace to={target} />
  );
}
