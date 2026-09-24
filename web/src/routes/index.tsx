import { createFileRoute, Navigate } from "@tanstack/react-router";
import { homeTarget } from "#/features/auth/home-path";
import { useAppState } from "#/lib/store";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const target = homeTarget(useAppState());
  return target === "/criar" ? (
    <Navigate replace search={{ passo: 1 }} to="/criar" />
  ) : (
    <Navigate replace to={target} />
  );
}
