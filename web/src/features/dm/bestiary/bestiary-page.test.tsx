import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";
import { afterEach, describe, expect, it, vi } from "vitest";
import { resetStores } from "#/stores/test-utils";
import { fakeApi } from "#/test/fake-api";
import { renderRoute } from "#/test/render-route";
import { BestiaryPage } from "./bestiary-page";

const editor = (name: string) => screen.getByRole("region", { name });

async function open() {
  fakeApi.login(null, "admin@admin.com", "dm");
  renderRoute(BestiaryPage);
  await screen.findByRole("button", { name: "+ Novo inimigo" });
}

afterEach(() => {
  toast.dismiss();
  resetStores();
  vi.restoreAllMocks();
});

describe("Bestiário", () => {
  it("vazio mostra o aviso", async () => {
    await open();
    expect(
      await screen.findByText("Nenhum inimigo no bestiário ainda.")
    ).toBeInTheDocument();
  });

  it("novo inimigo fica embaixo, oculto e fora da rodada", async () => {
    fakeApi.seedEnemy({ nome: "Encourado" });
    await open();
    await screen.findByDisplayValue("Encourado");
    await userEvent.click(
      screen.getByRole("button", { name: "+ Novo inimigo" })
    );

    const names = await screen.findAllByRole("textbox", {
      name: "Nome do inimigo",
    });
    expect(names.map((n) => (n as HTMLInputElement).value)).toEqual([
      "Encourado",
      "",
    ]);
    expect(names[1]).toHaveFocus();
    const novo = editor("Inimigo sem nome");
    expect(
      within(novo).getByRole("checkbox", { name: "Jogadores veem os dados" })
    ).not.toBeChecked();
    expect(within(novo).getByLabelText("Vitalidade máxima")).toHaveTextContent(
      "5"
    );
    expect(
      within(novo).getByLabelText("Força de vontade máxima")
    ).toHaveTextContent("3");
    expect(
      within(novo).getByRole("button", { name: "Colocar na rodada" })
    ).toBeInTheDocument();
    expect(fakeApi.enemies()).toHaveLength(2);
    expect(fakeApi.round().ordem).toEqual([]);
  });

  it("−/+ muda o máximo e as caixas ciclam o dano, com gravação", async () => {
    const { id } = fakeApi.seedEnemy({ nome: "Encourado" });
    await open();
    const region = await screen.findByRole("region", { name: "Encourado" });
    await userEvent.click(
      within(region).getByRole("button", { name: "Aumentar Vitalidade" })
    );
    expect(
      within(region).getByLabelText("Vitalidade máxima")
    ).toHaveTextContent("6");
    const vit = within(region).getByRole("group", { name: "Vitalidade" });
    expect(within(vit).getAllByRole("button")).toHaveLength(6);
    await userEvent.click(
      within(vit).getByRole("button", { name: "Vitalidade 1: vazio" })
    );
    await userEvent.click(
      within(vit).getByRole("button", { name: "Vitalidade 1: superficial" })
    );
    expect(
      within(vit).getByRole("button", { name: "Vitalidade 1: agravado" })
    ).toBeInTheDocument();
    await waitFor(() =>
      expect(fakeApi.enemies().find((e) => e.id === id)?.enemy).toMatchObject({
        vit: [2, 0, 0, 0, 0, 0],
        vitMax: 6,
      })
    );
  });

  it("parada e especial são gravados", async () => {
    const { id } = fakeApi.seedEnemy({ nome: "Encourado" });
    await open();
    const region = await screen.findByRole("region", { name: "Encourado" });
    await userEvent.click(
      within(region).getByRole("button", { name: "+ Parada" })
    );
    await userEvent.type(
      within(region).getByRole("textbox", { name: "Nome da parada 1" }),
      "Garras"
    );
    const dados = within(region).getByRole("spinbutton", {
      name: "Dados da parada Garras",
    });
    await userEvent.clear(dados);
    await userEvent.type(dados, "7");

    await userEvent.click(
      within(region).getByRole("button", { name: "+ Especial" })
    );
    await userEvent.type(
      within(region).getByRole("textbox", { name: "Nome do especial 1" }),
      "Garras"
    );
    await userEvent.type(
      within(region).getByRole("textbox", { name: "Texto do especial Garras" }),
      "Garras agravadas"
    );
    await waitFor(() =>
      expect(fakeApi.enemies().find((e) => e.id === id)?.enemy).toMatchObject({
        especiais: [{ nome: "Garras", texto: "Garras agravadas" }],
        paradas: [{ dados: 7, nome: "Garras" }],
      })
    );
  });

  it("a barra de formatação aplica o comando no texto", async () => {
    fakeApi.seedEnemy({
      especiais: [{ nome: "Garras", texto: "<p>Garras agravadas</p>" }],
      nome: "Encourado",
    });
    const exec = vi.fn(() => true);
    document.execCommand = exec;
    await open();
    const region = await screen.findByRole("region", { name: "Encourado" });
    expect(
      within(region).getByRole("textbox", { name: "Texto do especial Garras" })
    ).toHaveTextContent("Garras agravadas");
    await userEvent.click(
      within(region).getByRole("button", { name: "Negrito" })
    );
    expect(exec).toHaveBeenCalledWith("bold", false, undefined);
    await userEvent.click(
      within(region).getByRole("button", { name: "Lista numerada" })
    );
    expect(exec).toHaveBeenCalledWith("insertOrderedList", false, undefined);
  });

  it("colocar e tirar da rodada", async () => {
    const { id } = fakeApi.seedEnemy({ nome: "Encourado" });
    await open();
    const region = await screen.findByRole("region", { name: "Encourado" });
    await userEvent.click(
      within(region).getByRole("button", { name: "Colocar na rodada" })
    );
    expect(
      await within(region).findByRole("button", { name: "Na rodada · tirar" })
    ).toBeInTheDocument();
    expect(fakeApi.round().ordem).toEqual([
      { id, iniciativa: null, tipo: "inimigo" },
    ]);
    await userEvent.click(
      within(region).getByRole("button", { name: "Na rodada · tirar" })
    );
    expect(
      await within(region).findByRole("button", { name: "Colocar na rodada" })
    ).toBeInTheDocument();
    expect(fakeApi.round().ordem).toEqual([]);
  });

  it("duplicar cria a cópia no fim, sem dano e fora da rodada", async () => {
    const { id } = fakeApi.seedEnemy({
      nome: "Encourado",
      paradas: [{ dados: 7, nome: "Garras" }],
      vit: [1, 2],
    });
    fakeApi.seedRound({ ordem: [{ id, iniciativa: null, tipo: "inimigo" }] });
    await open();
    const region = await screen.findByRole("region", { name: "Encourado" });
    await userEvent.click(
      within(region).getByRole("button", { name: "Duplicar" })
    );
    const copy = await screen.findByRole("region", {
      name: "Encourado (cópia)",
    });
    expect(
      within(copy).getByRole("button", { name: "Colocar na rodada" })
    ).toBeInTheDocument();
    expect(fakeApi.enemies()[1]?.enemy).toMatchObject({
      nome: "Encourado (cópia)",
      paradas: [{ dados: 7, nome: "Garras" }],
      vit: [],
    });
  });

  it("excluir pede confirmação e tira da rodada", async () => {
    const { id } = fakeApi.seedEnemy({ nome: "Encourado" });
    fakeApi.seedRound({ ordem: [{ id, iniciativa: null, tipo: "inimigo" }] });
    await open();
    const region = await screen.findByRole("region", { name: "Encourado" });
    await userEvent.click(
      within(region).getByRole("button", { name: "Excluir" })
    );
    const dialog = await screen.findByRole("dialog");
    expect(
      within(dialog).getByText("Excluir Encourado do bestiário?")
    ).toBeInTheDocument();
    await userEvent.click(
      within(dialog).getByRole("button", { name: "Excluir" })
    );
    expect(
      await screen.findByText("Nenhum inimigo no bestiário ainda.")
    ).toBeInTheDocument();
    expect(fakeApi.enemies()).toEqual([]);
    expect(fakeApi.round().ordem).toEqual([]);
  });
});
