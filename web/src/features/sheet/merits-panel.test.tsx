import { fireEvent, render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { InfoProvider } from "#/features/info/info-sheet";
import { blankSheet } from "#/lib/sheet";
import type { Merit } from "#/lib/types";
import { useCharacterStore } from "#/stores/character-store";
import { resetStores } from "#/stores/test-utils";
import { MeritsPanel } from "./merits-panel";

function renderPanel(meritos: Merit[]) {
  useCharacterStore.setState({ sheet: { ...blankSheet(), meritos } });
  return render(
    <InfoProvider>
      <MeritsPanel />
    </InfoProvider>
  );
}

const column = (label: string) =>
  screen.getByText(label, { selector: "div" }).parentElement as HTMLElement;

describe("painel Vantagens & Defeitos", () => {
  beforeEach(resetStores);

  it("separa vantagens e defeitos, incluindo SR, e ignora nomes vazios", () => {
    renderPanel([
      { nome: "Recursos", pontos: 3, tipo: "vantagem" },
      { nome: "Inimigo", pontos: 2, tipo: "defeito" },
      { nome: "Olfato apurado", pontos: 1, tipo: "qualidade-sr" },
      { nome: "Sangue ralo", pontos: 1, tipo: "defeito-sr" },
      { nome: "  ", pontos: 1, tipo: "vantagem" },
    ]);
    const vantagens = column("Vantagens");
    const defeitos = column("Defeitos");
    expect(within(vantagens).getByText("Recursos")).toBeInTheDocument();
    expect(within(vantagens).getByText("Olfato apurado")).toBeInTheDocument();
    expect(within(defeitos).getByText("Inimigo")).toBeInTheDocument();
    expect(within(defeitos).getByText("Sangue ralo")).toBeInTheDocument();
    expect(within(vantagens).getAllByRole("group")).toHaveLength(2);
    expect(
      within(vantagens).getByRole("button", { name: "Recursos 3" })
    ).toHaveAttribute("aria-pressed", "true");
    expect(
      within(vantagens).getByRole("button", { name: "Recursos 4" })
    ).toHaveAttribute("aria-pressed", "false");
  });

  it("editar pontos grava no mérito sem mudar os outros campos", () => {
    renderPanel([
      { nome: "Rebanho", origem: "predador", pontos: 1, tipo: "vantagem" },
      { nome: "Recursos", pontos: 3, tipo: "vantagem" },
    ]);
    fireEvent.click(screen.getByRole("button", { name: "Recursos 4" }));
    expect(useCharacterStore.getState().sheet.meritos).toEqual([
      { nome: "Rebanho", origem: "predador", pontos: 1, tipo: "vantagem" },
      { nome: "Recursos", pontos: 4, tipo: "vantagem" },
    ]);
  });

  it("coluna vazia mostra o aviso", () => {
    renderPanel([{ nome: "Recursos", pontos: 3, tipo: "vantagem" }]);
    expect(screen.getByText("Nenhum defeito.")).toBeInTheDocument();
    expect(screen.queryByText("Nenhuma vantagem.")).not.toBeInTheDocument();
  });

  it("o nome abre o painel lateral com os pontos do mérito", async () => {
    renderPanel([{ nome: "Recursos", pontos: 3, tipo: "vantagem" }]);
    fireEvent.click(screen.getByRole("button", { name: "Recursos" }));

    const dialog = await screen.findByRole("dialog", { name: "Recursos" });
    expect(dialog).toHaveTextContent("Vantagem");
    expect(dialog).toHaveTextContent("3 pontos");
    expect(dialog.querySelector("[aria-current]")).toHaveTextContent(
      "Rico; propriedades e dinheiro para gastar sem pensar."
    );
    expect(useCharacterStore.getState().sheet.meritos?.[0].pontos).toBe(3);
  });
});
