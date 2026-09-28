import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";
import { afterEach, describe, expect, it } from "vitest";
import { CoterieTab } from "#/features/sheet/tabs/coterie-tab";
import { blankSheet } from "#/lib/sheet";
import { resetStores } from "#/stores/test-utils";
import { fakeApi } from "#/test/fake-api";
import { renderRoute } from "#/test/render-route";
import { CoteriesPage } from "./coteries-page";

const INTRO = /Cada jogador vê, na aba Coterie da própria ficha/;
const EMAIL = /@exemplo.com/;

const vitoriaSheet = {
  ...blankSheet(),
  attrs: { ...blankSheet().attrs, Autocontrole: 3, Determinação: 2, Vigor: 2 },
  cla: "Ventrue",
  criada: true,
  fome: 1,
  nome: "Vitória Salles",
  notas: "segredo da Vitória",
};

function seedPlayers() {
  const vitoria = fakeApi.seed({
    email: "vitoria@exemplo.com",
    name: "Ana",
    sheet: vitoriaSheet,
  });
  const bento = fakeApi.seed({
    email: "bento@exemplo.com",
    name: "Bento",
    sheet: { ...blankSheet(), cla: "Brujah", criada: true, nome: "Bento" },
  });
  const rascunho = fakeApi.seed({
    email: "rascunho@exemplo.com",
    name: "Rascunho",
    sheet: { ...blankSheet(), nome: "Em criação" },
  });
  return { bento, rascunho, vitoria };
}

const panel = (name: string) => screen.getByRole("region", { name });
const selectIn = (region: HTMLElement) => within(region).getByRole("combobox");
const options = (region: HTMLElement) =>
  within(selectIn(region))
    .getAllByRole("option")
    .map((o) => o.textContent);

afterEach(() => {
  toast.dismiss();
  resetStores();
});

describe("Coteries do Mestre", () => {
  it("sem coteries mostra o texto e o botão", async () => {
    fakeApi.login(null, "admin@admin.com", "dm");
    renderRoute(CoteriesPage);
    expect(
      await screen.findByText("Nenhuma coterie ainda.")
    ).toBeInTheDocument();
    expect(screen.getByText(INTRO)).toBeInTheDocument();
  });

  it("cria, renomeia, coloca e retira membros", async () => {
    const { vitoria } = seedPlayers();
    fakeApi.login(null, "admin@admin.com", "dm");
    renderRoute(CoteriesPage);
    await userEvent.click(
      await screen.findByRole("button", { name: "+ Nova coterie" })
    );
    const name = await screen.findByRole("textbox", {
      name: "Nome da coterie",
    });
    expect(name).toHaveFocus();
    const region = panel("Coterie sem nome");
    expect(within(region).getByText("0 membros")).toBeInTheDocument();
    expect(within(region).getByText("Sem membros ainda.")).toBeInTheDocument();
    // na ordem da Lista (pelo jogador: Ana, Bento); quem não criou não aparece
    expect(options(region)).toEqual([
      "+ Colocar personagem…",
      "Vitória Salles",
      "Bento",
    ]);

    await userEvent.type(name, "Os Sem-Sol");
    await userEvent.tab();
    await waitFor(() => expect(fakeApi.coteries()[0]?.nome).toBe("Os Sem-Sol"));

    await userEvent.selectOptions(selectIn(region), vitoria.id);
    const card = await within(region).findByRole("article");
    expect(within(card).getByText("Vitória Salles")).toBeInTheDocument();
    expect(within(card).getByText("Ventrue")).toBeInTheDocument();
    expect(within(card).getByText("Vitalidade · 5/5")).toBeInTheDocument();
    expect(
      within(card).getByText("Força de vontade · 5/5")
    ).toBeInTheDocument();
    expect(within(region).getByText("1 membro")).toBeInTheDocument();
    expect(options(region)).toEqual(["+ Colocar personagem…", "Bento"]);
    expect(
      within(card).getByRole("link", { name: "Ver ficha" })
    ).toHaveAttribute("href", `/personagens/${vitoria.id}/caracteristicas`);

    await userEvent.click(
      within(card).getByRole("button", { name: "Retirar" })
    );
    expect(
      await within(region).findByText("Sem membros ainda.")
    ).toBeInTheDocument();
    expect(fakeApi.coteries()[0]?.membros).toEqual([]);
  });

  it("quem está numa coterie some do seletor das outras", async () => {
    const { vitoria } = seedPlayers();
    fakeApi.seedCoterie("A", [vitoria.id]);
    fakeApi.seedCoterie("B");
    fakeApi.login(null, "admin@admin.com", "dm");
    renderRoute(CoteriesPage);
    await screen.findByDisplayValue("B");
    expect(options(panel("B"))).toEqual(["+ Colocar personagem…", "Bento"]);
  });

  it("excluir pede confirmação", async () => {
    seedPlayers();
    fakeApi.seedCoterie("Mesa");
    fakeApi.login(null, "admin@admin.com", "dm");
    renderRoute(CoteriesPage);
    await screen.findByDisplayValue("Mesa");

    await userEvent.click(
      screen.getByRole("button", { name: "Excluir coterie" })
    );
    const dialog = await screen.findByRole("dialog");
    expect(
      within(dialog).getByText(
        "Excluir a coterie Mesa? Os membros ficam sem coterie."
      )
    ).toBeInTheDocument();
    await userEvent.click(
      within(dialog).getByRole("button", { name: "Cancelar" })
    );
    expect(fakeApi.coteries()).toHaveLength(1);
    expect(fakeApi.calls.some((c) => c.method === "DELETE")).toBe(false);

    await userEvent.click(
      screen.getByRole("button", { name: "Excluir coterie" })
    );
    await userEvent.click(
      within(await screen.findByRole("dialog")).getByRole("button", {
        name: "Excluir",
      })
    );
    expect(
      await screen.findByText("Nenhuma coterie ainda.")
    ).toBeInTheDocument();
    expect(fakeApi.coteries()).toHaveLength(0);
  });
});

describe("aba Coterie do jogador", () => {
  it("mostra a coterie com os cartões, sem botões nem e-mail", async () => {
    // o jogador logado é a Vitória
    const vitoria = fakeApi.login(vitoriaSheet, "vitoria@exemplo.com");
    const bento = fakeApi.seed({
      email: "bento@exemplo.com",
      sheet: { ...blankSheet(), criada: true, nome: "Bento" },
    });
    fakeApi.seedCoterie("Os Sem-Sol", [vitoria.id, bento.id]);
    renderRoute(CoterieTab);
    expect(await screen.findByText("Os Sem-Sol")).toBeInTheDocument();
    const cards = screen.getAllByRole("article");
    expect(
      cards.map((c) => within(c).getByRole("heading").textContent)
    ).toEqual(["Vitória Salles", "Bento"]);
    expect(screen.queryByRole("button")).toBeNull();
    expect(screen.queryByRole("link")).toBeNull();
    expect(screen.queryByText(EMAIL)).toBeNull();
  });

  it("sem coterie mostra o aviso", async () => {
    fakeApi.login({ ...blankSheet(), criada: true }, "eu@exemplo.com");
    renderRoute(CoterieTab);
    expect(
      await screen.findByText(
        "Você ainda não está em uma coterie. Quem monta as coteries é o Mestre."
      )
    ).toBeInTheDocument();
  });
});
