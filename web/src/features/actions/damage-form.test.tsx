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

function renderTab(over: Partial<Sheet> = {}) {
  const base = blankSheet();
  useCharacterStore.setState({
    sheet: { ...base, ...over, attrs: { ...base.attrs, Vigor: 2 } },
  });
  render(
    <InfoProvider>
      <RuleDialogProvider>
        <AcoesTab />
      </RuleDialogProvider>
    </InfoProvider>
  );
}

async function openDamage() {
  await userEvent.click(screen.getByRole("button", { name: "Marcar dano" }));
  return screen.getByRole("dialog");
}

const TORPOR_NOTE = /Vitalidade toda agravada: torpor\.$/;
const VIT_PREVIEW = /^Vitalidade depois:/;
const FDV_PREVIEW = /^Força de Vontade depois:/;
const CYCLE_HINT_TEXT = /Toque para marcar/;
const saved = () => useCharacterStore.getState().sheet;
const bump = async (dialog: HTMLElement, times: number) => {
  for (let i = 0; i < times; i += 1) {
    // biome-ignore lint/performance/noAwaitInLoops: os cliques precisam ser em sequência
    await userEvent.click(
      within(dialog).getByRole("button", { name: "Mais dano" })
    );
  }
};

describe("diálogo Sofrer dano", () => {
  beforeEach(resetStores);

  const changedBoxes = (dialog: HTMLElement, name: string) =>
    [...within(dialog).getByRole("group", { name }).children].map((b) =>
      b.hasAttribute("data-changed")
    );

  it("abre pela aba Ações com Vitalidade, 0 e Superficial", async () => {
    renderTab({ vit: [1, 1] });
    const dialog = await openDamage();
    expect(
      within(dialog).getByRole("heading", { name: "Sofrer dano" })
    ).toBeInTheDocument();
    expect(
      within(dialog).getByRole("radio", { name: "Vitalidade" })
    ).toHaveAttribute("aria-checked", "true");
    expect(within(dialog).getByRole("status")).toHaveTextContent("0");
    expect(
      within(dialog).getByRole("button", { name: "Superficial" })
    ).toHaveAttribute("aria-pressed", "true");
    expect(
      changedBoxes(
        dialog,
        "Vitalidade depois: 2 superficiais, 0 agravados, 3 vazias"
      )
    ).toEqual([false, false, false, false, false]);
    expect(
      within(dialog).getByRole("button", { name: "Marcar 0 de dano" })
    ).toBeDisabled();
  });

  it("marca o Superficial sem dividir e deixa a divisão como dica", async () => {
    renderTab({ vit: [1] });
    const dialog = await openDamage();
    await bump(dialog, 3);
    expect(
      within(dialog).getByText(
        "Vampiros dividem dano Superficial por 2, arredondando para cima: 3 virariam 2. Ajuste o dano recebido se for o caso."
      )
    ).toBeInTheDocument();
    expect(
      changedBoxes(
        dialog,
        "Vitalidade depois: 4 superficiais, 0 agravados, 1 vazia"
      )
    ).toEqual([false, true, true, true, false]);
    await userEvent.click(
      within(dialog).getByRole("button", { name: "Marcar 3 de dano" })
    );
    expect(saved().vit).toEqual([1, 1, 1, 1, 0]);
    const done = screen.getByRole("dialog");
    expect(
      within(done).getByRole("heading", { name: "Dano marcado" })
    ).toBeInTheDocument();
    expect(within(done).getByText("Anotado na ficha.")).toBeInTheDocument();
    expect(
      within(done).getByText("3 de dano superficial marcado na Vitalidade.")
    ).toBeInTheDocument();
  });

  it("golpes seguidos acumulam e transbordam para agravado", async () => {
    renderTab();
    let dialog = await openDamage();
    await bump(dialog, 5);
    await userEvent.click(
      within(dialog).getByRole("button", { name: "Marcar 5 de dano" })
    );
    expect(saved().vit).toEqual([1, 1, 1, 1, 1]);
    await userEvent.click(
      within(screen.getByRole("dialog")).getByRole("button", {
        name: "Fechar",
      })
    );

    dialog = await openDamage();
    expect(within(dialog).getByRole("status")).toHaveTextContent("0");
    expect(
      changedBoxes(
        dialog,
        "Vitalidade depois: 5 superficiais, 0 agravados, 0 vazias"
      )
    ).toEqual([false, false, false, false, false]);
    await bump(dialog, 1);
    expect(
      changedBoxes(
        dialog,
        "Vitalidade depois: 4 superficiais, 1 agravado, 0 vazias"
      )
    ).toEqual([true, false, false, false, false]);
  });

  it("Agravado e Força de Vontade", async () => {
    renderTab();
    const dialog = await openDamage();
    await bump(dialog, 3);
    await userEvent.click(
      within(dialog).getByRole("button", { name: "Agravado" })
    );
    expect(
      within(dialog).getByText("Dano Agravado não é dividido.")
    ).toBeInTheDocument();
    expect(
      within(dialog).getByRole("button", { name: "Marcar 3 de dano" })
    ).toBeInTheDocument();

    await userEvent.click(
      within(dialog).getByRole("button", { name: "Superficial" })
    );
    await userEvent.click(
      within(dialog).getByRole("radio", { name: "Força de Vontade" })
    );
    expect(within(dialog).getByText("Força de Vontade depois")).toBeVisible();
    expect(
      within(dialog).getByText("Dano de Força de Vontade não é dividido.")
    ).toBeInTheDocument();
    expect(
      within(dialog).getByRole("button", { name: "Marcar 3 de dano" })
    ).toBeInTheDocument();
  });

  it("limites do Dano recebido", async () => {
    renderTab();
    const dialog = await openDamage();
    expect(
      within(dialog).getByRole("button", { name: "Menos dano" })
    ).toBeDisabled();
    await bump(dialog, 20);
    expect(within(dialog).getByRole("status")).toHaveTextContent("20");
    expect(
      within(dialog).getByRole("button", { name: "Mais dano" })
    ).toBeDisabled();
  });

  it("Vitalidade toda agravada avisa torpor", async () => {
    renderTab({ vit: [2, 2, 2, 2, 0] });
    const dialog = await openDamage();
    await bump(dialog, 1);
    await userEvent.click(
      within(dialog).getByRole("button", { name: "Agravado" })
    );
    await userEvent.click(
      within(dialog).getByRole("button", { name: "Marcar 1 de dano" })
    );
    expect(
      within(screen.getByRole("dialog")).getByRole("status")
    ).toHaveTextContent(TORPOR_NOTE);
  });

  it("cancelar não muda a ficha e reabrir volta ao estado inicial", async () => {
    renderTab();
    let dialog = await openDamage();
    await userEvent.click(
      within(dialog).getByRole("radio", { name: "Força de Vontade" })
    );
    await bump(dialog, 3);
    await userEvent.click(
      within(dialog).getByRole("button", { name: "Agravado" })
    );
    await userEvent.click(
      within(dialog).getByRole("button", { name: "Cancelar" })
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(saved().vit).toEqual(blankSheet().vit);
    expect(saved().fdv).toEqual(blankSheet().fdv);

    dialog = await openDamage();
    expect(
      within(dialog).getByRole("radio", { name: "Vitalidade" })
    ).toHaveAttribute("aria-checked", "true");
    expect(within(dialog).getByRole("status")).toHaveTextContent("0");
    expect(
      within(dialog).getByRole("button", { name: "Superficial" })
    ).toHaveAttribute("aria-pressed", "true");
  });

  describe("marcar clicando nas caixas", () => {
    const box = (dialog: HTMLElement, n: number) =>
      within(dialog).getByRole("button", {
        name: (name) => name.startsWith(`Vitalidade depois ${n}:`),
      });
    const clickBox = async (dialog: HTMLElement, n: number, times = 1) => {
      for (let i = 0; i < times; i += 1) {
        // biome-ignore lint/performance/noAwaitInLoops: os cliques precisam ser em sequência
        await userEvent.click(box(dialog, n));
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

    it("mostra a dica de toque", async () => {
      renderTab();
      const dialog = await openDamage();
      expect(within(dialog).getByText(CYCLE_HINT_TEXT)).toBeInTheDocument();
    });

    it("dois cliques marcam agravado e o terceiro volta a vazio", async () => {
      renderTab();
      const dialog = await openDamage();
      await clickBox(dialog, 3, 2);
      expect(marksOf(dialog)).toEqual([
        "vazio",
        "vazio",
        "agravado",
        "vazio",
        "vazio",
      ]);
      expect(changedOf(dialog)).toEqual([false, false, true, false, false]);
      expect(within(dialog).getByRole("status")).toHaveTextContent("0");
      expect(
        within(dialog).getByRole("button", { name: "Marcar dano" })
      ).toBeEnabled();

      await clickBox(dialog, 3);
      expect(changedOf(dialog)).toEqual([false, false, false, false, false]);
      expect(
        within(dialog).getByRole("button", { name: "Marcar dano" })
      ).toBeDisabled();
    });

    it("clique desmarca dano já gravado", async () => {
      renderTab({ vit: [2] });
      const dialog = await openDamage();
      await clickBox(dialog, 1);
      expect(marksOf(dialog)[0]).toBe("vazio");
      expect(changedOf(dialog)[0]).toBe(true);
      expect(
        within(dialog).getByRole("button", { name: "Marcar dano" })
      ).toBeEnabled();
    });

    it("clique depois do stepper parte do que está na tela", async () => {
      renderTab();
      const dialog = await openDamage();
      await bump(dialog, 2);
      await clickBox(dialog, 1);
      expect(within(dialog).getByRole("status")).toHaveTextContent("0");
      expect(marksOf(dialog)).toEqual([
        "agravado",
        "superficial",
        "vazio",
        "vazio",
        "vazio",
      ]);
      expect(changedOf(dialog)).toEqual([true, true, false, false, false]);
      expect(
        within(dialog).getByRole("button", { name: "Marcar dano" })
      ).toBeEnabled();
    });

    it("stepper soma por cima das caixas clicadas", async () => {
      renderTab();
      const dialog = await openDamage();
      await clickBox(dialog, 1);
      await userEvent.click(
        within(dialog).getByRole("button", { name: "Agravado" })
      );
      await bump(dialog, 1);
      expect(marksOf(dialog)).toEqual([
        "superficial",
        "agravado",
        "vazio",
        "vazio",
        "vazio",
      ]);
      expect(changedOf(dialog)).toEqual([true, true, false, false, false]);
      expect(
        within(dialog).getByRole("button", { name: "Marcar dano" })
      ).toBeInTheDocument();
    });

    it("confirmar depois de clicar grava e descreve a trilha", async () => {
      renderTab({ vit: [1] });
      const dialog = await openDamage();
      await clickBox(dialog, 2, 2);
      await userEvent.click(
        within(dialog).getByRole("button", { name: "Marcar dano" })
      );
      expect(saved().vit).toEqual([1, 2, 0, 0, 0]);
      const done = screen.getByRole("dialog");
      expect(
        within(done).getByRole("heading", { name: "Dano marcado" })
      ).toBeInTheDocument();
      expect(
        within(done).getByText(
          "Vitalidade atualizada: 1 superficial, 1 agravado."
        )
      ).toBeInTheDocument();
    });

    it("trocar a trilha descarta os cliques", async () => {
      renderTab();
      const dialog = await openDamage();
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
        within(dialog).getByRole("button", { name: "Marcar 0 de dano" })
      ).toBeDisabled();
    });

    it("cancelar depois de clicar não grava nada", async () => {
      renderTab({ vit: [1] });
      let dialog = await openDamage();
      await clickBox(dialog, 1, 2);
      await userEvent.click(
        within(dialog).getByRole("button", { name: "Cancelar" })
      );
      expect(saved().vit).toEqual([1]);

      dialog = await openDamage();
      expect(changedOf(dialog)).toEqual([false, false, false, false, false]);
      expect(
        within(dialog).getByRole("button", { name: "Marcar 0 de dano" })
      ).toBeDisabled();
    });
  });
});
