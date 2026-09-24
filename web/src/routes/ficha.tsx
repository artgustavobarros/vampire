import { createFileRoute, Navigate } from "@tanstack/react-router";
import { SheetLayout } from "#/features/sheet/sheet-layout";
import { useAppState } from "#/lib/store";

export const Route = createFileRoute("/ficha")({ component: Ficha });

function Ficha() {
  const { user, sheet } = useAppState();
  if (!user) {
    return <Navigate replace to="/entrar" />;
  }
  if (!sheet.criada) {
    return <Navigate replace search={{ passo: 1 }} to="/criar" />;
  }
  return <SheetLayout />;
}
