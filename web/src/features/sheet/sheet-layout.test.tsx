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
    owner: { email: "jogador@exemplo.com", userId: "u1" },
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
  const list = createRoute({
    component: () => <div>Página da lista</div>,
    getParentRoute: () => root,
    path: "/personagens",
  });
  const router = createRouter({
    history: createMemoryHistory({ initialEntries: [url] }),
    routeTree: root.addChildren([
      ficha.addChildren([fichaAba]),
      player.addChildren([playerAba]),
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

  it("jogador: sem faixa do Mestre", async () => {
    renderLayout("player", "/ficha/acoes");
    await screen.findByText("conteúdo");
    expect(screen.queryByText(MODO_MESTRE)).toBeNull();
  });

  it("Mestre: faixa acima do cabeçalho e cabeçalho sem MESTRE", async () => {
    const router = renderLayout("dm", "/personagens/u1/caracteristicas");
    await screen.findByText("conteúdo");
    expect(within(header()).queryByText(MESTRE)).toBeNull();
    const faixa = screen.getByText(
      "Modo Mestre · Vitória Salles · Ficha de jogador"
    ).parentElement as HTMLElement;
    expect(faixa).toHaveClass("bg-blood");
    expect(header().previousElementSibling).toBe(faixa);
    expect(
      within(faixa).getByRole("button", { name: "Sair" })
    ).toBeInTheDocument();

    await userEvent.click(
      within(faixa).getByRole("link", { name: "Lista de personagens" })
    );
    expect(await screen.findByText("Página da lista")).toBeInTheDocument();
    expect(router.state.location.pathname).toBe("/personagens");
  });

  it("Mestre: abas dentro de /personagens", async () => {
    const router = renderLayout("dm", "/personagens/u1/caracteristicas");
    await screen.findByText("conteúdo");

    await userEvent.click(screen.getByLabelText("Abrir menu"));
    const menu = screen.getByRole("dialog");
    expect(within(menu).getByText("jogador@exemplo.com")).toBeInTheDocument();
    expect(
      within(menu).getByRole("link", { name: "Rolagens" })
    ).toHaveAttribute("href", "/personagens/u1/rolagens");
    const items = [...within(menu).getByRole("navigation").children].map(
      (el) => el.textContent
    );
    expect(items.slice(-2)).toEqual(["Lista de personagens", "Sair"]);

    await userEvent.click(
      within(menu).getByRole("link", { name: "Lista de personagens" })
    );
    expect(await screen.findByText("Página da lista")).toBeInTheDocument();
    expect(router.state.location.pathname).toBe("/personagens");
  });
});
