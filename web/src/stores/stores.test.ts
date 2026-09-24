import { afterEach, describe, expect, it, vi } from "vitest";
import { authenticate, logout } from "#/lib/auth";
import { patchSheet, useCharacterStore } from "./character-store";
import { usePlayerStore } from "./player-store";
import { resetStores } from "./test-utils";

const player = () => usePlayerStore.getState();
const character = () => useCharacterStore.getState();

afterEach(() => {
  resetStores();
  vi.restoreAllMocks();
});

const signup = (email = "ana@exemplo.com") =>
  authenticate(
    { email, mode: "signup", name: "Ana", password: "123", password2: "123" },
    { exampleData: false }
  );

describe("contas locais", () => {
  it("cadastra, grava sessão e carrega ficha em branco", () => {
    expect(signup()).toBeNull();
    expect(localStorage.getItem("vtm5.session")).toBe("ana@exemplo.com");
    expect(JSON.parse(localStorage.getItem("vtm5.accounts") ?? "{}")).toEqual({
      "ana@exemplo.com": "123",
    });
    expect(player().user).toBe("ana@exemplo.com");
    expect(character().sheet.criada).toBe(false);
  });

  it("valida o cadastro", () => {
    const base = {
      email: "a@b.co",
      mode: "signup" as const,
      name: "A",
      password: "1",
    };
    expect(authenticate({ ...base, password2: "2" })).toBe(
      "As senhas não conferem."
    );
    expect(authenticate({ ...base, name: " ", password2: "1" })).toBe(
      "Informe o nome."
    );
    signup("a@b.co");
    expect(authenticate({ ...base, password2: "1" })).toBe(
      'E-mail já cadastrado. Use "Entrar".'
    );
  });

  it("valida o login", () => {
    expect(authenticate({ email: "", mode: "login", password: "" })).toBe(
      "Informe e-mail e senha."
    );
    expect(authenticate({ email: "x", mode: "login", password: "1" })).toBe(
      "E-mail inválido."
    );
    expect(
      authenticate({ email: "n@o.pe", mode: "login", password: "1" })
    ).toBe("E-mail não cadastrado neste dispositivo.");
    signup();
    expect(
      authenticate({ email: "ana@exemplo.com", mode: "login", password: "x" })
    ).toBe("Senha incorreta.");
    expect(
      authenticate({
        email: "  ANA@exemplo.com ",
        mode: "login",
        password: "123",
      })
    ).toBeNull();
  });

  it("cadastro com dados de exemplo recebe a ficha de exemplo", () => {
    authenticate(
      {
        email: "v@s.com",
        mode: "signup",
        name: "V",
        password: "1",
        password2: "1",
      },
      { exampleData: true }
    );
    expect(character().sheet.nome).toBe("Vitória Salles");
    expect(character().sheet.cla).toBe("Ventrue");
  });

  it("sair limpa sessão e ficha", () => {
    signup();
    patchSheet({ nome: "Teste" });
    logout();
    expect(localStorage.getItem("vtm5.session")).toBeNull();
    expect(player().user).toBeNull();
    expect(character().sheet.nome).toBeUndefined();
  });
});

describe("stores", () => {
  it("salva cada patch e recarrega a ficha", () => {
    signup();
    patchSheet({ attrs: { ...character().sheet.attrs, Força: 3 } });
    resetStores();
    player().restore();
    expect(character().sheet.attrs.Força).toBe(3);
    expect(player().ready).toBe(true);
  });

  it("sinaliza alerta de Fome em 5 e 0", () => {
    signup();
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

  it("continua funcionando com armazenamento bloqueado", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("bloqueado");
    });
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("bloqueado");
    });
    expect(() => player().restore()).not.toThrow();
    expect(() => patchSheet({ nome: "X" })).not.toThrow();
    expect(character().sheet.nome).toBe("X");
  });

  it("restaura o nome do jogador", () => {
    signup();
    resetStores();
    player().restore();
    expect(player().user).toBe("ana@exemplo.com");
    expect(player().name).toBe("Ana");
  });

  it("restaura só uma vez", () => {
    player().restore();
    expect(player().user).toBeNull();
    localStorage.setItem("vtm5.session", "ana@exemplo.com");
    player().restore();
    expect(player().user).toBeNull();
  });

  it("sair limpa jogador e personagem", () => {
    signup();
    patchSheet({ fome: 5, nome: "Teste" });
    logout();
    expect(player().name).toBeNull();
    expect(character().owner).toBeNull();
    expect(character().hungerAlert).toBeNull();
    expect(character().sheet.nome).toBeUndefined();
  });

  it("alteração sem jogador fica só em memória", () => {
    const setItem = vi.spyOn(Storage.prototype, "setItem");
    patchSheet({ nome: "X" });
    expect(character().sheet.nome).toBe("X");
    expect(setItem).not.toHaveBeenCalled();
  });
});
