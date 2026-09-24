import { createFileRoute, Navigate } from "@tanstack/react-router";
import { SheetTabContent } from "#/features/sheet/tab-content";
import { isSheetTab } from "#/features/sheet/tabs";

export const Route = createFileRoute("/ficha/$aba")({ component: Aba });

function Aba() {
  const { aba } = Route.useParams();
  if (!isSheetTab(aba)) {
    return <Navigate params={{ aba: "ficha" }} replace to="/ficha/$aba" />;
  }
  return <SheetTabContent tab={aba} />;
}
