/**
 * API falsa em memória no lugar do `fetch`, com os mesmos endpoints, status
 * e mensagens da API real (`api/`). Instalada em `setup.ts` para todo teste.
 */
import { API_URL, type ApiUser, setToken } from "#/lib/api";
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

const publicUser = ({ email, id, name }: Account): ApiUser => ({
  email,
  id,
  name,
});

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
    if (call.method === "PUT") {
      account.sheet = body.sheet as Record<string, unknown>;
    } else if (call.method === "PATCH") {
      account.sheet = {
        ...account.sheet,
        ...(body.patch as Record<string, unknown>),
      };
    }
    return json(200, sheetResponse(account));
  }
  return error(404, "Not Found");
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
  login(sheet: Sheet | null = null, email = "ana@exemplo.com"): ApiUser {
    const account = fakeApi.seed({ email, sheet });
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
    sheet = null,
  }: {
    email: string;
    name?: string;
    password?: string;
    sheet?: Sheet | Record<string, unknown> | null;
  }): Account {
    nextId += 1;
    const account: Account = {
      email,
      id: `user-${nextId}`,
      name,
      password,
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
