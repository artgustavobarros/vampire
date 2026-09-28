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
import { toast } from "sonner";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Toaster } from "#/components/ui/sonner";
import { InfoProvider } from "#/features/info/info-sheet";
import type { Role } from "#/lib/api";
import { blankSheet } from "#/lib/sheet";
import { Route as PersonagensRoute } from "#/routes/personagens";
import { Route as PainelRoute } from "#/routes/personagens._painel";
import { Route as AcoesRoute } from "#/routes/personagens._painel.acoes";
import { Route as PlayerSheetRoute } from "#/routes/personagens.$id";
import { Route as AbaRoute } from "#/routes/personagens.$id.$aba";
import { useCharacterStore } from "#/stores/character-store";
import { resetStores } from "#/stores/test-utils";
import { fakeApi } from "#/test/fake-api";

const PAINEL_TABS = [
  ["coteries", "Página das coteries"],
  ["rodada", "Página da rodada"],
  ["bestiario", "Página do bestiário"],
] as const;

function renderAt(
  url: string,
  role: Role = "dm",
  { realAba = false }: { realAba?: boolean } = {}
) {
  if (role === "dm") {
    fakeApi.login(null, "admin@admin.com", "dm");
  } else {
    fakeApi.login({ ...blankSheet(), criada: true }, "eu@exemplo.com");
  }
  const root = createRootRoute({
    component: () => (
      <InfoProvider>
        <Outlet />
        <Toaster bottom={16} />
      </InfoProvider>
    ),
  });
  const personagens = createRoute({
    component: PersonagensRoute.options.component,
    getParentRoute: () => root,
    path: "/personagens",
  });
  const painel = createRoute({
    component: PainelRoute.options.component,
    getParentRoute: () => personagens,
    id: "_painel",
  });
  const list = createRoute({
    component: () => <div>Página da lista</div>,
    getParentRoute: () => painel,
    path: "/",
  });
  const acoes = createRoute({
    component: AcoesRoute.options.component,
    getParentRoute: () => painel,
    path: "acoes",
  });
  const tabs = PAINEL_TABS.map(([path, text]) =>
    createRoute({
      component: () => <div>{text}</div>,
      getParentRoute: () => painel,
      path,
    })
  );
  const player = createRoute({
    component: PlayerSheetRoute.options.component,
    getParentRoute: () => personagens,
    path: "$id",
  });
  const aba = createRoute({
    component: realAba
      ? AbaRoute.options.component
      : () => <div>conteúdo da aba</div>,
    getParentRoute: () => player,
    path: "$aba",
  });
  const ficha = createRoute({
    component: () => <div>Página da ficha</div>,
    getParentRoute: () => root,
    path: "/ficha",
  });
  const entrar = createRoute({
    component: () => <div>Página de entrada</div>,
    getParentRoute: () => root,
    path: "/entrar",
  });
  const router = createRouter({
    history: createMemoryHistory({ initialEntries: [url] }),
    routeTree: root.addChildren([
      personagens.addChildren([
        painel.addChildren([list, acoes, ...tabs]),
        player.addChildren([aba]),
      ]),
      ficha,
      entrar,
    ]),
  });
  render(<RouterProvider router={router} />);
  return router;
}

afterEach(() => {
  toast.dismiss();
  resetStores();
});

