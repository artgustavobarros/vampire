/**
 * API falsa em memória no lugar do `fetch`, com os mesmos endpoints, status
 * e mensagens da API real (`api/`). Instalada em `setup.ts` para todo teste.
 */
import {
  API_URL,
  type ApiUser,
  type EnemyRecord,
  type Role,
  type RoundViewEntry,
  setToken,
} from "#/lib/api";
import type { Enemy, RoundEntry, RoundState, Sheet } from "#/lib/types";
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

interface FakeCoterie {
  id: string;
  /** ids dos jogadores, por ordem de entrada */
  membros: string[];
  nome: string;
}

const accounts = new Map<string, Account>();
let coteries: FakeCoterie[] = [];
let enemies: EnemyRecord[] = [];
let round: RoundState = { ordem: [], rodada: 1, vez: 0 };
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
  return chronicleRoute(call, account, body);
}

/** Coteries, Bestiário e rodada. */
function chronicleRoute(
  call: FakeCall,
  account: Account,
  body: Record<string, unknown>
): Response {
  if (call.path === "/me/coterie" && call.method === "GET") {
    return json(200, myCoterie(account));
  }
  if (call.path === "/round" && call.method === "GET") {
    return json(200, roundView(account));
  }
  const dmOnly = ["/coteries", "/enemies", "/round"].some((p) =>
    call.path.startsWith(p)
  );
  if (dmOnly && account.role !== "dm") {
    return error(403, "Apenas o Mestre pode fazer isso.");
  }
  if (call.path.startsWith("/coteries")) {
    return coterieRoute(call, body);
  }
  if (call.path.startsWith("/enemies")) {
    return enemyRoute(call, body);
  }
  if (call.path === "/round" && call.method === "PUT") {
    return putRound(account, body as unknown as RoundState);
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

const byId = (userId: string) =>
  [...accounts.values()].find((a) => a.id === userId && a.role === "player");

/** Como `projectSheet` da API: só o que o cartão mostra. */
function projectSheet(sheet: Record<string, unknown> | null) {
  if (!sheet) {
    return null;
  }
  const out: Record<string, unknown> = {};
  for (const key of ["nome", "cla", "criada", "fome", "vit", "fdv"]) {
    if (key in sheet) {
      out[key] = sheet[key];
    }
  }
  const attrs = (sheet.attrs ?? {}) as Record<string, number>;
  out.attrs = Object.fromEntries(
    ["Vigor", "Autocontrole", "Determinação"]
      .filter((a) => typeof attrs[a] === "number")
      .map((a) => [a, attrs[a]])
  );
  return out;
}

function coterieResponse(c: FakeCoterie) {
  return {
    id: c.id,
    membros: c.membros.flatMap((userId) => {
      const a = byId(userId);
      return a ? [{ ...sheetResponse(a), user: publicUser(a) }] : [];
    }),
    nome: c.nome,
  };
}

function myCoterie(account: Account) {
  const c = coteries.find((x) => x.membros.includes(account.id));
  if (!c) {
    return { coterie: null };
  }
  return {
    coterie: {
      id: c.id,
      membros: c.membros.map((userId) => ({
        sheet: projectSheet(byId(userId)?.sheet ?? null),
        userId,
      })),
      nome: c.nome,
    },
  };
}

function coterieRoute(call: FakeCall, body: Record<string, unknown>): Response {
  const [, , coterieId, membros, userId] = call.path
    .split("/")
    .map(decodeURIComponent);
  if (!coterieId) {
    if (call.method === "POST") {
      nextId += 1;
      const c = {
        id: `coterie-${nextId}`,
        membros: [],
        nome: String(body.nome ?? "").trim(),
      };
      coteries.push(c);
      return json(201, coterieResponse(c));
    }
    return json(200, coteries.map(coterieResponse));
  }
  const c = coteries.find((x) => x.id === coterieId);
  if (!c) {
    return error(404, "Coterie não encontrada.");
  }
  if (!membros) {
    if (call.method === "DELETE") {
      coteries = coteries.filter((x) => x !== c);
      return new Response(null, { status: 204 });
    }
    c.nome = String(body.nome ?? "").trim();
    return json(200, coterieResponse(c));
  }
  const target = byId(userId ?? "");
  if (!target) {
    return error(404, "Jogador não encontrado.");
  }
  if (call.method === "DELETE") {
    c.membros = c.membros.filter((m) => m !== target.id);
    return json(200, coterieResponse(c));
  }
  if (target.sheet?.criada !== true) {
    return error(400, "Este jogador ainda não criou o personagem.");
  }
  const other = coteries.find((x) => x.membros.includes(target.id));
  if (other && other !== c) {
    return error(409, "Este jogador já está em outra coterie.");
  }
  if (!other) {
    c.membros.push(target.id);
  }
  return json(200, coterieResponse(c));
}

function enemyRoute(call: FakeCall, body: Record<string, unknown>): Response {
  const enemyId = decodeURIComponent(call.path.split("/")[2] ?? "");
  if (!enemyId) {
    if (call.method === "POST") {
      nextId += 1;
      const record = {
        enemy: body.enemy as Enemy,
        id: `enemy-${nextId}`,
        updatedAt: new Date().toISOString(),
      };
      enemies.push(record);
      return json(201, record);
    }
    return json(200, enemies);
  }
  const record = enemies.find((e) => e.id === enemyId);
  if (!record) {
    return error(404, "Inimigo não encontrado.");
  }
  if (call.method === "DELETE") {
    enemies = enemies.filter((e) => e !== record);
    round = keepEntries(round, (e) => e.id !== enemyId);
    return new Response(null, { status: 204 });
  }
  const enemy = body.enemy as Enemy;
  if (enemy.vit.length > enemy.vitMax || enemy.fdv.length > enemy.fdvMax) {
    return error(400, "Inimigo inválido.");
  }
  record.enemy = enemy;
  return json(200, record);
}

function keepEntries(
  state: RoundState,
  keep: (e: RoundEntry) => boolean
): RoundState {
  let { vez } = state;
  const ordem = state.ordem.filter((e, i) => {
    if (!keep(e) && i < state.vez) {
      vez -= 1;
    }
    return keep(e);
  });
  return { ordem, rodada: state.rodada, vez: vez >= ordem.length ? 0 : vez };
}

function exists(e: RoundEntry): boolean {
  return e.tipo === "jogador"
    ? Boolean(byId(e.id))
    : enemies.some((x) => x.id === e.id);
}

function roundView(account: Account) {
  const state = keepEntries(round, exists);
  const ordem = state.ordem.map((e): RoundViewEntry => {
    if (e.tipo === "jogador") {
      return {
        ...e,
        sheet: projectSheet(byId(e.id)?.sheet ?? null),
        tipo: "jogador",
      };
    }
    const { nome, visivel, ...dados } = (
      enemies.find((x) => x.id === e.id) as EnemyRecord
    ).enemy;
    return {
      ...e,
      dados: account.role === "dm" || visivel ? dados : null,
      nome,
      tipo: "inimigo",
      visivel,
    };
  });
  return { ...state, ordem, updatedAt: new Date().toISOString() };
}

function putRound(account: Account, state: RoundState): Response {
  const valid = state.ordem.every(
    (e) =>
      exists(e) && (e.tipo === "inimigo" || byId(e.id)?.sheet?.criada === true)
  );
  if (!valid) {
    return error(400, "Participante inválido na rodada.");
  }
  if (state.ordem.length ? state.vez >= state.ordem.length : state.vez !== 0) {
    return error(400, "Vez fora da ordem.");
  }
  round = { ordem: state.ordem, rodada: state.rodada, vez: state.vez };
  return json(200, roundView(account));
}

export const fakeApi = {
  calls: [] as FakeCall[],

  /** Coteries gravadas (ids dos membros por ordem de entrada). */
  coteries(): readonly FakeCoterie[] {
    return coteries;
  },

  /** Inimigos gravados no Bestiário. */
  enemies(): readonly EnemyRecord[] {
    return enemies;
  },

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
    coteries = [];
    enemies = [];
    round = { ordem: [], rodada: 1, vez: 0 };
    tokens.clear();
    failure = null;
    fakeApi.calls = [];
  },

  /** Estado gravado da rodada. */
  round(): RoundState {
    return round;
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

  seedCoterie(nome: string, membros: string[] = []): FakeCoterie {
    nextId += 1;
    const c = { id: `coterie-${nextId}`, membros: [...membros], nome };
    coteries.push(c);
    return c;
  },

  seedEnemy(patch: Partial<Enemy> = {}): EnemyRecord {
    nextId += 1;
    const record = {
      enemy: {
        especiais: [],
        fdv: [],
        fdvMax: 3,
        nome: "",
        paradas: [],
        visivel: false,
        vit: [],
        vitMax: 5,
        ...patch,
      },
      id: `enemy-${nextId}`,
      updatedAt: new Date().toISOString(),
    };
    enemies.push(record);
    return record;
  },

  seedRound(state: Partial<RoundState>): void {
    round = { ...round, ...state };
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
