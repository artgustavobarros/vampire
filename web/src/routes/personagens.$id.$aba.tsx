import { createFileRoute, Navigate } from "@tanstack/react-router";
import { SheetTabContent } from "#/features/sheet/tab-content";
import { resolveTab } from "#/features/sheet/tabs";

export const Route = createFileRoute("/personagens/$id/$aba")({
  component: Aba,
});

function Aba() {
  const { aba, id } = Route.useParams();
  const { redirect, tab } = resolveTab(aba);
  if (redirect) {
    return (
      <Navigate params={{ aba: tab, id }} replace to="/personagens/$id/$aba" />
    );
  }
  return <SheetTabContent tab={tab} />;
}
