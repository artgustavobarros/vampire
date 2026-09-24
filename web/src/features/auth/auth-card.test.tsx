import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
} from "@tanstack/react-router";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Toaster } from "#/components/ui/sonner";
import { authenticate } from "#/lib/auth";
import { resetStores } from "#/stores/test-utils";
import { AuthCard } from "./auth-card";

function renderLogin() {
  const root = createRootRoute({
    component: () => (
      <>
        <Outlet />
        <Toaster bottom={16} />
      </>
    ),
  });
  const entrar = createRoute({
    component: () => <AuthCard mode="login" />,
    getParentRoute: () => root,
    path: "/entrar",
  });
  const router = createRouter({
    history: createMemoryHistory({ initialEntries: ["/entrar"] }),
    routeTree: root.addChildren([entrar]),
  });
  render(<RouterProvider router={router} />);
}

afterEach(() => {
  resetStores();
});

describe("AuthCard", () => {
  it("erro de entrada sai como toast, não dentro do formulário", async () => {
    authenticate(
      {
        email: "ana@exemplo.com",
        mode: "signup",
        name: "Ana",
        password: "123",
        password2: "123",
      },
      { exampleData: false }
    );
    resetStores();
    renderLogin();
    fireEvent.change(await screen.findByLabelText("E-mail"), {
      target: { value: "ana@exemplo.com" },
    });
    fireEvent.change(screen.getByLabelText("Senha"), {
      target: { value: "errada" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Entrar" }));

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("Senha incorreta.");
    expect(alert.closest("form")).toBeNull();
    const form = screen.getByRole("button", { name: "Entrar" }).closest("form");
    expect(form && within(form).queryByText("Senha incorreta.")).toBeNull();
  });
});
