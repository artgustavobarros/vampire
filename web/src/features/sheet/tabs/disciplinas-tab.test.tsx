import { fireEvent, render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { InfoProvider } from "#/features/info/info-sheet";
import { blankSheet } from "#/lib/sheet";
import type { Discipline } from "#/lib/types";
import { useCharacterStore } from "#/stores/character-store";
import { resetStores } from "#/stores/test-utils";
import { DisciplinasTab } from "./disciplinas-tab";

const COMPELIR = /^1Compelir/;
const SUSSURROS = /^1Sussurros/;

function renderTab(disc: Discipline[]) {
  useCharacterStore.setState({ sheet: { ...blankSheet(), disc } });
  return render(
    <InfoProvider>
      <DisciplinasTab />
    </InfoProvider>
  );
}

const powers = () =>
  useCharacterStore.getState().sheet.disc[0].powers.map((p) => p.nome);

describe("aba Disciplinas", () => {
  beforeEach(resetStores);

  it("linha do poder abre o painel lateral, sem editor em linha", async () => {
    renderTab([
      { nivel: 1, nome: "Domínio", powers: [{ nivel: 1, nome: "Compelir" }] },
    ]);
    fireEvent.click(screen.getByRole("button", { name: COMPELIR }));
    const dialog = await screen.findByRole("dialog", { name: "Compelir" });
    expect(within(dialog).getByText("Domínio · nível 1")).toBeInTheDocument();
    expect(screen.queryByLabelText("Descrição do poder")).toBeNull();
    expect(powers()).toEqual(["Compelir"]);
  });

  it("poder fora do catálogo mostra a descrição gravada", async () => {
    renderTab([
      {
        nivel: 1,
        nome: "Necromancia",
        powers: [{ desc: "Fala com os mortos", nivel: 1, nome: "Sussurros" }],
      },
    ]);
    fireEvent.click(screen.getByRole("button", { name: SUSSURROS }));
    const dialog = await screen.findByRole("dialog", { name: "Sussurros" });
    expect(within(dialog).getByText("Fala com os mortos")).toBeInTheDocument();
  });

  it("× remove o poder sem abrir o painel", () => {
    renderTab([
      {
        nivel: 2,
        nome: "Domínio",
        powers: [
          { nivel: 1, nome: "Compelir" },
          { nivel: 2, nome: "Hipnose" },
        ],
      },
    ]);
    fireEvent.click(screen.getByRole("button", { name: "Remover Compelir" }));
    expect(powers()).toEqual(["Hipnose"]);
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});
