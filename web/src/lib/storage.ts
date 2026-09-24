/**
 * Acesso ao localStorage com as chaves do standalone. Tudo em try/catch:
 * modo privado ou armazenamento bloqueado não pode quebrar a interface.
 *
 * As senhas ficam em texto puro, como no standalone (decisão desta fase).
 */
import { notify } from "./toast";

const KEYS = {
  accounts: "vtm5.accounts",
  name: (email: string) => `vtm5.name.${email}`,
  session: "vtm5.session",
  sheet: (email: string) => `vtm5.sheet.${email}`,
};

function read(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

/** O aviso de falha de gravação aparece uma vez por sessão. */
let warnedWriteFail = false;

function write(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // armazenamento indisponível: segue só em memória
    if (!warnedWriteFail) {
      warnedWriteFail = true;
      notify("Suas mudanças ficam só nesta aba até o armazenamento voltar.", {
        duracao: 0,
        titulo: "Não salvou",
      });
    }
  }
}

function remove(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // idem
  }
}

export type Accounts = Record<string, string>;

export function readAccounts(): Accounts {
  try {
    const parsed: unknown = JSON.parse(read(KEYS.accounts) || "{}");
    return typeof parsed === "object" && parsed !== null
      ? (parsed as Accounts)
      : {};
  } catch {
    return {};
  }
}

export function writeAccounts(accounts: Accounts): void {
  write(KEYS.accounts, JSON.stringify(accounts));
}

export function readSession(): string | null {
  return read(KEYS.session);
}

export function writeSession(email: string): void {
  write(KEYS.session, email);
}

export function clearSession(): void {
  remove(KEYS.session);
}

export function writePlayerName(email: string, name: string): void {
  write(KEYS.name(email), name);
}

export function readPlayerName(email: string): string | null {
  return read(KEYS.name(email));
}

export function readSheetRaw(email: string): unknown {
  const raw = read(KEYS.sheet(email));
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function writeSheet(email: string, sheet: unknown): void {
  write(KEYS.sheet(email), JSON.stringify(sheet));
}
