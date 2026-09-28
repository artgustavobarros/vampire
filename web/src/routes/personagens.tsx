import { createFileRoute, Navigate, Outlet } from "@tanstack/react-router";
import { usePlayerStore } from "#/stores/player-store";

export const Route = createFileRoute("/personagens")({
  component: Personagens,
});

/** Só o Mestre vê as fichas de todos; jogador volta para a própria. */
function Personagens() {
  const user = usePlayerStore((s) => s.user);
  const role = usePlayerStore((s) => s.role);
  if (!user) {
    return <Navigate replace to="/entrar" />;
  }
  if (role !== "dm") {
    return <Navigate replace to="/ficha" />;
  }
  return <Outlet />;
}
