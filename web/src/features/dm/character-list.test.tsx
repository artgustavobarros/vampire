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
import { afterEach, describe, expect, it } from "vitest";
import { Toaster } from "#/components/ui/sonner";
import { blankSheet } from "#/lib/sheet";
import { resetStores } from "#/stores/test-utils";
import { fakeApi } from "#/test/fake-api";
import { CharacterList } from "./character-list";

function renderList() {
  fakeApi.login(null, "admin@admin.com", "dm");
  const root = createRootRoute({
    component: () => (
      <>
        <Outlet />
        <Toaster bottom={16} />
      </>
    ),
  });
  const list = createRoute({
    component: CharacterList,
    getParentRoute: () => root,
    path: "/personagens",
  });
  const sheet = createRoute({
    component: () => <div>Ficha aberta</div>,
    getParentRoute: () => root,
    path: "/personagens/$id/$aba",
  });
  const router = createRouter({
    history: createMemoryHistory({ initialEntries: ["/personagens"] }),
    routeTree: root.addChildren([list, sheet]),
  });
  render(<RouterProvider router={router} />);
  return router;
}

afterEach(() => {
  toast.dismiss();
  resetStores();
});

describe("Lista de personagens", () => {
  it("mostra um cartão por jogador, com e sem personagem", async () => {
    const vitoria = fakeApi.seed({
      email: "exemplo@ficha.local",
      name: "Ana",
      sheet: {
        ...blankSheet(),
        attrs: {
          ...blankSheet().attrs,
          Autocontrole: 2,
          Determinação: 3,
          Vigor: 2,
        },
        cla: "Ventrue",
        criada: true,
        fome: 1,
        nome: "Vitória Salles",
      },
    });
    fakeApi.seed({ email: "bruno@exemplo.com", name: "Bruno" });

    const router = renderList();
    const cards = await screen.findAllByRole("article");
    expect(cards).toHaveLength(2);

    const [ana, bruno] = cards;
    expect(within(ana).getByText("Vitória Salles")).toBeInTheDocument();
    expect(within(ana).getByText("Ventrue")).toBeInTheDocument();
    expect(within(ana).getByText("exemplo@ficha.local")).toBeInTheDocument();
    expect(within(ana).getAllByText("5/5")).toHaveLength(2);

    expect(within(bruno).getByText("Bruno")).toBeInTheDocument();
    expect(within(bruno).getByText("Ainda sem personagem")).toBeInTheDocument();
    expect(within(bruno).queryByText("Ver ficha")).toBeNull();

    await userEvent.click(within(ana).getByRole("link", { name: "Ver ficha" }));
    expect(await screen.findByText("Ficha aberta")).toBeInTheDocument();
    expect(router.state.location.pathname).toBe(
      `/personagens/${vitoria.id}/caracteristicas`
    );
  });

  it("sem jogadores avisa que a lista está vazia", async () => {
    renderList();
    expect(
      await screen.findByText("Nenhum jogador cadastrado ainda.")
    ).toBeInTheDocument();
  });

  it("falha ao buscar mostra o erro com Tentar de novo", async () => {
    fakeApi.fail("network");
    renderList();
    const retry = await screen.findByRole("button", { name: "Tentar de novo" });
    fakeApi.fail(null);
    // o toast do sonner usa pointer capture, que o jsdom não tem
    retry.click();
    expect(
      await screen.findByText("Nenhum jogador cadastrado ainda.")
    ).toBeInTheDocument();
  });
});
