import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
} from "@tanstack/react-router";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { InfoProvider } from "#/features/info/info-sheet";
import type { Role } from "#/lib/api";
import { blankSheet } from "#/lib/sheet";
import { useCharacterStore } from "#/stores/character-store";
import { usePlayerStore } from "#/stores/player-store";
import { resetStores } from "#/stores/test-utils";
import { SheetLayout } from "./sheet-layout";

function renderLayout(role: Role, url: string) {
  usePlayerStore.setState({ role, user: "eu@exemplo.com" });
  useCharacterStore.setState({
    owner: {
      email: "jogador@exemplo.com",
      name: "Jogador",
      userId: "u1",
      username: "jogador",
    },
    sheet: { ...blankSheet(), criada: true, nome: "Vitória Salles" },
  });
  const root = createRootRoute({
    component: () => (
      <InfoProvider>
        <Outlet />
      </InfoProvider>
    ),
  });
  const ficha = createRoute({
    component: () => <SheetLayout tabs={{ to: "/ficha/$aba" }} />,
    getParentRoute: () => root,
    path: "/ficha",
  });
  const fichaAba = createRoute({
    component: () => <div>conteúdo</div>,
    getParentRoute: () => ficha,
    path: "$aba",
  });
  const fichaConta = createRoute({
    component: () => <div>página da conta</div>,
    getParentRoute: () => ficha,
    path: "conta",
  });
  const player = createRoute({
    component: () => (
      <SheetLayout tabs={{ id: "u1", to: "/personagens/$id/$aba" }} />
    ),
    getParentRoute: () => root,
    path: "/personagens/$id",
  });
  const playerAba = createRoute({
    component: () => <div>conteúdo</div>,
    getParentRoute: () => player,
    path: "$aba",
  });
  const playerConta = createRoute({
    component: () => <div>conta do jogador</div>,
    getParentRoute: () => player,
    path: "conta",
  });
  const list = createRoute({
    component: () => <div>Página da lista</div>,
    getParentRoute: () => root,
    path: "/personagens",
  });
  const router = createRouter({
    history: createMemoryHistory({ initialEntries: [url] }),
    routeTree: root.addChildren([
      ficha.addChildren([fichaAba, fichaConta]),
      player.addChildren([playerAba, playerConta]),
      list,
    ]),
  });
  render(<RouterProvider router={router} />);
  return router;
}

const header = () => screen.getByRole("banner");
const ACOES = /ações/i;
const MESTRE = /mestre/i;
const MODO_MESTRE = /modo mestre/i;
const REFAZER = /refazer/i;

describe("cabeçalho e menu da ficha", () => {
  beforeEach(resetStores);

  it("jogador: só o nome no cabeçalho, sem rótulo da aba nem Mestre", async () => {
    renderLayout("player", "/ficha/acoes");
    await screen.findByText("conteúdo");
    expect(within(header()).getByText("Vitória Salles")).toBeInTheDocument();
    expect(within(header()).queryByText(ACOES)).toBeNull();
    expect(within(header()).queryByText(MESTRE)).toBeNull();
  });

  it("jogador: menu sem Lista de personagens nem Refazer", async () => {
    renderLayout("player", "/ficha/acoes");
    await userEvent.click(await screen.findByLabelText("Abrir menu"));
    const menu = screen.getByRole("dialog");
    expect(
      within(menu).getByRole("link", { name: "Rolagens" })
    ).toHaveAttribute("href", "/ficha/rolagens");
    expect(within(menu).queryByText("Notas")).toBeNull();
    expect(within(menu).queryByText("Lista de personagens")).toBeNull();
    expect(within(menu).queryByText(REFAZER)).toBeNull();
    expect(within(menu).getByText("Sair")).toBeInTheDocument();
  });

  it("jogador: Conta abre /ficha/conta e fica destacada no menu", async () => {
    const router = renderLayout("player", "/ficha/acoes");
    await userEvent.click(await screen.findByLabelText("Abrir menu"));
    const menu = screen.getByRole("dialog");
    expect(within(menu).getByText("@jogador")).toBeInTheDocument();
    const items = [...within(menu).getByRole("navigation").children].map(
      (el) => el.textContent
    );
    expect(items.slice(-2)).toEqual(["Conta", "Sair"]);

    await userEvent.click(within(menu).getByRole("link", { name: "Conta" }));
    expect(await screen.findByText("página da conta")).toBeInTheDocument();
    expect(router.state.location.pathname).toBe("/ficha/conta");

    await userEvent.click(screen.getByLabelText("Abrir menu"));
    const reopened = screen.getByRole("dialog");
    expect(
      within(reopened).getByRole("link", { name: "Conta" })
    ).toHaveAttribute("aria-current", "page");
    expect(
      within(reopened).getByRole("link", { name: "Características" })
    ).not.toHaveAttribute("aria-current");
  });

  it("link direto para /ficha/conta abre a conta, não uma aba", async () => {
    const router = renderLayout("player", "/ficha/conta");
    expect(await screen.findByText("página da conta")).toBeInTheDocument();
    expect(screen.queryByText("conteúdo")).toBeNull();
    expect(router.state.location.pathname).toBe("/ficha/conta");
  });

  it("Mestre: Conta abre a conta do jogador da ficha", async () => {
    const router = renderLayout("dm", "/personagens/u1/caracteristicas");
    await userEvent.click(await screen.findByLabelText("Abrir menu"));
    await userEvent.click(
      within(screen.getByRole("dialog")).getByRole("link", { name: "Conta" })
    );
    expect(await screen.findByText("conta do jogador")).toBeInTheDocument();
    expect(router.state.location.pathname).toBe("/personagens/u1/conta");
  });

  it("jogador: sem faixa do Mestre", async () => {
    renderLayout("player", "/ficha/acoes");
    await screen.findByText("conteúdo");
    expect(screen.queryByText(MODO_MESTRE)).toBeNull();
  });

  it("Mestre: faixa acima do cabeçalho e cabeçalho sem MESTRE", async () => {
    renderLayout("dm", "/personagens/u1/caracteristicas");
    await screen.findByText("conteúdo");
    expect(within(header()).queryByText(MESTRE)).toBeNull();
    const faixa = screen.getByText("Modo Mestre");
    expect(faixa).toHaveClass("bg-blood");
    expect(header().previousElementSibling).toBe(faixa);
    expect(within(faixa).queryByRole("link")).toBeNull();
    expect(within(faixa).queryByRole("button")).toBeNull();
  });

  it("Mestre: abas dentro de /personagens", async () => {
    const router = renderLayout("dm", "/personagens/u1/caracteristicas");
    await screen.findByText("conteúdo");

    await userEvent.click(screen.getByLabelText("Abrir menu"));
    const menu = screen.getByRole("dialog");
    expect(within(menu).getByText("@jogador")).toBeInTheDocument();
    expect(
      within(menu).getByRole("link", { name: "Rolagens" })
    ).toHaveAttribute("href", "/personagens/u1/rolagens");
    const items = [...within(menu).getByRole("navigation").children].map(
      (el) => el.textContent
    );
    expect(items.slice(-3)).toEqual(["Conta", "Lista de personagens", "Sair"]);

    await userEvent.click(
      within(menu).getByRole("link", { name: "Lista de personagens" })
    );
    expect(await screen.findByText("Página da lista")).toBeInTheDocument();
    expect(router.state.location.pathname).toBe("/personagens");
  });
});
