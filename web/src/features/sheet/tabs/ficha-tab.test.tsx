import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { InfoProvider } from "#/features/info/info-sheet";
import { blankSheet } from "#/lib/sheet";
import { useCharacterStore } from "#/stores/character-store";
import { resetStores } from "#/stores/test-utils";
import { FichaTab } from "./ficha-tab";

function renderTab() {
  useCharacterStore.setState({
    sheet: { ...blankSheet(), attrs: { Força: 2 }, skills: {} },
  });
  return render(
    <InfoProvider>
      <FichaTab />
    </InfoProvider>
  );
}

const panel = (name: string) =>
  screen.getByRole("tabpanel", { name }) as HTMLElement;

describe("aba Ficha: abas Atributos | Habilidades", () => {
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

describe("aba Ficha: sem identificação", () => {
  beforeEach(resetStores);

  it("não mostra os campos de identificação", () => {
    renderTab();
    expect(screen.queryByLabelText("Nome")).toBeNull();
    expect(screen.queryByLabelText("Clã")).toBeNull();
  });
});
