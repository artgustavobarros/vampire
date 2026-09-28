import { createFileRoute } from "@tanstack/react-router";
import { AccountPage } from "#/features/account/account-page";

export const Route = createFileRoute("/personagens/_painel/conta")({
  component: () => <AccountPage mode={{ kind: "dm-self" }} />,
});
