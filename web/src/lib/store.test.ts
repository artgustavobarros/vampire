import { afterEach, describe, expect, it, vi } from "vitest";
import { authenticate, logout } from "./auth";
import { store } from "./store";

afterEach(() => {
  store.reset();
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
    expect(store.get().user).toBe("ana@exemplo.com");
    expect(store.get().sheet.criada).toBe(false);
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
    expect(store.get().sheet.nome).toBe("Vitória Salles");
    expect(store.get().sheet.cla).toBe("Ventrue");
  });

  it("sair limpa sessão e ficha", () => {
    signup();
    store.patch({ nome: "Teste" });
    logout();
    expect(localStorage.getItem("vtm5.session")).toBeNull();
    expect(store.get().user).toBeNull();
    expect(store.get().sheet.nome).toBeUndefined();
  });
});

describe("store", () => {
  it("salva cada patch e recarrega a ficha", () => {
    signup();
    store.patch({ attrs: { ...store.get().sheet.attrs, Força: 3 } });
    store.reset();
    store.restore();
    expect(store.get().sheet.attrs.Força).toBe(3);
    expect(store.get().ready).toBe(true);
  });

  it("sinaliza alerta de Fome em 5 e 0", () => {
    signup();
    store.patch({ fome: 4 });
    expect(store.get().hungerAlert).toBeNull();
    store.patch({ fome: 5 });
    expect(store.get().hungerAlert).toBe(5);
    store.dismissHungerAlert();
    store.patch({ fome: 5 });
    expect(store.get().hungerAlert).toBeNull();
    store.patch({ fome: 0 });
    expect(store.get().hungerAlert).toBe(0);
  });

  it("continua funcionando com armazenamento bloqueado", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("bloqueado");
    });
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("bloqueado");
    });
    expect(() => store.restore()).not.toThrow();
    expect(() => store.patch({ nome: "X" })).not.toThrow();
    expect(store.get().sheet.nome).toBe("X");
  });
});
