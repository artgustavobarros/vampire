import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { RuleDialogProvider } from "#/features/actions/rule-dialog";
import { InfoProvider } from "#/features/info/info-sheet";
import { blankSheet } from "#/lib/sheet";
import { useCharacterStore } from "#/stores/character-store";
import { resetStores } from "#/stores/test-utils";
import { AcoesTab } from "./acoes-tab";

function renderTab() {
  useCharacterStore.setState({ sheet: blankSheet() });
  render(
    <InfoProvider>
      <RuleDialogProvider>
        <AcoesTab />
      </RuleDialogProvider>
    </InfoProvider>
  );
}

describe("aba Ações", () => {
  beforeEach(resetStores);

  it("mostra Humanidade e não mostra Vitalidade nem Força de Vontade", () => {
    renderTab();
    expect(screen.getByRole("group", { name: "Humanidade" })).toBeVisible();
    expect(screen.queryByRole("group", { name: "Vitalidade" })).toBeNull();
    expect(
      screen.queryByRole("group", { name: "Força de Vontade" })
    ).toBeNull();
  });

  it("cartão Dormir abre o diálogo de dormir", async () => {
    renderTab();
    await userEvent.click(screen.getByRole("button", { name: "Dormir" }));
    expect(
      screen.getByRole("dialog", { name: "Dormir até o anoitecer?" })
    ).toBeInTheDocument();
  });
});
