import { createFileRoute, Navigate } from "@tanstack/react-router";
import { SheetLayout } from "#/features/sheet/sheet-layout";
import { useCharacterStore } from "#/stores/character-store";
import { usePlayerStore } from "#/stores/player-store";

export const Route = createFileRoute("/ficha")({ component: Ficha });

function Ficha() {
  const user = usePlayerStore((s) => s.user);
  const role = usePlayerStore((s) => s.role);
  const criada = useCharacterStore((s) => s.sheet.criada);
  if (!user) {
    return <Navigate replace to="/entrar" />;
  }
  // o Mestre não tem ficha própria
  if (role === "dm") {
    return <Navigate replace to="/personagens" />;
  }
  if (!criada) {
    return <Navigate replace search={{ passo: 1 }} to="/criar" />;
  }
  return <SheetLayout tabs={{ to: "/ficha/$aba" }} />;
}
