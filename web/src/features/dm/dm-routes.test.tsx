import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
} from "@tanstack/react-router";
import { render, screen } from "@testing-library/react";
import { toast } from "sonner";
import { afterEach, describe, expect, it } from "vitest";
import { Toaster } from "#/components/ui/sonner";
import { InfoProvider } from "#/features/info/info-sheet";
import type { Role } from "#/lib/api";
import { blankSheet } from "#/lib/sheet";
import { Route as PersonagensRoute } from "#/routes/personagens";
import { Route as PlayerSheetRoute } from "#/routes/personagens.$id";
import { useCharacterStore } from "#/stores/character-store";
import { resetStores } from "#/stores/test-utils";
import { fakeApi } from "#/test/fake-api";

function renderAt(url: string, role: Role = "dm") {
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
  const list = createRoute({
    component: () => <div>Página da lista</div>,
    getParentRoute: () => personagens,
    path: "/",
  });
  const player = createRoute({
    component: PlayerSheetRoute.options.component,
    getParentRoute: () => personagens,
    path: "$id",
  });
  const aba = createRoute({
    component: () => <div>conteúdo da aba</div>,
    getParentRoute: () => player,
    path: "$aba",
  });
  const ficha = createRoute({
    component: () => <div>Página da ficha</div>,
    getParentRoute: () => root,
    path: "/ficha",
  });
  const router = createRouter({
    history: createMemoryHistory({ initialEntries: [url] }),
    routeTree: root.addChildren([
      personagens.addChildren([list, player.addChildren([aba])]),
      ficha,
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
  it("abre a ficha do jogador com o layout da ficha", async () => {
    const ana = fakeApi.seed({
      email: "ana@exemplo.com",
      sheet: { ...blankSheet(), criada: true, nome: "Vitória Salles" },
    });
    renderAt(`/personagens/${ana.id}/notas`);
    expect(await screen.findByText("conteúdo da aba")).toBeInTheDocument();
    expect(screen.getByText("Vitória Salles")).toBeInTheDocument();
    expect(useCharacterStore.getState().owner).toEqual({
      email: "ana@exemplo.com",
      userId: ana.id,
    });
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
});