describe("rotas do Mestre", () => {
  it("entra no painel com a Lista de personagens ativa", async () => {
    renderAt("/personagens");
    expect(await screen.findByText("Página da lista")).toBeInTheDocument();
    expect(screen.getByText("Ana")).toBeInTheDocument();
    expect(screen.getByText("Mestre")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Lista de personagens" })
    ).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Ações" })).not.toHaveAttribute(
      "aria-current"
    );
  });

  it("a aba Ações abre a Rolagem de Ressonância", async () => {
    const router = renderAt("/personagens");
    await userEvent.click(await screen.findByRole("link", { name: "Ações" }));
    expect(
      await screen.findByText("Rolagem de Ressonância")
    ).toBeInTheDocument();
    expect(router.state.location.pathname).toBe("/personagens/acoes");
    expect(screen.getByRole("link", { name: "Ações" })).toHaveAttribute(
      "aria-current",
      "page"
    );
    expect(
      screen.getByRole("link", { name: "Lista de personagens" })
    ).not.toHaveAttribute("aria-current");
  });

  it("Sair da conta encerra a sessão", async () => {
    const router = renderAt("/personagens/acoes");
    await userEvent.click(
      await screen.findByRole("button", { name: "Sair da conta" })
    );
    expect(await screen.findByText("Página de entrada")).toBeInTheDocument();
    expect(router.state.location.pathname).toBe("/entrar");
  });

  it("jogador que abre Ações volta para a própria ficha", async () => {
    const router = renderAt("/personagens/acoes", "player");
    expect(await screen.findByText("Página da ficha")).toBeInTheDocument();
    expect(router.state.location.pathname).toBe("/ficha");
  });

  it("abre a ficha do jogador com o layout da ficha", async () => {
    const ana = fakeApi.seed({
      email: "ana@exemplo.com",
      sheet: { ...blankSheet(), criada: true, nome: "Vitória Salles" },
    });
    renderAt(`/personagens/${ana.id}/rolagens`);
    expect(await screen.findByText("conteúdo da aba")).toBeInTheDocument();
    expect(screen.getByText("Vitória Salles")).toBeInTheDocument();
    expect(
      screen.getByText("Modo Mestre · Vitória Salles · Ficha de jogador")
    ).toBeInTheDocument();
    // a ficha fica fora do painel
    expect(screen.queryByText("Sair da conta")).toBeNull();
    expect(useCharacterStore.getState().owner).toEqual({
      email: "ana@exemplo.com",
      userId: ana.id,
    });
  });

  it("Sair na faixa do Mestre encerra a sessão", async () => {
    const ana = fakeApi.seed({
      email: "ana@exemplo.com",
      sheet: { ...blankSheet(), criada: true, nome: "Vitória Salles" },
    });
    const router = renderAt(`/personagens/${ana.id}/caracteristicas`);
    await screen.findByText("conteúdo da aba");
    await userEvent.click(screen.getByRole("button", { name: "Sair" }));
    expect(await screen.findByText("Página de entrada")).toBeInTheDocument();
    expect(router.state.location.pathname).toBe("/entrar");
  });

  it("jogador inexistente volta para a lista com aviso", async () => {
    const router = renderAt("/personagens/user-x/caracteristicas");
    expect(await screen.findByText("Página da lista")).toBeInTheDocument();
    expect(screen.getByText("Jogador não encontrado.")).toBeInTheDocument();
    expect(router.state.location.pathname).toBe("/personagens");
  });

  it("jogador sem personagem volta para a lista com aviso", async () => {
    const bruno = fakeApi.seed({ email: "bruno@exemplo.com" });
    renderAt(`/personagens/${bruno.id}/caracteristicas`);
    expect(await screen.findByText("Página da lista")).toBeInTheDocument();
    expect(
      screen.getByText("Este jogador ainda não criou o personagem.")
    ).toBeInTheDocument();
  });

  it("jogador que abre a lista volta para a própria ficha", async () => {
    const router = renderAt("/personagens", "player");
    expect(await screen.findByText("Página da ficha")).toBeInTheDocument();
    expect(router.state.location.pathname).toBe("/ficha");
  });

  it("o painel tem as cinco abas, nessa ordem", async () => {
    renderAt("/personagens");
    await screen.findByText("Página da lista");
    const nav = screen.getByRole("navigation");
    expect(
      within(nav)
        .getAllByRole("link")
        .map((l) => l.textContent)
    ).toEqual([
      "Lista de personagens",
      "Coteries",
      "Ações",
      "Rodada",
      "Bestiário",
    ]);
  });

  it.each([
    ["/personagens/coteries", "Coteries", "Página das coteries"],
    ["/personagens/rodada", "Rodada", "Página da rodada"],
    ["/personagens/bestiario", "Bestiário", "Página do bestiário"],
  ])("em %s só a aba %s fica ativa", async (url, tab, text) => {
    renderAt(url);
    expect(await screen.findByText(text)).toBeInTheDocument();
    const active = within(screen.getByRole("navigation"))
      .getAllByRole("link")
      .filter((l) => l.getAttribute("aria-current") === "page");
    expect(active.map((l) => l.textContent)).toEqual([tab]);
  });

  it.each(["coteries", "rodada", "bestiario", "acoes"])(
    "jogador que abre /personagens/%s volta para a própria ficha",
    async (path) => {
      const router = renderAt(`/personagens/${path}`, "player");
      expect(await screen.findByText("Página da ficha")).toBeInTheDocument();
      expect(router.state.location.pathname).toBe("/ficha");
    }
  );

  it("na ficha aberta pelo Mestre, a aba Rodada volta para Características", async () => {
    const ana = fakeApi.seed({
      email: "ana@exemplo.com",
      sheet: { ...blankSheet(), criada: true, nome: "Vitória Salles" },
    });
    const router = renderAt(`/personagens/${ana.id}/rodada`, "dm", {
      realAba: true,
    });
    await screen.findByText("Modo Mestre · Vitória Salles · Ficha de jogador");
    await vi.waitFor(() =>
      expect(router.state.location.pathname).toBe(
        `/personagens/${ana.id}/caracteristicas`
      )
    );
  });
});
