import { createFileRoute, Navigate } from "@tanstack/react-router";
import { SheetTabContent } from "#/features/sheet/tab-content";
import { isSheetTab, legacyTab } from "#/features/sheet/tabs";

export const Route = createFileRoute("/ficha/$aba")({ component: Aba });

function Aba() {
  const { aba } = Route.useParams();
  const renamed = legacyTab(aba);
  if (renamed) {
    return <Navigate params={{ aba: renamed }} replace to="/ficha/$aba" />;
  }
  if (!isSheetTab(aba)) {
    return <Navigate params={{ aba: "ficha" }} replace to="/ficha/$aba" />;
  }
  return <SheetTabContent tab={aba} />;
}
