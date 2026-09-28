/**
 * API falsa em memória no lugar do `fetch`, com os mesmos endpoints, status
 * e mensagens da API real (`api/`). Instalada em `setup.ts` para todo teste.
 */
import { API_URL, type ApiUser, type Role, setToken } from "#/lib/api";
import type { Sheet } from "#/lib/types";
import { usePlayerStore } from "#/stores/player-store";

interface Account extends ApiUser {
  password: string;
  sheet: Record<string, unknown> | null;
}

export interface FakeCall {
  auth: string | null;
  body: unknown;
  keepalive: boolean;
  method: string;
  path: string;
}

const STATUS_TEXT: Record<number, string> = {
  400: "Bad Request",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not Found",
  409: "Conflict",
  500: "Internal Server Error",
};

const accounts = new Map<string, Account>();
const tokens = new Map<string, string>();
let failure: "network" | number | null = null;
let nextId = 1;

function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    headers: { "Content-Type": "application/json" },
    status,
  });
}

function error(status: number, message: string): Response {
  return json(status, {
    error: STATUS_TEXT[status] ?? "Error",
    message,
    statusCode: status,
  });
}

function issueToken(email: string): string {
  const token = `token-${nextId}`;
  nextId += 1;
  tokens.set(token, email);
  return token;
}

const publicUser = ({ email, id, name, role }: Account): ApiUser => ({
  email,
  id,
  name,
  role,
});

const LOCKED = "Atributos e Habilidades só podem ser alterados pelo Mestre.";

/** A trava da API: ficha criada não muda `attrs`/`skills` pelo `/me/sheet`. */
function locked(account: Account, incoming: Record<string, unknown>): boolean {
  if (account.sheet?.criada !== true) {
    return false;
  }
  return ["attrs", "skills"].some(
    (k) =>
      k in incoming &&
      JSON.stringify(incoming[k]) !== JSON.stringify(account.sheet?.[k])
  );
}

function merge(account: Account, patch: Record<string, unknown>) {
  account.sheet = { ...account.sheet, ...patch };
}

function sheetResponse(account: Account) {
  return {
    sheet: account.sheet,
    updatedAt: account.sheet ? new Date().toISOString() : null,
  };
}

function route(call: FakeCall): Response {
  const body = (call.body ?? {}) as Record<string, unknown>;
  if (call.method === "POST" && call.path === "/auth/signup") {
    const email = String(body.email).trim().toLowerCase();
    if (accounts.has(email)) {
      return error(409, 'E-mail já cadastrado. Use "Entrar".');
    }
    const account = fakeApi.seed({
      email,
      name: String(body.name).trim(),
      password: String(body.password),
    });
    return json(201, {
      accessToken: issueToken(email),
      user: publicUser(account),
    });
  }
  if (call.method === "POST" && call.path === "/auth/login") {
    const email = String(body.email).trim().toLowerCase();
    const account = accounts.get(email);
    if (!account || account.password !== body.password) {
      return error(401, "E-mail ou senha incorretos.");
    }
    return json(200, {
      accessToken: issueToken(email),
      user: publicUser(account),
    });
  }

  const token = call.auth?.replace("Bearer ", "");
  if (!token) {
    return error(401, "Entre para continuar.");
  }
  const account = accounts.get(tokens.get(token) ?? "");
  if (!account) {
    return error(401, "Sessão expirada. Entre novamente.");
  }
  if (call.path === "/auth/me" && call.method === "GET") {
    return json(200, publicUser(account));
  }
  if (call.path === "/me/sheet") {
    return meRoute(call, account, body);
  }
  if (call.path.startsWith("/sheets")) {
    return dmRoute(call, account, body);
  }
  return error(404, "Not Found");
}

function meRoute(
  call: FakeCall,
  account: Account,
  body: Record<string, unknown>
): Response {
  const incoming = (body.sheet ?? body.patch ?? {}) as Record<string, unknown>;
  if (call.method !== "GET" && locked(account, incoming)) {
    return error(403, LOCKED);
  }
  if (call.method === "PUT") {
    account.sheet = incoming;
  } else if (call.method === "PATCH") {
    merge(account, incoming);
  }
  return json(200, sheetResponse(account));
}

function dmRoute(
  call: FakeCall,
  account: Account,
  body: Record<string, unknown>
): Response {
  if (account.role !== "dm") {
    return error(403, "Apenas o Mestre pode fazer isso.");
  }
  const players = [...accounts.values()].filter((a) => a.role === "player");
  if (call.path === "/sheets" && call.method === "GET") {
    return json(
      200,
      players
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((a) => ({ ...sheetResponse(a), user: publicUser(a) }))
    );
  }
  const id = decodeURIComponent(call.path.slice("/sheets/".length));
  const target = players.find((a) => a.id === id);
  if (!target) {
    return error(404, "Jogador não encontrado.");
  }
  if (call.method === "PATCH") {
    merge(target, body.patch as Record<string, unknown>);
    return json(200, sheetResponse(target));
  }
  return json(200, { ...sheetResponse(target), user: publicUser(target) });
}

export const fakeApi = {
  calls: [] as FakeCall[],

  /** Invalida todos os tokens emitidos (simula expiração). */
  expireTokens(): void {
    tokens.clear();
  },

  /** Faz chamadas passarem a falhar: sem conexão ou com o status dado. */
  fail(mode: "network" | number | null): void {
    failure = mode;
  },

  async fetch(input: string | URL | Request, init: RequestInit = {}) {
    const url = String(input);
    const headers = new Headers(init.headers);
    const call: FakeCall = {
      auth: headers.get("Authorization"),
      body: init.body ? JSON.parse(String(init.body)) : undefined,
      keepalive: init.keepalive ?? false,
      method: init.method ?? "GET",
      path: url.startsWith(API_URL) ? url.slice(API_URL.length) : url,
    };
    fakeApi.calls.push(call);
    await Promise.resolve();
    if (failure === "network") {
      throw new TypeError("Failed to fetch");
    }
    if (failure !== null) {
      return error(failure, "Algo deu errado. Tente novamente.");
    }
    return route(call);
  },

  /**
   * Cria a conta com a ficha, guarda o token e entra, como depois de um
   * login bem-sucedido.
   */
  login(
    sheet: Sheet | null = null,
    email = "ana@exemplo.com",
    role: Role = "player"
  ): ApiUser {
    const account = fakeApi.seed({ email, role, sheet });
    setToken(issueToken(email));
    usePlayerStore.getState().login(publicUser(account), sheet);
    return publicUser(account);
  },

  reset(): void {
    accounts.clear();
    tokens.clear();
    failure = null;
    fakeApi.calls = [];
  },

  seed({
    email,
    name = "Ana",
    password = "123456",
    role = "player",
    sheet = null,
  }: {
    email: string;
    name?: string;
    password?: string;
    role?: Role;
    sheet?: Sheet | Record<string, unknown> | null;
  }): Account {
    nextId += 1;
    const account: Account = {
      email,
      id: `user-${nextId}`,
      name,
      password,
      role,
      sheet: sheet as Record<string, unknown> | null,
    };
    accounts.set(email, account);
    return account;
  },

  /** Ficha gravada na API para o e-mail. */
  sheet(email = "ana@exemplo.com"): Record<string, unknown> | null {
    return accounts.get(email)?.sheet ?? null;
  },

  /** Token novo para uma conta já existente. */
  tokenFor(email: string): string {
    return issueToken(email);
  },
};
