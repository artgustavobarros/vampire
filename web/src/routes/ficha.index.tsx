import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/ficha/")({
  component: () => (
    <Navigate params={{ aba: "ficha" }} replace to="/ficha/$aba" />
  ),
});
