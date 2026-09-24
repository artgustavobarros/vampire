import { createFileRoute, Navigate } from "@tanstack/react-router";
import { AuthCard } from "#/features/auth/auth-card";
import { useAppState } from "#/lib/store";

interface EntrarSearch {
  modo?: "cadastro";
}

export const Route = createFileRoute("/entrar")({
  component: Entrar,
  validateSearch: (search: Record<string, unknown>): EntrarSearch =>
    search.modo === "cadastro" ? { modo: "cadastro" } : {},
});

function Entrar() {
  const { modo } = Route.useSearch();
  const { user } = useAppState();

  if (user) {
    return <Navigate replace to="/" />;
  }

  return <AuthCard mode={modo === "cadastro" ? "signup" : "login"} />;
}
