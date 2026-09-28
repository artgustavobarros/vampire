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

function renderAuth(mode: "login" | "signup" = "login") {
  const root = createRootRoute({
    component: () => (
      <>
        <Outlet />
        <Toaster bottom={16} />
      </>
    ),
  });
  const entrar = createRoute({
    component: () => <AuthCard mode={mode} />,
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

function fillLogin(password: string, identifier = "ana@exemplo.com") {
  fireEvent.change(screen.getByLabelText("E-mail ou usuário"), {
    target: { value: identifier },
  });
  fireEvent.change(screen.getByLabelText("Senha"), {
    target: { value: password },
  });
}

describe("AuthCard", () => {
  it("pede e-mail ou usuário antes de chamar a API", async () => {
    renderAuth();
    await screen.findByLabelText("E-mail ou usuário");
    fireEvent.click(screen.getByRole("button", { name: "Entrar" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Informe o e-mail ou usuário."
    );
    expect(fakeApi.calls).toHaveLength(0);
  });

  it("entra pelo nome de usuário", async () => {
    fakeApi.seed({ email: "ana@exemplo.com", password: "123456" });
    renderAuth();
    await screen.findByLabelText("E-mail ou usuário");
    expect(screen.getByLabelText("E-mail ou usuário")).not.toHaveAttribute(
      "type",
      "email"
    );
    fillLogin("123456", "ANA");
    fireEvent.click(screen.getByRole("button", { name: "Entrar" }));

    expect(await screen.findByText("Assistente")).toBeInTheDocument();
    expect(fakeApi.calls[0]?.body).toEqual({
      identifier: "ana",
      password: "123456",
    });
  });

  it("cadastro pede o nome de usuário logo depois do nome", async () => {
    renderAuth("signup");
    await screen.findByLabelText("Nome de usuário");
    const labels = screen
      .getAllByRole("textbox")
      .map((el) => el.id)
      .filter(Boolean);
    expect(labels).toEqual(["auth-name", "auth-username", "auth-email"]);
    expect(screen.getByLabelText("Nome de usuário")).toHaveAttribute(
      "autocomplete",
      "username"
    );

    fireEvent.change(screen.getByLabelText("Nome"), {
      target: { value: "Ana" },
    });
    fireEvent.change(screen.getByLabelText("Nome de usuário"), {
      target: { value: "Ana_S" },
    });
    fireEvent.change(screen.getByLabelText("E-mail"), {
      target: { value: "ana@exemplo.com" },
    });
    fireEvent.change(screen.getByLabelText("Senha"), {
      target: { value: "123456" },
    });
    fireEvent.change(screen.getByLabelText("Confirmar senha"), {
      target: { value: "123456" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Criar conta" }));

    expect(await screen.findByText("Assistente")).toBeInTheDocument();
    expect(fakeApi.calls[0]?.body).toMatchObject({ username: "ana_s" });
  });

  it("erro de entrada sai como toast, não dentro do formulário", async () => {
    fakeApi.seed({ email: "ana@exemplo.com", password: "123456" });
    renderAuth();
    await screen.findByLabelText("E-mail ou usuário");
    fillLogin("errada");
    fireEvent.click(screen.getByRole("button", { name: "Entrar" }));

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("E-mail, usuário ou senha incorretos.");
    expect(alert.closest("form")).toBeNull();
    const form = screen.getByRole("button", { name: "Entrar" }).closest("form");
    expect(
      form && within(form).queryByText("E-mail, usuário ou senha incorretos.")
    ).toBeNull();
  });

  it("fica ocupado enquanto a API responde e não envia duas vezes", async () => {
    fakeApi.seed({ email: "ana@exemplo.com", password: "123456" });
    renderAuth();
    await screen.findByLabelText("E-mail ou usuário");
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
    renderAuth();
    await screen.findByLabelText("E-mail ou usuário");
    fillLogin("123456");
    fireEvent.click(screen.getByRole("button", { name: "Entrar" }));
    expect(await screen.findByText("Sem conexão")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Entrar" })).toBeEnabled();
  });
});
