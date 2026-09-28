import { createFileRoute, Navigate } from "@tanstack/react-router";
import { SheetTabContent } from "#/features/sheet/tab-content";
import { resolveTab } from "#/features/sheet/tabs";

export const Route = createFileRoute("/ficha/$aba")({ component: Aba });

function Aba() {
  const { redirect, tab } = resolveTab(Route.useParams().aba);
  if (redirect) {
    return <Navigate params={{ aba: tab }} replace to="/ficha/$aba" />;
  }
  return <SheetTabContent tab={tab} />;
}
