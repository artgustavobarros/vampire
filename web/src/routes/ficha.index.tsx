import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/ficha/")({
  component: () => (
    <Navigate params={{ aba: "caracteristicas" }} replace to="/ficha/$aba" />
  ),
});
