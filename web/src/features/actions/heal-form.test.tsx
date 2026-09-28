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

function renderTab(over: Partial<Sheet> = {}, attrs: Sheet["attrs"] = {}) {
  const base = blankSheet();
  useCharacterStore.setState({
    sheet: { ...base, ...over, attrs: { ...base.attrs, Vigor: 2, ...attrs } },
  });
  render(
    <InfoProvider>
      <RuleDialogProvider>
        <AcoesTab />
      </RuleDialogProvider>
    </InfoProvider>
  );
}

async function openHeal() {
  await userEvent.click(screen.getByRole("button", { name: "Curar dano" }));
  return screen.getByRole("dialog");
}

const VIT_PREVIEW = /^Vitalidade depois:/;
const FDV_PREVIEW = /^Força de Vontade depois:/;
const CYCLE_HINT_TEXT = /Toque para marcar/;
const saved = () => useCharacterStore.getState().sheet;
const bump = async (dialog: HTMLElement, times: number) => {
  for (let i = 0; i < times; i += 1) {
    // biome-ignore lint/performance/noAwaitInLoops: os cliques precisam ser em sequência
    await userEvent.click(
      within(dialog).getByRole("button", { name: "Mais cura" })
    );
  }
};
const preview = (dialog: HTMLElement) =>
  within(dialog).getByRole("group", { name: VIT_PREVIEW });
const marksOf = (dialog: HTMLElement) =>
  within(preview(dialog))
    .getAllByRole("button")
    .map((b) => b.getAttribute("aria-label")?.split(": ")[1]);
const changedOf = (dialog: HTMLElement) =>
  within(preview(dialog))
    .getAllByRole("button")
    .map((b) => b.hasAttribute("data-changed"));
const clickBox = async (dialog: HTMLElement, n: number, times = 1) => {
  const box = within(dialog).getByRole("button", {
    name: (name) => name.startsWith(`Vitalidade depois ${n}:`),
  });
  for (let i = 0; i < times; i += 1) {
    // biome-ignore lint/performance/noAwaitInLoops: os cliques precisam ser em sequência
    await userEvent.click(box);
  }
};
const pick = (dialog: HTMLElement, name: string) =>
  userEvent.click(within(dialog).getByRole("button", { name }));

