import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { RuleDialogProvider } from "#/features/actions/rule-dialog";
import { InfoProvider } from "#/features/info/info-sheet";
import { blankSheet } from "#/lib/sheet";
import type { Sheet } from "#/lib/types";
import { useCharacterStore } from "#/stores/character-store";
import { resetStores } from "#/stores/test-utils";
import { BottomBar } from "./bottom-bar";

function renderBar(over: Partial<Sheet> = {}) {
  const base = blankSheet();
  useCharacterStore.setState({
    sheet: {
      ...base,
      ...over,
      attrs: { ...base.attrs, Autocontrole: 2, Determinação: 3, Vigor: 2 },
    },
  });
  render(
    <InfoProvider>
      <RuleDialogProvider>
        <BottomBar />
      </RuleDialogProvider>
    </InfoProvider>
  );
}

const boxes = (name: string) =>
  within(screen.getByRole("group", { name })).getAllByRole("button");

describe("barra inferior", () => {
  beforeEach(resetStores);

  it("mostra Vitalidade, Fome e Vontade com as caixas do máximo", () => {
    renderBar({ fome: 3 });
    expect(boxes("Vitalidade")).toHaveLength(5);
    expect(boxes("Força de Vontade")).toHaveLength(5);
    expect(screen.getByText("Fome")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Dormir" })
    ).not.toBeInTheDocument();
  });

  it("tocar numa caixa grava o ciclo na ficha", async () => {
    renderBar();
    const box = () =>
      screen.getByRole("button", {
        name: (n) => n.startsWith("Vitalidade 1:"),
      });
    await userEvent.click(box());
    expect(useCharacterStore.getState().sheet.vit[0]).toBe(1);
    await userEvent.click(box());
    expect(useCharacterStore.getState().sheet.vit[0]).toBe(2);
  });

  it("Checagem de sangue abre o diálogo", async () => {
    renderBar();
    await userEvent.click(
      screen.getByRole("button", { name: "Checagem de sangue" })
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("rótulo Vontade abre o painel de informação", async () => {
    renderBar();
    await userEvent.click(screen.getByRole("button", { name: "Vontade" }));
    expect(
      await screen.findByRole("dialog", { name: "Força de Vontade" })
    ).toBeInTheDocument();
  });
});
