import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { blankSheet } from "#/lib/sheet";
import type { DicePool } from "#/lib/types";
import { useCharacterStore } from "#/stores/character-store";
import { resetStores } from "#/stores/test-utils";
import { RolagensTab } from "./rolagens-tab";

const ATIRAR: DicePool = {
  attr: "Autocontrole",
  id: "p1",
  mod: 0,
  nome: "Atirar",
  skill: "Armas de Fogo",
};

function renderTab(rolagens?: DicePool[]) {
  const sheet = blankSheet();
  sheet.attrs = { ...sheet.attrs, Autocontrole: 3, Destreza: 2, Vigor: 2 };
  useCharacterStore.setState({ sheet: { ...sheet, rolagens } });
  return render(<RolagensTab />);
}

const pools = () => useCharacterStore.getState().sheet.rolagens ?? [];
const card = (name: string) => screen.getByRole("region", { name });

describe("aba Rolagens", () => {
  beforeEach(resetStores);

  it("vazia: título, texto e botão, sem cartões", () => {
    renderTab();
    expect(screen.getByText("Paradas de dados")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Salve os testes que você usa sempre. O total acompanha a ficha quando atributos ou perícias mudam."
      )
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "+ Nova parada" })
    ).toBeInTheDocument();
    expect(screen.queryByRole("region")).toBeNull();
  });

  it("nova parada vem vazia e com foco no nome", async () => {
    renderTab();
    await userEvent.click(
      screen.getByRole("button", { name: "+ Nova parada" })
    );
    const novo = card("Parada sem nome");
    const nome = within(novo).getByRole("textbox", { name: "Nome do teste" });
    expect(nome).toHaveFocus();
    expect(nome).toHaveAttribute("placeholder", "Nome do teste");
    expect(within(novo).getByLabelText("Total")).toHaveTextContent("0");
    expect(within(novo).getByLabelText("Atributo")).toHaveDisplayValue(
      "— nenhum —"
    );
    expect(within(novo).getByLabelText("Perícia")).toHaveDisplayValue(
      "— nenhuma —"
    );
    expect(
      within(novo).getByText("Escolha atributo e perícia")
    ).toBeInTheDocument();
    expect(pools()).toHaveLength(1);
  });

  it("opções mostram o valor atual, agrupadas", () => {
    renderTab([{ id: "p", mod: 0, nome: "" }]);
    const attr = screen.getByLabelText("Atributo");
    const fisicos = within(attr).getByRole("group", { name: "Físicos" });
    expect(
      within(fisicos)
        .getAllByRole("option")
        .map((o) => o.textContent)
    ).toEqual(["Força · 1", "Destreza · 2", "Vigor · 2"]);
    expect(
      within(screen.getByLabelText("Perícia")).getByRole("option", {
        name: "Armas de Fogo · 0",
      })
    ).toBeInTheDocument();
  });

  it("escolher atributo e perícia grava e mostra total e fórmula", async () => {
    renderTab([{ id: "p", mod: 0, nome: "Atirar" }]);
    const atirar = card("Atirar");
    await userEvent.selectOptions(
      within(atirar).getByLabelText("Atributo"),
      "Autocontrole"
    );
    await userEvent.selectOptions(
      within(atirar).getByLabelText("Perícia"),
      "Armas de Fogo"
    );
    expect(within(atirar).getByLabelText("Total")).toHaveTextContent("3");
    expect(
      within(atirar).getByText("Autocontrole 3 + Armas de Fogo 0")
    ).toBeInTheDocument();
    expect(pools()[0]).toMatchObject({
      attr: "Autocontrole",
      skill: "Armas de Fogo",
    });
  });

  it("modificador muda o total e para no limite", async () => {
    renderTab([{ ...ATIRAR, mod: 9 }]);
    const atirar = card("Atirar");
    const mais = within(atirar).getByRole("button", {
      name: "Aumentar modificador",
    });
    await userEvent.click(mais);
    expect(pools()[0].mod).toBe(10);
    expect(mais).toBeDisabled();
    expect(within(atirar).getByLabelText("Total")).toHaveTextContent("13");
    expect(
      within(atirar).getByText("Autocontrole 3 + Armas de Fogo 0 + 10")
    ).toBeInTheDocument();
  });

  it("remover apaga a parada", async () => {
    renderTab([ATIRAR, { id: "p2", mod: 0, nome: "Correr" }]);
    await userEvent.click(
      within(card("Atirar")).getByRole("button", { name: "Remover" })
    );
    expect(screen.queryByRole("region", { name: "Atirar" })).toBeNull();
    expect(pools().map((p) => p.nome)).toEqual(["Correr"]);
  });

  it("total acompanha a ficha", () => {
    renderTab([ATIRAR]);
    act(() => {
      const { sheet } = useCharacterStore.getState();
      useCharacterStore.setState({
        sheet: { ...sheet, attrs: { ...sheet.attrs, Autocontrole: 4 } },
      });
    });
    const atirar = card("Atirar");
    expect(within(atirar).getByLabelText("Total")).toHaveTextContent("4");
    expect(
      within(atirar).getByRole("option", { name: "Autocontrole · 4" })
    ).toBeInTheDocument();
  });
});
