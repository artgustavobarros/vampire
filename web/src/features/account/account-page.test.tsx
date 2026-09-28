import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";
import { afterEach, describe, expect, it } from "vitest";
import { Toaster } from "#/components/ui/sonner";
import { blankSheet } from "#/lib/sheet";
import { useCharacterStore } from "#/stores/character-store";
import { usePlayerStore } from "#/stores/player-store";
import { resetStores } from "#/stores/test-utils";
import { fakeApi } from "#/test/fake-api";
import { type AccountMode, AccountPage } from "./account-page";

function renderPage(mode: AccountMode) {
  render(
    <>
      <AccountPage mode={mode} />
      <Toaster bottom={16} />
    </>
  );
}

const accountCalls = () =>
  fakeApi.calls.filter(
    (c) => c.method === "PATCH" && c.path.includes("account")
  );

const section = (title: string) =>
  screen.getByRole("heading", { name: title }).closest("form") as HTMLElement;

async function type(label: string, value: string, scope?: HTMLElement) {
  const input = within(scope ?? document.body).getByLabelText(label);
  await userEvent.clear(input);
  if (value) {
    await userEvent.type(input, value);
  }
}

async function expectToast(text: string) {
  expect(await screen.findByText(text)).toBeInTheDocument();
  toast.dismiss();
}

afterEach(() => {
  toast.dismiss();
  resetStores();
});

describe("página Conta do jogador", () => {
  it("mostra os dados atuais e @usuario", () => {
    fakeApi.login(blankSheet(), "ana@exemplo.com");
    renderPage({ kind: "self" });
    expect(screen.getByRole("heading", { name: "Conta" })).toBeInTheDocument();
    expect(screen.getByText("@ana")).toBeInTheDocument();
    expect(screen.getByLabelText("Nome")).toHaveValue("Ana");
    expect(screen.getByLabelText("Nome de usuário")).toHaveValue("ana");
    expect(screen.getByLabelText("E-mail")).toHaveValue("ana@exemplo.com");
    expect(
      within(section("Senha")).getByLabelText("Senha atual")
    ).toBeInTheDocument();
  });

  it("muda o nome de usuário e atualiza a sessão e o dono da ficha", async () => {
    fakeApi.login(blankSheet(), "ana@exemplo.com");
    renderPage({ kind: "self" });
    await type("Nome de usuário", "Vitoria");
    await userEvent.click(screen.getByRole("button", { name: "Salvar dados" }));

    await expectToast("Conta atualizada.");
    expect(accountCalls()).toEqual([
      expect.objectContaining({
        body: { username: "vitoria" },
        path: "/me/account",
      }),
    ]);
    expect(screen.getByText("@vitoria")).toBeInTheDocument();
    expect(usePlayerStore.getState().username).toBe("vitoria");
    expect(useCharacterStore.getState().owner?.username).toBe("vitoria");
  });

  it("nada alterado não chama a API", async () => {
    fakeApi.login(blankSheet(), "ana@exemplo.com");
    renderPage({ kind: "self" });
    await userEvent.click(screen.getByRole("button", { name: "Salvar dados" }));
    await expectToast("Nada para salvar.");
    expect(accountCalls()).toHaveLength(0);
  });

  it("mudar o e-mail pede a senha atual", async () => {
    fakeApi.login(blankSheet(), "ana@exemplo.com");
    renderPage({ kind: "self" });
    const dados = section("Dados");
    expect(within(dados).queryByLabelText("Senha atual")).toBeNull();
    await type("E-mail", "nova@exemplo.com");
    await userEvent.click(screen.getByRole("button", { name: "Salvar dados" }));
    await expectToast("Informe a senha atual.");
    expect(accountCalls()).toHaveLength(0);

    await type("Senha atual", "123456", dados);
    await userEvent.click(screen.getByRole("button", { name: "Salvar dados" }));
    await expectToast("Conta atualizada.");
    expect(accountCalls()[0].body).toEqual({
      currentPassword: "123456",
      email: "nova@exemplo.com",
    });
    expect(usePlayerStore.getState().user).toBe("nova@exemplo.com");
    expect(within(dados).queryByLabelText("Senha atual")).toBeNull();
  });

  it("nome de usuário em uso mostra o erro da API e mantém o digitado", async () => {
    fakeApi.seed({ email: "bia@exemplo.com" });
    fakeApi.login(blankSheet(), "ana@exemplo.com");
    renderPage({ kind: "self" });
    await type("Nome de usuário", "bia");
    await userEvent.click(screen.getByRole("button", { name: "Salvar dados" }));
    await expectToast("Nome de usuário já em uso.");
    expect(screen.getByLabelText("Nome de usuário")).toHaveValue("bia");
  });

  it("troca a senha com a senha atual e limpa os campos", async () => {
    fakeApi.login(blankSheet(), "ana@exemplo.com");
    renderPage({ kind: "self" });
    const senha = section("Senha");
    await type("Senha atual", "123456", senha);
    await type("Nova senha", "nova123", senha);
    await type("Confirmar nova senha", "nova123", senha);
    await userEvent.click(screen.getByRole("button", { name: "Trocar senha" }));

    await expectToast("Senha alterada.");
    expect(accountCalls()[0].body).toEqual({
      currentPassword: "123456",
      password: "nova123",
    });
    expect(within(senha).getByLabelText("Senha atual")).toHaveValue("");
    expect(within(senha).getByLabelText("Nova senha")).toHaveValue("");
  });

  it("senha atual errada avisa sem encerrar a sessão", async () => {
    fakeApi.login(blankSheet(), "ana@exemplo.com");
    renderPage({ kind: "self" });
    const senha = section("Senha");
    await type("Senha atual", "errada", senha);
    await type("Nova senha", "nova123", senha);
    await type("Confirmar nova senha", "nova123", senha);
    await userEvent.click(screen.getByRole("button", { name: "Trocar senha" }));
    await expectToast("Senha atual incorreta.");
    expect(usePlayerStore.getState().user).toBe("ana@exemplo.com");
  });

  it("senhas novas diferentes não chamam a API", async () => {
    fakeApi.login(blankSheet(), "ana@exemplo.com");
    renderPage({ kind: "self" });
    const senha = section("Senha");
    await type("Senha atual", "123456", senha);
    await type("Nova senha", "nova123", senha);
    await type("Confirmar nova senha", "outra123", senha);
    await userEvent.click(screen.getByRole("button", { name: "Trocar senha" }));
    await expectToast("As senhas não conferem.");
    expect(accountCalls()).toHaveLength(0);
  });
});

