import { exampleSheet } from "#/data/example-sheet";
import { settings } from "./settings";
import {
  clearSession,
  readAccounts,
  writeAccounts,
  writePlayerName,
  writeSession,
  writeSheet,
} from "./storage";
import { store } from "./store";

export interface AuthInput {
  email: string;
  mode: "login" | "signup";
  name?: string;
  password: string;
  password2?: string;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Entra ou cria a conta local. Devolve a mensagem de erro, ou `null` em caso de sucesso. */
export function authenticate(
  input: AuthInput,
  options: { exampleData: boolean } = { exampleData: settings.dadosDeExemplo }
): string | null {
  const email = input.email.trim().toLowerCase();
  const { password } = input;
  if (!(email && password)) {
    return "Informe e-mail e senha.";
  }
  if (!EMAIL.test(email)) {
    return "E-mail inválido.";
  }
  const accounts = readAccounts();
  if (input.mode === "signup") {
    const name = (input.name ?? "").trim();
    if (!name) {
      return "Informe o nome.";
    }
    if (password !== input.password2) {
      return "As senhas não conferem.";
    }
    if (accounts[email]) {
      return 'E-mail já cadastrado. Use "Entrar".';
    }
    accounts[email] = password;
    writePlayerName(email, name);
    writeAccounts(accounts);
    writeSession(email);
    if (options.exampleData) {
      writeSheet(email, exampleSheet());
    }
    store.load(email);
    return null;
  }
  if (!accounts[email]) {
    return "E-mail não cadastrado neste dispositivo.";
  }
  if (accounts[email] !== password) {
    return "Senha incorreta.";
  }
  writeSession(email);
  store.load(email);
  return null;
}

export function logout(): void {
  clearSession();
  store.logout();
}
