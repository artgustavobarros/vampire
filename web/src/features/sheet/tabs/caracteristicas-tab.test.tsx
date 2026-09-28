import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { InfoProvider } from "#/features/info/info-sheet";
import type { Role } from "#/lib/api";
import { blankSheet } from "#/lib/sheet";
import { useCharacterStore } from "#/stores/character-store";
import { usePlayerStore } from "#/stores/player-store";
import { resetStores } from "#/stores/test-utils";
import { CaracteristicasTab } from "./caracteristicas-tab";

function renderTab() {
  useCharacterStore.setState({
    sheet: { ...blankSheet(), attrs: { Força: 2 }, skills: {} },
  });
  return render(
    <InfoProvider>
      <CaracteristicasTab />
    </InfoProvider>
  );
}

const panel = (name: string) =>
  screen.getByRole("tabpanel", { name }) as HTMLElement;

describe("aba Características: abas Atributos | Habilidades", () => {
  beforeEach(resetStores);

  it("abre em Atributos, com os dois blocos montados", () => {
    renderTab();
    expect(screen.getByRole("tab", { name: "Atributos" })).toHaveAttribute(
      "aria-selected",
      "true"
    );
    expect(panel("Atributos")).toHaveAttribute("data-state", "active");
    expect(panel("Habilidades")).toHaveAttribute("data-state", "inactive");
    expect(panel("Habilidades")).toHaveClass(
      "max-lg:data-[state=inactive]:hidden"
    );
  });

  it("trocar para Habilidades e editar um ponto grava só em skills", async () => {
    renderTab();
    await userEvent.click(screen.getByRole("tab", { name: "Habilidades" }));
    const skills = panel("Habilidades");
    expect(skills).toHaveAttribute("data-state", "active");
    expect(panel("Atributos")).toHaveAttribute("data-state", "inactive");

    fireEvent.click(
      within(skills).getByRole("button", { name: "Furtividade 3" })
    );
    const { attrs, skills: saved } = useCharacterStore.getState().sheet;
    expect(saved.Furtividade).toBe(3);
    expect(attrs).toEqual({ Força: 2 });
  });
});

describe("aba Características: sem identificação", () => {
  beforeEach(resetStores);

  it("não mostra os campos de identificação", () => {
    renderTab();
    expect(screen.queryByLabelText("Nome")).toBeNull();
    expect(screen.queryByLabelText("Clã")).toBeNull();
  });
});

describe("aba Características: sem trilhas", () => {
  beforeEach(resetStores);

  it("não mostra Vitalidade nem Força de Vontade", () => {
    renderTab();
    expect(screen.queryByRole("group", { name: "Vitalidade" })).toBeNull();
    expect(
      screen.queryByRole("group", { name: "Força de Vontade" })
    ).toBeNull();
  });
});

describe("aba Características: sem Fome, Humanidade e Ressonância", () => {
  beforeEach(resetStores);

  it("mostra só Atributos e Habilidades", () => {
    renderTab();
    expect(screen.queryByRole("group", { name: "Fome" })).toBeNull();
    expect(screen.queryByText("Humanidade", { exact: false })).toBeNull();
    expect(screen.queryByText("Ressonância")).toBeNull();
  });
});

describe("aba Características: travada depois da criação", () => {
  beforeEach(resetStores);

  function renderCreated(role: Role) {
    usePlayerStore.setState({ role, user: "x@exemplo.com" });
    useCharacterStore.setState({
      sheet: { ...blankSheet(), attrs: { Força: 2 }, criada: true, skills: {} },
    });
    render(
      <InfoProvider>
        <CaracteristicasTab />
      </InfoProvider>
    );
  }

  it("para o jogador, os pontos são só leitura e o nome abre a informação", () => {
    renderCreated("player");
    const attrs = panel("Atributos");
    expect(within(attrs).queryByRole("button", { name: "Força 3" })).toBeNull();
    expect(
      within(attrs).getByRole("img", { name: "Força: 2 de 5" })
    ).toBeInTheDocument();
    expect(
      within(attrs).getByRole("button", { name: "Força" })
    ).toBeInTheDocument();
    expect(useCharacterStore.getState().sheet.attrs).toEqual({ Força: 2 });
  });

  it("para o Mestre, os pontos continuam editáveis", () => {
    renderCreated("dm");
    fireEvent.click(
      within(panel("Atributos")).getByRole("button", { name: "Força 3" })
    );
    expect(useCharacterStore.getState().sheet.attrs).toEqual({ Força: 3 });
  });
});