describe("conta de jogador aberta pelo Mestre", () => {
  async function openAna() {
    const ana = fakeApi.seed({
      email: "ana@exemplo.com",
      sheet: { ...blankSheet(), criada: true },
    });
    fakeApi.login(null, "admin@admin.com", "dm");
    usePlayerStore.setState({ name: "Mestre" });
    await useCharacterStore.getState().openPlayerSheet(ana.id);
    renderPage({ kind: "player", userId: ana.id });
    return ana;
  }

  it("redefine a senha sem a senha atual", async () => {
    const ana = await openAna();
    expect(
      screen.getByText(
        "Como Mestre, você define a nova senha sem precisar da atual."
      )
    ).toBeInTheDocument();
    expect(screen.queryByLabelText("Senha atual")).toBeNull();
    await type("Nova senha", "mesa123");
    await type("Confirmar nova senha", "mesa123");
    await userEvent.click(screen.getByRole("button", { name: "Trocar senha" }));

    await expectToast("Senha alterada.");
    expect(accountCalls()[0]).toMatchObject({
      body: { password: "mesa123" },
      path: `/accounts/${ana.id}`,
    });
  });

  it("muda o e-mail sem pedir senha e atualiza só o dono da ficha", async () => {
    await openAna();
    await type("E-mail", "ana@novo.com");
    expect(screen.queryByLabelText("Senha atual")).toBeNull();
    await userEvent.click(screen.getByRole("button", { name: "Salvar dados" }));

    await expectToast("Conta atualizada.");
    expect(accountCalls()[0].body).toEqual({ email: "ana@novo.com" });
    expect(useCharacterStore.getState().owner?.email).toBe("ana@novo.com");
    expect(usePlayerStore.getState()).toMatchObject({
      name: "Mestre",
      role: "dm",
      user: "admin@admin.com",
    });
  });
});

describe("conta do próprio Mestre", () => {
  it("só o nome é editável, sem seção de senha", async () => {
    fakeApi.login(null, "admin@admin.com", "dm");
    renderPage({ kind: "dm-self" });
    expect(screen.getAllByText("@mestre")).toHaveLength(2);
    expect(screen.getByText("admin@admin.com")).toBeInTheDocument();
    expect(
      screen.getByText(
        "E-mail, usuário e senha do Mestre são definidos no servidor."
      )
    ).toBeInTheDocument();
    expect(screen.queryByLabelText("Nome de usuário")).toBeNull();
    expect(screen.queryByRole("heading", { name: "Senha" })).toBeNull();

    await type("Nome", "Narrador");
    await userEvent.click(screen.getByRole("button", { name: "Salvar dados" }));
    await expectToast("Conta atualizada.");
    expect(accountCalls()[0].body).toEqual({ name: "Narrador" });
    expect(usePlayerStore.getState().name).toBe("Narrador");
  });
});
