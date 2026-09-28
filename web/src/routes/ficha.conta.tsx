import { createFileRoute } from "@tanstack/react-router";
import { AccountPage } from "#/features/account/account-page";

export const Route = createFileRoute("/ficha/conta")({
  component: () => <AccountPage mode={{ kind: "self" }} />,
});
