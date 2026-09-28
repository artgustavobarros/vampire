import { act, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";
import { afterEach, describe, expect, it, vi } from "vitest";
import { RodadaTab } from "#/features/sheet/tabs/rodada-tab";
import { blankSheet } from "#/lib/sheet";
import type { RoundEntry } from "#/lib/types";
import { resetStores } from "#/stores/test-utils";
import { fakeApi } from "#/test/fake-api";
import { renderRoute } from "#/test/render-route";
import { RoundPage } from "./round-page";

const ROUND_TITLE = /^Rodada \d+$/;
const VITALITY = /Vitalidade/;

const sheet = (nome: string, fome = 1) => ({
  ...blankSheet(),
  attrs: { ...blankSheet().attrs, Autocontrole: 3, Determinação: 2, Vigor: 2 },
  criada: true,
  fome,
  nome,
});

function seedTable() {
  const vitoria = fakeApi.seed({
    email: "vitoria@exemplo.com",
    name: "Ana",
    sheet: sheet("Vitória Salles"),
  });
  const encourado = fakeApi.seedEnemy({
    especiais: [
      { nome: "Garras", texto: "<p>Garras <strong>agravadas</strong></p>" },
    ],
    nome: "Encourado",
    paradas: [{ dados: 7, nome: "Garras" }],
  });
  return { encourado, vitoria };
}

const entry = (
  id: string,
  tipo: RoundEntry["tipo"],
  iniciativa: number | null = null
): RoundEntry => ({ id, iniciativa, tipo });

afterEach(() => {
  toast.dismiss();
  resetStores();
  vi.useRealTimers();
});

async function openDm() {
  fakeApi.login(null, "admin@admin.com", "dm");
  renderRoute(RoundPage);
  return await screen.findByRole("heading", { name: ROUND_TITLE });
}

const orderPanel = () =>
  screen.getByRole("region", { name: "Ordem da rodada" });

describe("Rodada do Mestre", () => {
  it("vazia: rodada 1, sem cartões e botões desabilitados", async () => {
    await openDm();
    expect(
      screen.getByRole("heading", { name: "Rodada 1" })
    ).toBeInTheDocument();
    expect(
      within(orderPanel()).getByText("Ninguém na rodada ainda.")
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Próximo ▶" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "◀ Anterior" })).toBeDisabled();
  });

  it("coloca personagem e inimigo pelos seletores", async () => {
    const { encourado, vitoria } = seedTable();
    await openDm();
    const panel = orderPanel();
    await userEvent.selectOptions(
      within(panel).getByRole("combobox", {
        name: "Colocar personagem na rodada",
      }),
      vitoria.id
    );
    await userEvent.selectOptions(
      within(panel).getByRole("combobox", {
        name: "Colocar inimigo na rodada",
      }),
      encourado.id
    );
    const vit = screen.getByRole("article", { name: "Vitória Salles" });
    expect(within(vit).getByText("Jogador")).toBeInTheDocument();
    expect(within(vit).getByText("Vez de agir")).toBeInTheDocument();
    expect(within(vit).getByText("Vitalidade · 5/5")).toBeInTheDocument();
    const enc = screen.getByRole("article", { name: "Encourado" });
    expect(
      within(enc).getByText("Inimigo · oculto aos jogadores")
    ).toBeInTheDocument();
    expect(within(enc).getByText("agravadas").tagName).toBe("STRONG");
    expect(screen.getByText("Vez de Vitória Salles")).toBeInTheDocument();
    await waitFor(() =>
      expect(fakeApi.round().ordem).toEqual([
        entry(vitoria.id, "jogador"),
        entry(encourado.id, "inimigo"),
      ])
    );
    // quem já está na rodada some dos seletores
    expect(
      within(panel).getByRole("combobox", {
        name: "Colocar personagem na rodada",
      })
    ).toBeDisabled();
  });

  it("próximo, anterior e reiniciar", async () => {
    const { encourado, vitoria } = seedTable();
    fakeApi.seedRound({
      ordem: [entry(vitoria.id, "jogador"), entry(encourado.id, "inimigo")],
    });
    await openDm();
    const next = screen.getByRole("button", { name: "Próximo ▶" });
    await userEvent.click(next);
    expect(screen.getByText("Vez de Encourado")).toBeInTheDocument();
    expect(
      within(screen.getByRole("article", { name: "Encourado" })).getByText(
        "Vez de agir"
      )
    ).toBeInTheDocument();
    await userEvent.click(next);
    expect(
      screen.getByRole("heading", { name: "Rodada 2" })
    ).toBeInTheDocument();
    expect(screen.getByText("Vez de Vitória Salles")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "◀ Anterior" }));
    expect(
      screen.getByRole("heading", { name: "Rodada 1" })
    ).toBeInTheDocument();
    expect(screen.getByText("Vez de Encourado")).toBeInTheDocument();
    await userEvent.click(next);
    await userEvent.click(screen.getByRole("button", { name: "Reiniciar" }));
    expect(
      screen.getByRole("heading", { name: "Rodada 1" })
    ).toBeInTheDocument();
    await waitFor(() =>
      expect(fakeApi.round()).toMatchObject({ rodada: 1, vez: 0 })
    );
  });

  it("iniciativa e ordenar por iniciativa", async () => {
    const { encourado, vitoria } = seedTable();
    fakeApi.seedRound({
      ordem: [entry(vitoria.id, "jogador"), entry(encourado.id, "inimigo")],
    });
    await openDm();
    await userEvent.type(
      screen.getByRole("spinbutton", { name: "Iniciativa de Vitória Salles" }),
      "4"
    );
    await userEvent.type(
      screen.getByRole("spinbutton", { name: "Iniciativa de Encourado" }),
      "7"
    );
    await userEvent.click(
      screen.getByRole("button", { name: "Ordenar por iniciativa" })
    );
    expect(
      screen.getAllByRole("article").map((a) => a.getAttribute("aria-label"))
    ).toEqual(["Encourado", "Vitória Salles"]);
    await waitFor(() =>
      expect(fakeApi.round().ordem).toEqual([
        entry(encourado.id, "inimigo", 7),
        entry(vitoria.id, "jogador", 4),
      ])
    );
    // a vez continua com a Vitória
    expect(screen.getByText("Vez de Vitória Salles")).toBeInTheDocument();
  });

  it("dano no inimigo pelo cartão é gravado no bestiário", async () => {
    const { encourado } = seedTable();
    fakeApi.seedRound({ ordem: [entry(encourado.id, "inimigo")] });
    await openDm();
    const card = screen.getByRole("article", { name: "Encourado" });
    await userEvent.click(
      within(card).getByRole("button", { name: "Vitalidade 1: vazio" })
    );
    expect(within(card).getByText("Vitalidade · 4/5")).toBeInTheDocument();
    await waitFor(() =>
      expect(fakeApi.enemies()[0]?.enemy.vit).toEqual([1, 0, 0, 0, 0])
    );
  });

  it("esvaziar pede confirmação", async () => {
    const { vitoria } = seedTable();
    fakeApi.seedRound({ ordem: [entry(vitoria.id, "jogador")], rodada: 3 });
    await openDm();
    await userEvent.click(screen.getByRole("button", { name: "Esvaziar" }));
    const dialog = await screen.findByRole("dialog");
    expect(within(dialog).getByText("Esvaziar a rodada?")).toBeInTheDocument();
    await userEvent.click(
      within(dialog).getByRole("button", { name: "Esvaziar" })
    );
    expect(screen.getByText("Ninguém na rodada ainda.")).toBeInTheDocument();
    await waitFor(() =>
      expect(fakeApi.round()).toEqual({ ordem: [], rodada: 1, vez: 0 })
    );
  });

  it("tirar quem tem a vez passa a vez adiante", async () => {
    const { encourado, vitoria } = seedTable();
    fakeApi.seedRound({
      ordem: [entry(vitoria.id, "jogador"), entry(encourado.id, "inimigo")],
    });
    await openDm();
    await userEvent.click(
      screen.getByRole("button", { name: "Tirar Vitória Salles da rodada" })
    );
    expect(screen.getByText("Vez de Encourado")).toBeInTheDocument();
  });
});

