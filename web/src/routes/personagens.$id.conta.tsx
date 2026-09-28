import { createFileRoute } from "@tanstack/react-router";
import { AccountPage } from "#/features/account/account-page";

export const Route = createFileRoute("/personagens/$id/conta")({
  component: PlayerAccount,
});

/** A conta do jogador, aberta pelo Mestre dentro da ficha dele. */
function PlayerAccount() {
  const { id } = Route.useParams();
  return <AccountPage mode={{ kind: "player", userId: id }} />;
}
