import { render, screen } from "@testing-library/react";
import { toast } from "sonner";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Toaster } from "#/components/ui/sonner";
import { getToken, setToken } from "#/lib/api";
import { authenticate, logout } from "#/lib/auth";
import { blankSheet } from "#/lib/sheet";
import { fakeApi } from "#/test/fake-api";
import { flushSheet, patchSheet, useCharacterStore } from "./character-store";
import { usePlayerStore } from "./player-store";
import { SAVE_DELAY } from "./sheet-sync";
import { resetStores } from "./test-utils";

const player = () => usePlayerStore.getState();
const character = () => useCharacterStore.getState();
const patches = () => fakeApi.calls.filter((c) => c.method === "PATCH");

beforeEach(() => {
  render(<Toaster bottom={16} />);
});

afterEach(() => {
  toast.dismiss();
  resetStores();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

const signup = (email = "ana@exemplo.com") =>
  authenticate(
    {
      email,
      mode: "signup",
      name: "Ana",
      password: "123456",
      password2: "123456",
    },
    { exampleData: false }
  );

async function expectToast(text: string) {
  expect(await screen.findByText(text)).toBeInTheDocument();
  toast.dismiss();
}

describe("contas na API", () => {
  it("cadastra, guarda o token e carrega ficha em branco", async () => {
    expect(await signup()).toBe(true);
    expect(localStorage.getItem("vtm5.token")).toBeTruthy();
    expect(player().user).toBe("ana@exemplo.com");
    expect(player().name).toBe("Ana");
    expect(character().sheet.criada).toBe(false);
    expect(fakeApi.calls.map((c) => c.path)).toEqual(["/auth/signup"]);
  });

  it("valida o cadastro antes de chamar a API", async () => {
    const base = {
      email: "a@b.co",
      mode: "signup" as const,
      name: "A",
      password: "123456",
    };
    expect(await authenticate({ ...base, password2: "654321" })).toBe(false);
    await expectToast("As senhas não conferem.");
    expect(await authenticate({ ...base, name: " ", password2: "1" })).toBe(
      false
    );
    await expectToast("Informe o nome.");
    expect(
      await authenticate({ ...base, password: "123", password2: "123" })
    ).toBe(false);
    await expectToast("A senha precisa ter pelo menos 6 caracteres.");
    expect(fakeApi.calls).toHaveLength(0);
  });

  it("mostra o e-mail duplicado que a API recusa", async () => {
    fakeApi.seed({ email: "a@b.co" });
    expect(
      await authenticate({
        email: "a@b.co",
        mode: "signup",
        name: "A",
        password: "123456",
        password2: "123456",
      })
    ).toBe(false);
    await expectToast('E-mail já cadastrado. Use "Entrar".');
    expect(getToken()).toBeNull();
  });

  it("valida o login", async () => {
    expect(await authenticate({ email: "", mode: "login", password: "" })).toBe(
      false
    );
    await expectToast("Informe o e-mail.");
    expect(
      await authenticate({ email: "", mode: "login", password: "123456" })
    ).toBe(false);
    await expectToast("Informe o e-mail.");
    expect(
      await authenticate({ email: "x", mode: "login", password: "" })
    ).toBe(false);
    await expectToast("E-mail inválido.");
    expect(
      await authenticate({ email: "a@b.co", mode: "login", password: "" })
    ).toBe(false);
    await expectToast("Informe a senha.");
    expect(
      await authenticate({ email: "x", mode: "login", password: "1" })
    ).toBe(false);
    await expectToast("E-mail inválido.");
    expect(fakeApi.calls).toHaveLength(0);

    fakeApi.seed({ email: "ana@exemplo.com", password: "123456" });
    expect(
      await authenticate({
        email: "ana@exemplo.com",
        mode: "login",
        password: "x",
      })
    ).toBe(false);
    await expectToast("E-mail ou senha incorretos.");
    expect(player().user).toBeNull();
  });

  it("entra com e-mail normalizado e carrega a ficha da API", async () => {
    fakeApi.seed({
      email: "ana@exemplo.com",
      password: "123456",
      sheet: { ...blankSheet(), criada: true, nome: "Ana" },
    });
    expect(
      await authenticate({
        email: "  ANA@exemplo.com ",
        mode: "login",
        password: "123456",
      })
    ).toBe(true);
    expect(player().user).toBe("ana@exemplo.com");
    expect(character().sheet.nome).toBe("Ana");
    expect(fakeApi.calls.at(-1)?.auth).toBe(`Bearer ${getToken()}`);
  });

  it("sem conexão ao entrar mostra o aviso de conexão", async () => {
    fakeApi.fail("network");
    expect(
      await authenticate({ email: "a@b.co", mode: "login", password: "1" })
    ).toBe(false);
    expect(await screen.findByText("Sem conexão")).toBeInTheDocument();
    expect(getToken()).toBeNull();
  });

  it("cadastro com dados de exemplo grava a ficha de exemplo na API", async () => {
    await authenticate(
      {
        email: "v@s.com",
        mode: "signup",
        name: "V",
        password: "123456",
        password2: "123456",
      },
      { exampleData: true }
    );
    expect(fakeApi.calls.map((c) => c.method)).toEqual(["POST", "PUT"]);
    expect(fakeApi.sheet("v@s.com")?.nome).toBe("Vitória Salles");
    expect(character().sheet.nome).toBe("Vitória Salles");
    expect(character().sheet.cla).toBe("Ventrue");
  });

  it("sair envia as mudanças pendentes e limpa sessão e ficha", async () => {
    fakeApi.login(blankSheet());
    patchSheet({ nome: "Teste" });
    await logout();
    expect(fakeApi.sheet()?.nome).toBe("Teste");
    expect(getToken()).toBeNull();
    expect(player().user).toBeNull();
    expect(character().sheet.nome).toBeUndefined();
  });

  it("sair sem conexão sai mesmo assim", async () => {
    fakeApi.login(blankSheet());
    patchSheet({ nome: "Teste" });
    fakeApi.fail("network");
    await logout();
    expect(getToken()).toBeNull();
    expect(player().user).toBeNull();
    expect(screen.queryByText("Não salvou")).toBeNull();
  });
});

describe("restauração da sessão", () => {
  it("restaura jogador e ficha pelo token", async () => {
    fakeApi.seed({
      email: "ana@exemplo.com",
      sheet: { attrs: { Força: 3 }, criada: true },
    });
    setToken(fakeApi.tokenFor("ana@exemplo.com"));
    await player().restore();
    expect(player()).toMatchObject({
      name: "Ana",
      ready: true,
      user: "ana@exemplo.com",
    });
    expect(character().sheet.attrs.Força).toBe(3);
    expect(character().sheet.attrs.Vigor).toBe(1);
  });

  it("sem token fica pronto sem chamar a API", async () => {
    await player().restore();
    expect(player()).toMatchObject({ ready: true, user: null });
    expect(fakeApi.calls).toHaveLength(0);
  });

  it("restaura só uma vez", async () => {
    fakeApi.seed({ email: "ana@exemplo.com" });
    setToken(fakeApi.tokenFor("ana@exemplo.com"));
    await Promise.all([player().restore(), player().restore()]);
    expect(fakeApi.calls).toHaveLength(2);
    await player().restore();
    expect(fakeApi.calls).toHaveLength(2);
  });

  it("token recusado apaga o token e vai para a entrada", async () => {
    setToken("vencido");
    await player().restore();
    expect(player()).toMatchObject({ ready: true, user: null });
    expect(getToken()).toBeNull();
  });

  it("sem conexão mantém a abertura e o token até tentar de novo", async () => {
    fakeApi.seed({ email: "ana@exemplo.com" });
    const token = fakeApi.tokenFor("ana@exemplo.com");
    setToken(token);
    fakeApi.fail("network");
    await player().restore();
    expect(player().ready).toBe(false);
    expect(getToken()).toBe(token);
    const retry = await screen.findByRole("button", { name: "Tentar de novo" });

    fakeApi.fail(null);
    retry.click();
    await vi.waitFor(() => expect(player().ready).toBe(true));
    expect(player().user).toBe("ana@exemplo.com");
  });
});

describe("gravação da ficha", () => {
  it("agrupa mudanças próximas num único PATCH com os valores atuais", async () => {
    vi.useFakeTimers();
    fakeApi.login(blankSheet());
    patchSheet({ nome: "An" });
    patchSheet({ nome: "Ana" });
    patchSheet({ fome: 2 });
    expect(character().sheet.nome).toBe("Ana");
    await vi.advanceTimersByTimeAsync(SAVE_DELAY - 1);
    expect(patches()).toHaveLength(0);
    await vi.advanceTimersByTimeAsync(1);
    expect(patches()).toHaveLength(1);
    expect(patches()[0].body).toEqual({ patch: { fome: 2, nome: "Ana" } });
  });

  it("mudança durante o envio segue num próximo PATCH", async () => {
    vi.useFakeTimers();
    fakeApi.login(blankSheet());
    patchSheet({ nome: "A" });
    const sending = flushSheet();
    patchSheet({ nome: "B" });
    await sending;
    expect(patches().map((c) => c.body)).toEqual([{ patch: { nome: "A" } }]);
    await vi.advanceTimersByTimeAsync(SAVE_DELAY);
    expect(patches()).toHaveLength(2);
    expect(fakeApi.sheet()?.nome).toBe("B");
  });

  it("campo apagado vai como null", async () => {
    fakeApi.login(blankSheet());
    patchSheet({ predBonus: undefined });
    await flushSheet();
    expect(patches()[0].body).toEqual({ patch: { predBonus: null } });
  });

  it("falha mantém a edição, avisa uma vez e tenta de novo", async () => {
    fakeApi.login(blankSheet());
    fakeApi.fail("network");
    patchSheet({ nome: "Ana" });
    await flushSheet();
    patchSheet({ fome: 3 });
    await flushSheet();
    expect(character().sheet.nome).toBe("Ana");
    expect(await screen.findAllByText("Não salvou")).toHaveLength(1);
    expect(patches().at(-1)?.body).toEqual({ patch: { fome: 3, nome: "Ana" } });

    fakeApi.fail(null);
    screen.getByRole("button", { name: "Tentar de novo" }).click();
    await vi.waitFor(() =>
      expect(fakeApi.sheet()).toMatchObject({ fome: 3, nome: "Ana" })
    );
    await vi.waitFor(() => expect(screen.queryByText("Não salvou")).toBeNull());
  });

  it("401 ao gravar encerra a sessão", async () => {
    fakeApi.login(blankSheet());
    fakeApi.expireTokens();
    patchSheet({ nome: "Ana" });
    await flushSheet();
    expect(player().user).toBeNull();
    expect(getToken()).toBeNull();
    expect(
      await screen.findByText(
        "Sua sessão expirou. Entre de novo para continuar."
      )
    ).toBeInTheDocument();
    expect(screen.queryByText("Não salvou")).toBeNull();
  });

  it("esconder a página envia na hora, com keepalive", async () => {
    fakeApi.login(blankSheet());
    patchSheet({ nome: "Ana" });
    window.dispatchEvent(new Event("pagehide"));
    await vi.waitFor(() => expect(patches()).toHaveLength(1));
    expect(patches()[0].keepalive).toBe(true);
  });

  it("alteração sem jogador fica só em memória", async () => {
    vi.useFakeTimers();
    patchSheet({ nome: "X" });
    expect(character().sheet.nome).toBe("X");
    await vi.advanceTimersByTimeAsync(SAVE_DELAY);
    expect(fakeApi.calls).toHaveLength(0);
  });

  it("sinaliza alerta de Fome em 5 e 0", () => {
    fakeApi.login(blankSheet());
    patchSheet({ fome: 4 });
    expect(character().hungerAlert).toBeNull();
    patchSheet({ fome: 5 });
    expect(character().hungerAlert).toBe(5);
    character().dismissHungerAlert();
    patchSheet({ fome: 5 });
    expect(character().hungerAlert).toBeNull();
    patchSheet({ fome: 0 });
    expect(character().hungerAlert).toBe(0);
  });

  it("continua funcionando com armazenamento bloqueado", async () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("bloqueado");
    });
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("bloqueado");
    });
    expect(await signup()).toBe(true);
    expect(getToken()).toBeTruthy();
    patchSheet({ nome: "X" });
    await flushSheet();
    expect(fakeApi.sheet()?.nome).toBe("X");
  });

  it("sair limpa jogador, personagem e pendências", async () => {
    vi.useFakeTimers();
    fakeApi.login(blankSheet());
    patchSheet({ fome: 5, nome: "Teste" });
    player().logout();
    expect(player().name).toBeNull();
    expect(character().owner).toBeNull();
    expect(character().hungerAlert).toBeNull();
    expect(character().sheet.nome).toBeUndefined();
    await vi.advanceTimersByTimeAsync(SAVE_DELAY);
    expect(patches()).toHaveLength(0);
  });
});
