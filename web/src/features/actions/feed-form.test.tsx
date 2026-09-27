import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { InfoProvider } from "#/features/info/info-sheet";
import { AcoesTab } from "#/features/sheet/tabs/acoes-tab";
import { blankSheet } from "#/lib/sheet";
import type { Sheet } from "#/lib/types";
import { useCharacterStore } from "#/stores/character-store";
import { resetStores } from "#/stores/test-utils";
import { RuleDialogProvider } from "./rule-dialog";

async function openFeed(over: Partial<Sheet> = {}) {
  useCharacterStore.setState({ sheet: { ...blankSheet(), ...over } });
  render(
    <InfoProvider>
      <RuleDialogProvider>
        <AcoesTab />
      </RuleDialogProvider>
    </InfoProvider>
  );
  await userEvent.click(screen.getByRole("button", { name: "Registrar" }));
  return screen.getByRole("dialog");
}

const saved = () => useCharacterStore.getState().sheet;
const intensity = (name: string) =>
  within(screen.getByRole("radiogroup", { name: "Intensidade" })).getByRole(
    "radio",
    { name }
  );

describe("diálogo Registrar alimentação", () => {
  beforeEach(resetStores);

  it("abre pela aba Ações com a Fome atual", async () => {
    const dialog = await openFeed({ fome: 2 });
    expect(
      within(dialog).getByRole("heading", { name: "Registrar alimentação" })
    ).toBeInTheDocument();
    expect(within(dialog).getByText("Fome atual: 2.")).toBeInTheDocument();
    expect(within(dialog).getByRole("status")).toHaveTextContent("2");
  });

  it("alimentar com Ressonância grava Fome e Ressonância da ficha", async () => {
    await openFeed({ fome: 2 });
    await userEvent.click(screen.getByRole("button", { name: "Fleumática" }));
    await userEvent.click(intensity("Intensa"));
    await userEvent.click(
      screen.getByRole("button", { name: "Alimentar · Fome 2 → 0" })
    );
    expect(saved().fome).toBe(0);
    expect(saved().ressonancia).toBe("Fleumática");
    expect(saved().resIntensidade).toBe("Intensa");
    expect(screen.getByRole("heading", { name: "Fome 0" })).toBeInTheDocument();
    expect(screen.getByText("Anotado na ficha.")).toBeInTheDocument();
  });

  it("saciar parcial sem Ressonância mantém a da ficha", async () => {
    await openFeed({
      fome: 3,
      resIntensidade: "Difusa",
      ressonancia: "Colérica",
    });
    await userEvent.click(screen.getByRole("button", { name: "Saciar menos" }));
    await userEvent.click(screen.getByRole("button", { name: "Saciar menos" }));
    await userEvent.click(
      screen.getByRole("button", { name: "Alimentar · Fome 3 → 2" })
    );
    expect(saved().fome).toBe(2);
    expect(saved().ressonancia).toBe("Colérica");
    expect(saved().resIntensidade).toBe("Difusa");
  });

  it("limites do Saciar e rótulo do botão", async () => {
    await openFeed({ fome: 3 });
    const less = screen.getByRole("button", { name: "Saciar menos" });
    const more = screen.getByRole("button", { name: "Saciar mais" });
    expect(more).toBeDisabled();
    await userEvent.click(less);
    expect(
      screen.getByRole("button", { name: "Alimentar · Fome 3 → 1" })
    ).toBeInTheDocument();
    await userEvent.click(less);
    expect(less).toBeDisabled();
    expect(more).toBeEnabled();
  });

  it("intensidade só com Ressonância marcada, e desmarcar desativa", async () => {
    await openFeed({ fome: 1 });
    expect(intensity("Negligenciável")).toBeDisabled();
    const sanguinea = screen.getByRole("button", { name: "Sanguínea" });
    await userEvent.click(sanguinea);
    expect(sanguinea).toHaveAttribute("aria-pressed", "true");
    expect(intensity("Negligenciável")).toBeEnabled();
    expect(intensity("Negligenciável")).toHaveAttribute("aria-checked", "true");
    await userEvent.click(sanguinea);
    expect(sanguinea).toHaveAttribute("aria-pressed", "false");
    expect(intensity("Negligenciável")).toBeDisabled();
  });

  it("não oferece 'Sem ressonância' como presa", async () => {
    await openFeed({ fome: 1 });
    expect(
      screen.queryByRole("button", { name: "Sem ressonância" })
    ).not.toBeInTheDocument();
  });

  it("Fome 0 registra só a Ressonância", async () => {
    await openFeed({ fome: 0 });
    expect(
      screen.getByText("Você está saciado. Nada a reduzir.")
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Saciar menos" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Saciar mais" })).toBeDisabled();
    const record = screen.getByRole("button", {
      name: "Registrar ressonância",
    });
    expect(record).toBeDisabled();
    await userEvent.click(screen.getByRole("button", { name: "Colérica" }));
    await userEvent.click(intensity("Aguçada"));
    await userEvent.click(record);
    expect(saved().fome).toBe(0);
    expect(saved().ressonancia).toBe("Colérica");
    expect(saved().resIntensidade).toBe("Aguçada");
  });

  it("cancelar não muda a ficha e reabrir volta ao estado inicial", async () => {
    await openFeed({ fome: 3 });
    await userEvent.click(screen.getByRole("button", { name: "Saciar menos" }));
    await userEvent.click(screen.getByRole("button", { name: "Melancólica" }));
    await userEvent.click(screen.getByRole("button", { name: "Cancelar" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(saved().fome).toBe(3);
    expect(saved().ressonancia).toBe("");

    await userEvent.click(screen.getByRole("button", { name: "Registrar" }));
    expect(
      screen.getByRole("button", { name: "Alimentar · Fome 3 → 0" })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Melancólica" })).toHaveAttribute(
      "aria-pressed",
      "false"
    );
  });
});
