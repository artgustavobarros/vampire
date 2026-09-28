import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
} from "@tanstack/react-router";
import { render } from "@testing-library/react";

import type { ReactNode } from "react";
import { Toaster } from "#/components/ui/sonner";

/**
 * Renderiza `component` em `/pagina`, com o Toaster e uma rota de ficha
 * (`/personagens/$id/$aba`) para os links "Ver ficha".
 */
export function renderRoute(component: () => ReactNode) {
  const root = createRootRoute({
    component: () => (
      <>
        <Outlet />
        <Toaster bottom={16} />
      </>
    ),
  });
  const page = createRoute({
    component,
    getParentRoute: () => root,
    path: "/pagina",
  });
  const sheet = createRoute({
    component: () => <div>Ficha aberta</div>,
    getParentRoute: () => root,
    path: "/personagens/$id/$aba",
  });
  const router = createRouter({
    history: createMemoryHistory({ initialEntries: ["/pagina"] }),
    routeTree: root.addChildren([page, sheet]),
  });
  render(<RouterProvider router={router} />);
  return router;
}
