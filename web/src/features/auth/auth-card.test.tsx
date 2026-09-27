import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
} from "@tanstack/react-router";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { toast } from "sonner";
import { afterEach, describe, expect, it } from "vitest";
import { Toaster } from "#/components/ui/sonner";
import { resetStores } from "#/stores/test-utils";
import { fakeApi } from "#/test/fake-api";
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
  const criar = createRoute({
    component: () => <div>Assistente</div>,
    getParentRoute: () => root,
    path: "/criar",
  });
  const router = createRouter({
    history: createMemoryHistory({ initialEntries: ["/entrar"] }),
    routeTree: root.addChildren([entrar, criar]),
  });
  render(<RouterProvider router={router} />);
}

afterEach(() => {
  toast.dismiss();
  resetStores();
});

function fillLogin(password: string) {
  fireEvent.change(screen.getByLabelText("E-mail"), {
    target: { value: "ana@exemplo.com" },
  });
  fireEvent.change(screen.getByLabelText("Senha"), {
    target: { value: password },
  });
}

describe("AuthCard", () => {
  it("erro de entrada sai como toast, não dentro do formulário", async () => {
    fakeApi.seed({ email: "ana@exemplo.com", password: "123456" });
    renderLogin();
    await screen.findByLabelText("E-mail");
    fillLogin("errada");
    fireEvent.click(screen.getByRole("button", { name: "Entrar" }));

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("E-mail ou senha incorretos.");
    expect(alert.closest("form")).toBeNull();
    const form = screen.getByRole("button", { name: "Entrar" }).closest("form");
    expect(
      form && within(form).queryByText("E-mail ou senha incorretos.")
    ).toBeNull();
  });

  it("fica ocupado enquanto a API responde e não envia duas vezes", async () => {
    fakeApi.seed({ email: "ana@exemplo.com", password: "123456" });
    renderLogin();
    await screen.findByLabelText("E-mail");
    fillLogin("123456");
    fireEvent.click(screen.getByRole("button", { name: "Entrar" }));
    const busy = screen.getByRole("button", { name: "Entrando…" });
    expect(busy).toBeDisabled();
    fireEvent.submit(busy.closest("form") as HTMLFormElement);
    expect(await screen.findByText("Assistente")).toBeInTheDocument();
    expect(fakeApi.calls.filter((c) => c.path === "/auth/login")).toHaveLength(
      1
    );
  });

  it("sem conexão volta a aceitar envio", async () => {
    fakeApi.fail("network");
    renderLogin();
    await screen.findByLabelText("E-mail");
    fillLogin("123456");
    fireEvent.click(screen.getByRole("button", { name: "Entrar" }));
    expect(await screen.findByText("Sem conexão")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Entrar" })).toBeEnabled();
  });
});