describe("diálogo Curar-se", () => {
  beforeEach(resetStores);

  it("abre pela aba Ações com Vitalidade, 0 e Superficial", async () => {
    renderTab({ vit: [1, 1] });
    const dialog = await openHeal();
    expect(
      within(dialog).getByRole("heading", { name: "Curar-se" })
    ).toBeInTheDocument();
    expect(
      within(dialog).getByRole("radio", { name: "Vitalidade" })
    ).toHaveAttribute("aria-checked", "true");
    expect(within(dialog).getByRole("status")).toHaveTextContent("0");
    expect(
      within(dialog).getByRole("button", { name: "Superficial" })
    ).toHaveAttribute("aria-pressed", "true");
    expect(marksOf(dialog)).toEqual([
      "superficial",
      "superficial",
      "vazio",
      "vazio",
      "vazio",
    ]);
    expect(changedOf(dialog)).toEqual([false, false, false, false, false]);
    expect(within(dialog).getByText(CYCLE_HINT_TEXT)).toBeInTheDocument();
    expect(
      within(dialog).getByRole("button", { name: "Curar 0 de dano" })
    ).toBeDisabled();
  });

  it("cura superficial e grava igual à prévia", async () => {
    renderTab({ fome: 2, vit: [1, 1, 1] });
    const dialog = await openHeal();
    await bump(dialog, 2);
    expect(marksOf(dialog)).toEqual([
      "superficial",
      "vazio",
      "vazio",
      "vazio",
      "vazio",
    ]);
    expect(changedOf(dialog)).toEqual([false, true, true, false, false]);
    await pick(dialog, "Curar 2 de dano");
    expect(saved().vit).toEqual([1, 0, 0, 0, 0]);
    expect(saved().fome).toBe(2);
    const done = screen.getByRole("dialog");
    expect(
      within(done).getByRole("heading", { name: "Dano curado" })
    ).toBeInTheDocument();
    expect(within(done).getByText("Anotado na ficha.")).toBeInTheDocument();
    expect(
      within(done).getByText("2 de dano superficial curado na Vitalidade.")
    ).toBeInTheDocument();
  });

  it("curar agravado esvazia a caixa", async () => {
    renderTab({ vit: [2, 1] });
    const dialog = await openHeal();
    await pick(dialog, "Agravado");
    await bump(dialog, 1);
    expect(marksOf(dialog).slice(0, 2)).toEqual(["vazio", "superficial"]);
    expect(changedOf(dialog).slice(0, 2)).toEqual([true, false]);
    expect(
      within(dialog).getByText(
        "Cada 1 de dano Agravado curado exige três checagens de sangue."
      )
    ).toBeInTheDocument();
  });

  it("limita o Dano curado às caixas do tipo e reduz ao trocar", async () => {
    renderTab({ vit: [1, 2, 1] });
    const dialog = await openHeal();
    expect(
      within(dialog).getByRole("button", { name: "Menos cura" })
    ).toBeDisabled();
    await bump(dialog, 2);
    expect(
      within(dialog).getByRole("button", { name: "Mais cura" })
    ).toBeDisabled();
    await pick(dialog, "Agravado");
    expect(within(dialog).getByRole("status")).toHaveTextContent("1");
    expect(marksOf(dialog)[1]).toBe("vazio");
    expect(changedOf(dialog)[1]).toBe(true);
    expect(
      within(dialog).getByRole("button", { name: "Curar 1 de dano" })
    ).toBeEnabled();
  });

  it("sem nada do tipo, nada a curar", async () => {
    renderTab({ vit: [1] });
    const dialog = await openHeal();
    await pick(dialog, "Agravado");
    expect(
      within(dialog).getByRole("button", { name: "Menos cura" })
    ).toBeDisabled();
    expect(
      within(dialog).getByRole("button", { name: "Mais cura" })
    ).toBeDisabled();
    expect(
      within(dialog).getByRole("button", { name: "Curar 0 de dano" })
    ).toBeDisabled();
  });

  it("dicas de Potência de Sangue e de Força de Vontade", async () => {
    renderTab({ geracao: "9ª" }, { Autocontrole: 2, Determinação: 3 });
    const dialog = await openHeal();
    expect(
      within(dialog).getByText(
        "Com Potência de Sangue 2, cada checagem de sangue cura 2 de dano Superficial."
      )
    ).toBeInTheDocument();
    await userEvent.click(
      within(dialog).getByRole("radio", { name: "Força de Vontade" })
    );
    expect(within(dialog).getByText("Força de Vontade depois")).toBeVisible();
    expect(
      within(dialog).getByText(
        "Ao dormir, a Força de Vontade recupera 3 de dano Superficial."
      )
    ).toBeInTheDocument();
  });

  describe("curar clicando nas caixas", () => {
    it("dois cliques num superficial deixam a caixa vazia", async () => {
      renderTab({ vit: [1] });
      const dialog = await openHeal();
      await clickBox(dialog, 1, 2);
      expect(marksOf(dialog)[0]).toBe("vazio");
      expect(changedOf(dialog)[0]).toBe(true);
      expect(within(dialog).getByRole("status")).toHaveTextContent("0");
      expect(
        within(dialog).getByRole("button", { name: "Curar dano" })
      ).toBeEnabled();
    });

    it("o limite parte das caixas clicadas", async () => {
      renderTab();
      const dialog = await openHeal();
      await clickBox(dialog, 1);
      await clickBox(dialog, 2);
      await bump(dialog, 2);
      expect(
        within(dialog).getByRole("button", { name: "Mais cura" })
      ).toBeDisabled();
      expect(marksOf(dialog).slice(0, 2)).toEqual(["vazio", "vazio"]);
      expect(changedOf(dialog)).toEqual([false, false, false, false, false]);
      expect(
        within(dialog).getByRole("button", { name: "Curar dano" })
      ).toBeDisabled();
    });

    it("confirmar depois de clicar grava e descreve a trilha", async () => {
      renderTab({ vit: [1, 1] });
      const dialog = await openHeal();
      await clickBox(dialog, 2, 2);
      await pick(dialog, "Curar dano");
      expect(saved().vit).toEqual([1, 0, 0, 0, 0]);
      expect(
        within(screen.getByRole("dialog")).getByText(
          "Vitalidade atualizada: 1 superficial, 0 agravados."
        )
      ).toBeInTheDocument();
    });

    it("trocar a trilha descarta os cliques", async () => {
      renderTab({ vit: [1] });
      const dialog = await openHeal();
      await clickBox(dialog, 1);
      await userEvent.click(
        within(dialog).getByRole("radio", { name: "Força de Vontade" })
      );
      expect(
        within(dialog)
          .getByRole("group", { name: FDV_PREVIEW })
          .querySelectorAll("[data-changed]")
      ).toHaveLength(0);
      await userEvent.click(
        within(dialog).getByRole("radio", { name: "Vitalidade" })
      );
      expect(changedOf(dialog)).toEqual([false, false, false, false, false]);
      expect(
        within(dialog).getByRole("button", { name: "Curar 0 de dano" })
      ).toBeDisabled();
    });
  });

  it("cancelar não muda a ficha e reabrir volta ao estado inicial", async () => {
    renderTab({ fdv: [1, 2], vit: [1, 2] });
    let dialog = await openHeal();
    await userEvent.click(
      within(dialog).getByRole("radio", { name: "Força de Vontade" })
    );
    await bump(dialog, 1);
    await pick(dialog, "Agravado");
    await userEvent.click(
      within(dialog).getByRole("button", {
        name: (name) => name.startsWith("Força de Vontade depois 1:"),
      })
    );
    await pick(dialog, "Cancelar");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(saved().vit).toEqual([1, 2]);
    expect(saved().fdv).toEqual([1, 2]);

    dialog = await openHeal();
    expect(
      within(dialog).getByRole("radio", { name: "Vitalidade" })
    ).toHaveAttribute("aria-checked", "true");
    expect(within(dialog).getByRole("status")).toHaveTextContent("0");
    expect(
      within(dialog).getByRole("button", { name: "Superficial" })
    ).toHaveAttribute("aria-pressed", "true");
    expect(changedOf(dialog)).toEqual([false, false, false, false, false]);
  });
});