describe("Rodada do jogador", () => {
  function openPlayer() {
    fakeApi.login(sheet("Bento"), "bento@exemplo.com");
    renderRoute(RodadaTab);
  }

  it("sem combate", async () => {
    openPlayer();
    expect(
      await screen.findByText("Nenhum combate em andamento.")
    ).toBeInTheDocument();
  });

  it("inimigo oculto não mostra os dados; visível mostra", async () => {
    const { encourado, vitoria } = seedTable();
    const cao = fakeApi.seedEnemy({
      nome: "Cão",
      paradas: [{ dados: 5, nome: "Morder" }],
      visivel: true,
    });
    fakeApi.seedRound({
      ordem: [
        entry(vitoria.id, "jogador", 4),
        entry(encourado.id, "inimigo"),
        entry(cao.id, "inimigo"),
      ],
    });
    openPlayer();
    const oculto = await screen.findByRole("article", { name: "Encourado" });
    expect(within(oculto).getByText("Inimigo")).toBeInTheDocument();
    expect(
      within(oculto).getByText("Dados ocultos pelo Mestre.")
    ).toBeInTheDocument();
    expect(within(oculto).queryByText(VITALITY)).toBeNull();
    expect(within(oculto).queryByText("Garras")).toBeNull();

    const visivel = screen.getByRole("article", { name: "Cão" });
    expect(within(visivel).getByText("Vitalidade · 5/5")).toBeInTheDocument();
    expect(within(visivel).getByText("Morder")).toBeInTheDocument();

    const jogador = screen.getByRole("article", { name: "Vitória Salles" });
    expect(within(jogador).getByText("4")).toBeInTheDocument();
    // só leitura
    expect(screen.queryByRole("button")).toBeNull();
    expect(screen.queryByRole("spinbutton")).toBeNull();
  });

  it("atualiza sozinha a cada 5 segundos", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const { encourado, vitoria } = seedTable();
    fakeApi.seedRound({
      ordem: [entry(vitoria.id, "jogador"), entry(encourado.id, "inimigo")],
    });
    openPlayer();
    expect(
      await screen.findByText("Vez de Vitória Salles")
    ).toBeInTheDocument();
    fakeApi.seedRound({ vez: 1 });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(5000);
    });
    expect(await screen.findByText("Vez de Encourado")).toBeInTheDocument();
  });
});
