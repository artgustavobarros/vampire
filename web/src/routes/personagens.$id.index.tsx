import { createFileRoute, Navigate } from "@tanstack/react-router";
import { DEFAULT_TAB } from "#/features/sheet/tabs";

export const Route = createFileRoute("/personagens/$id/")({ component: Index });

function Index() {
  const { id } = Route.useParams();
  return (
    <Navigate
      params={{ aba: DEFAULT_TAB, id }}
      replace
      to="/personagens/$id/$aba"
    />
  );
}
