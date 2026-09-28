import type { NestExpressApplication } from "@nestjs/platform-express";
import { Test } from "@nestjs/testing";
import { eq, like } from "drizzle-orm";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { AppModule } from "../src/app.module.js";
import { ApiExpressAdapter, configureApp } from "../src/app.setup.js";
import { type Database, DRIZZLE } from "../src/db/db.module.js";
import { sheets, users } from "../src/db/schema.js";

/** Precisa do Postgres do compose (`docker compose up db`) e do `.env`. */
describe("API (e2e)", () => {
  let app: NestExpressApplication;
  let db: Database;
  const run = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const emailOf = (name: string) => `${name}-${run}@e2e.test`;

  const http = () => request(app.getHttpServer());

  async function signup(name: string): Promise<{ id: string; token: string }> {
    const res = await http()
      .post("/api/auth/signup")
      .send({ email: emailOf(name), name, password: "segredo" })
      .expect(201);
    return { id: res.body.user.id, token: res.body.accessToken };
  }

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication<NestExpressApplication>(
      new ApiExpressAdapter(),
      { bodyParser: false }
    );
    configureApp(app);
    // escutando, o supertest reaproveita o servidor em vez de abrir um por requisição
    await app.listen(0);
    db = app.get(DRIZZLE);
  });

  afterAll(async () => {
    // todas as contas desta execução (e as fichas, em cascata)
    await db.delete(users).where(like(users.email, emailOf("%")));
    await app?.close();
  });

  it("GET /api/health", async () => {
    await http().get("/api/health").expect(200, { db: "up", status: "ok" });
  });

  it("rotas fora do prefixo não existem", async () => {
    await http().get("/health").expect(404);
  });

  describe("autenticação", () => {
    it("cadastra, entra e restaura a sessão", async () => {
      const email = emailOf("vitoria");
      const signupRes = await http()
        .post("/api/auth/signup")
        .send({
          email: `  ${email.toUpperCase()} `,
          name: " Vitória ",
          password: "segredo",
        })
        .expect(201);
      expect(signupRes.body.user).toEqual({
        email,
        id: expect.any(String),
        name: "Vitória",
        role: "player",
      });

      const loginRes = await http()
        .post("/api/auth/login")
        .send({ email, password: "segredo" })
        .expect(200);

      const meRes = await http()
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${loginRes.body.accessToken}`)
        .expect(200);
      expect(meRes.body).toEqual(signupRes.body.user);
      expect(meRes.body).not.toHaveProperty("passwordHash");
    });

    it("todo cadastro nasce jogador, mesmo pedindo outro papel", async () => {
      const res = await http()
        .post("/api/auth/signup")
        .send({
          email: emailOf("quer-ser-mestre"),
          name: "Esperto",
          password: "segredo",
          role: "dm",
        })
        .expect(201);
      expect(res.body.user.role).toBe("player");
    });

    it("recusa e-mail repetido", async () => {
      await signup("repetido");
      const res = await http()
        .post("/api/auth/signup")
        .send({
          email: emailOf("repetido"),
          name: "Outro",
          password: "segredo",
        })
        .expect(409);
      expect(res.body).toEqual({
        error: "Conflict",
        message: 'E-mail já cadastrado. Use "Entrar".',
        statusCode: 409,
      });
    });

    it("responde igual para senha errada e e-mail desconhecido", async () => {
      await signup("senha");
      const wrong = await http()
        .post("/api/auth/login")
        .send({ email: emailOf("senha"), password: "errada" })
        .expect(401);
      const unknown = await http()
        .post("/api/auth/login")
        .send({ email: emailOf("ninguem"), password: "errada" })
        .expect(401);
      expect(wrong.body).toEqual(unknown.body);
      expect(wrong.body.message).toBe("E-mail ou senha incorretos.");
    });

    it("valida o corpo com mensagens em português", async () => {
      const res = await http()
        .post("/api/auth/signup")
        .send({ email: "abc", name: "a", password: "segredo" })
        .expect(400);
      expect(res.body.message).toBe("E-mail inválido.");
    });

    it("exige token nas rotas protegidas", async () => {
      const res = await http().get("/api/auth/me").expect(401);
      expect(res.body.message).toBe("Entre para continuar.");
    });

    it("recusa token inválido", async () => {
      const res = await http()
        .get("/api/auth/me")
        .set("Authorization", "Bearer abc.def.ghi")
        .expect(401);
      expect(res.body.message).toBe("Sessão expirada. Entre novamente.");
    });

    it("recusa token de jogador removido e apaga a ficha junto", async () => {
      const { id, token } = await signup("removido");
      await http()
        .put("/api/me/sheet")
        .set("Authorization", `Bearer ${token}`)
        .send({ sheet: { fome: 1 } })
        .expect(200);
      await db.delete(users).where(eq(users.id, id));

      await http()
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${token}`)
        .expect(401);
      expect(
        await db.select().from(sheets).where(eq(sheets.userId, id))
      ).toEqual([]);
    });
  });

  describe("ficha", () => {
    let token: string;
    const auth = () => ({ Authorization: `Bearer ${token}` });

    beforeAll(async () => {
      ({ token } = await signup("ficha"));
    });

    it("começa sem ficha", async () => {
      await http()
        .get("/api/me/sheet")
        .set(auth())
        .expect(200, { sheet: null, updatedAt: null });
    });

    it("grava, mescla e substitui", async () => {
      const sheet = {
        attrs: { Força: 2, Vigor: 1 },
        fome: 1,
        humanidade: 7,
        novoCampo: { x: [1] },
      };
      const put = await http()
        .put("/api/me/sheet")
        .set(auth())
        .send({ sheet })
        .expect(200);
      expect(put.body.sheet).toEqual(sheet);
      expect(new Date(put.body.updatedAt).getTime()).not.toBeNaN();

      const patch = await http()
        .patch("/api/me/sheet")
        .set(auth())
        .send({ patch: { attrs: { Força: 3 }, fome: 3 } })
        .expect(200);
      expect(patch.body.sheet).toEqual({
        attrs: { Força: 3 },
        fome: 3,
        humanidade: 7,
        novoCampo: { x: [1] },
      });

      await http()
        .put("/api/me/sheet")
        .set(auth())
        .send({ sheet: { fome: 2 } })
        .expect(200);
      const get = await http().get("/api/me/sheet").set(auth()).expect(200);
      expect(get.body.sheet).toEqual({ fome: 2 });
    });

    it("PATCH sem ficha cria a ficha", async () => {
      const { token: other } = await signup("patch-primeiro");
      const res = await http()
        .patch("/api/me/sheet")
        .set("Authorization", `Bearer ${other}`)
        .send({ patch: { notas: "oi" } })
        .expect(200);
      expect(res.body.sheet).toEqual({ notas: "oi" });
    });

    it("patches simultâneos em campos diferentes não se perdem", async () => {
      const fields = Array.from({ length: 10 }, (_, i) => `campo${i}`);
      await Promise.all(
        fields.map((field, i) =>
          http()
            .patch("/api/me/sheet")
            .set(auth())
            .send({ patch: { [field]: i } })
            .expect(200)
        )
      );
      const { body } = await http()
        .get("/api/me/sheet")
        .set(auth())
        .expect(200);
      for (const [i, field] of fields.entries()) {
        expect(body.sheet[field]).toBe(i);
      }
    });

    it("isola as fichas de cada jogador", async () => {
      const a = await signup("isolado-a");
      const b = await signup("isolado-b");
      await http()
        .put("/api/me/sheet")
        .set("Authorization", `Bearer ${a.token}`)
        .send({ sheet: { nome: "A" } })
        .expect(200);
      await http()
        .put("/api/me/sheet")
        .set("Authorization", `Bearer ${b.token}`)
        .send({ sheet: { nome: "B" } })
        .expect(200);
      const res = await http()
        .get("/api/me/sheet")
        .set("Authorization", `Bearer ${a.token}`)
        .expect(200);
      expect(res.body.sheet).toEqual({ nome: "A" });
    });

    it.each([
      ["PUT com array", "put", { sheet: [1, 2] }],
      ["PATCH com texto", "patch", { patch: "texto" }],
    ] as const)("recusa %s", async (_caso, method, body) => {
      const res = await http()
        [method]("/api/me/sheet")
        .set(auth())
        .send(body)
        .expect(400);
      expect(res.body.message).toBe("Ficha inválida.");
    });

    it("recusa JSON malformado", async () => {
      const res = await http()
        .put("/api/me/sheet")
        .set(auth())
        .set("Content-Type", "application/json")
        .send('{"sheet":')
        .expect(400);
      expect(res.body.message).toBe("JSON inválido.");
    });

    it("recusa corpo acima de 1 MB", async () => {
      const res = await http()
        .put("/api/me/sheet")
        .set(auth())
        .send({ sheet: { notas: "x".repeat(1_100_000) } })
        .expect(413);
      expect(res.body.statusCode).toBe(413);
      const { body } = await http()
        .get("/api/me/sheet")
        .set(auth())
        .expect(200);
      expect(body.sheet.notas).toBeUndefined();
    });

    it("exige token", async () => {
      await http().get("/api/me/sheet").expect(401);
    });
  });

  describe("trava das Características", () => {
    let token: string;
    const auth = () => ({ Authorization: `Bearer ${token}` });
    const criada = {
      attrs: { Força: 2, Vigor: 1 },
      criada: true,
      fome: 1,
      skills: { Briga: 1 },
    };

    beforeAll(async () => {
      ({ token } = await signup("trava"));
    });

    it("durante a criação, Atributos e Habilidades são livres", async () => {
      await http()
        .put("/api/me/sheet")
        .set(auth())
        .send({ sheet: { attrs: { Força: 1 }, criada: false } })
        .expect(200);
      await http()
        .patch("/api/me/sheet")
        .set(auth())
        .send({ patch: { skills: { Briga: 3 } } })
        .expect(200);
    });

    it("o patch que conclui a criação passa", async () => {
      const res = await http()
        .patch("/api/me/sheet")
        .set(auth())
        .send({ patch: criada })
        .expect(200);
      expect(res.body.sheet).toMatchObject(criada);
    });

    it.each([
      [
        "PATCH de atributo",
        "patch",
        { patch: { attrs: { Força: 3, Vigor: 1 } } },
      ],
      ["PATCH de habilidade", "patch", { patch: { skills: { Briga: 2 } } }],
      ["PATCH apagando atributos", "patch", { patch: { attrs: null } }],
      ["PUT sem habilidades", "put", { sheet: { attrs: criada.attrs } }],
    ] as const)("recusa %s com a ficha criada", async (_caso, method, body) => {
      const res = await http()
        [method]("/api/me/sheet")
        .set(auth())
        .send(body)
        .expect(403);
      expect(res.body.message).toBe(
        "Atributos e Habilidades só podem ser alterados pelo Mestre."
      );
      const { body: saved } = await http()
        .get("/api/me/sheet")
        .set(auth())
        .expect(200);
      expect(saved.sheet).toMatchObject(criada);
    });

    it("aceita valores iguais em outra ordem e os demais campos", async () => {
      const res = await http()
        .patch("/api/me/sheet")
        .set(auth())
        .send({ patch: { attrs: { Força: 2, Vigor: 1 }, fome: 3 } })
        .expect(200);
      expect(res.body.sheet.fome).toBe(3);
    });
  });

  describe("Mestre", () => {
    let dm: string;
    let player: { id: string; token: string };
    const asDm = () => ({ Authorization: `Bearer ${dm}` });

    beforeAll(async () => {
      const res = await http()
        .post("/api/auth/login")
        .send({ email: "admin@admin.com", password: "!@#ASD123asd" })
        .expect(200);
      expect(res.body.user).toMatchObject({
        email: "admin@admin.com",
        role: "dm",
      });
      dm = res.body.accessToken;
      player = await signup("jogador-da-mesa");
      await http()
        .put("/api/me/sheet")
        .set("Authorization", `Bearer ${player.token}`)
        .send({ sheet: { attrs: { Força: 2 }, criada: true, nome: "Vitória" } })
        .expect(200);
    });

    it("GET /auth/me devolve o papel", async () => {
      const res = await http().get("/api/auth/me").set(asDm()).expect(200);
      expect(res.body.role).toBe("dm");
    });

    it("lista os jogadores com as fichas, sem o Mestre", async () => {
      const semFicha = await signup("sem-ficha");
      const { body } = await http().get("/api/sheets").set(asDm()).expect(200);
      const byId = new Map(
        body.map((item: { user: { id: string } }) => [item.user.id, item])
      );
      expect(byId.get(player.id)).toMatchObject({
        sheet: { nome: "Vitória" },
        user: { email: emailOf("jogador-da-mesa"), role: "player" },
      });
      expect(byId.get(semFicha.id)).toMatchObject({
        sheet: null,
        updatedAt: null,
      });
      expect(
        body.some((item: { user: { role: string } }) => item.user.role === "dm")
      ).toBe(false);
    });

    it("lê e muda Atributos de ficha criada", async () => {
      const read = await http()
        .get(`/api/sheets/${player.id}`)
        .set(asDm())
        .expect(200);
      expect(read.body).toMatchObject({
        sheet: { nome: "Vitória" },
        user: { email: emailOf("jogador-da-mesa"), id: player.id },
      });
      const res = await http()
        .patch(`/api/sheets/${player.id}`)
        .set(asDm())
        .send({ patch: { attrs: { Força: 4 }, fome: 2 } })
        .expect(200);
      expect(res.body.sheet).toMatchObject({
        attrs: { Força: 4 },
        fome: 2,
        nome: "Vitória",
      });
    });

    it("404 para jogador inexistente e 400 para id inválido", async () => {
      const missing = await http()
        .get("/api/sheets/00000000-0000-4000-8000-000000000000")
        .set(asDm())
        .expect(404);
      expect(missing.body.message).toBe("Jogador não encontrado.");
      await http().get("/api/sheets/abc").set(asDm()).expect(400);
    });

    it.each([
      ["listar", "get", "/api/sheets"],
      ["ler outra ficha", "get", "/api/sheets/:id"],
      ["mudar outra ficha", "patch", "/api/sheets/:id"],
    ] as const)("jogador não pode %s", async (_caso, method, path) => {
      const res = await http()
        [method](path.replace(":id", player.id))
        .set("Authorization", `Bearer ${player.token}`)
        .send({ patch: { fome: 5 } })
        .expect(403);
      expect(res.body.message).toBe("Apenas o Mestre pode fazer isso.");
    });
  });

  describe("CORS", () => {
    it("libera a origem do web", async () => {
      const res = await http()
        .options("/api/me/sheet")
        .set("Origin", "http://localhost:3000")
        .set("Access-Control-Request-Method", "PATCH")
        .set("Access-Control-Request-Headers", "authorization,content-type");
      expect(res.headers["access-control-allow-origin"]).toBe(
        "http://localhost:3000"
      );
    });

    it("não libera outras origens", async () => {
      const res = await http()
        .options("/api/me/sheet")
        .set("Origin", "http://evil.test")
        .set("Access-Control-Request-Method", "PATCH");
      expect(res.headers["access-control-allow-origin"]).toBeUndefined();
    });
  });

  describe("documentação", () => {
    it("serve o Swagger UI sem token", async () => {
      const res = await http().get("/api/docs").expect(200);
      expect(res.headers["content-type"]).toContain("text/html");
      expect(res.text).toContain("swagger-ui");
    });

    it("serve o OpenAPI com todas as rotas", async () => {
      const { body } = await http().get("/api/docs-json").expect(200);
      expect(body.openapi).toBe("3.0.0");
      expect(
        Object.entries(body.paths).flatMap(([path, ops]) =>
          Object.keys(ops as object).map((method) => `${method} ${path}`)
        )
      ).toEqual(
        expect.arrayContaining([
          "post /api/auth/signup",
          "post /api/auth/login",
          "get /api/auth/me",
          "get /api/me/sheet",
          "put /api/me/sheet",
          "patch /api/me/sheet",
          "get /api/sheets",
          "get /api/sheets/{userId}",
          "patch /api/sheets/{userId}",
          "get /api/health",
        ])
      );
    });

    it("descreve corpo, erros e Bearer", async () => {
      const { body } = await http().get("/api/docs-json").expect(200);
      const { paths } = body;

      const signupBody =
        paths["/api/auth/signup"].post.requestBody.content["application/json"]
          .schema;
      expect(signupBody.required).toEqual(
        expect.arrayContaining(["email", "name", "password"])
      );
      expect(signupBody.properties.password.minLength).toBe(6);

      const login = paths["/api/auth/login"].post;
      expect(Object.keys(login.responses)).toEqual(
        expect.arrayContaining(["200", "400", "401"])
      );
      expect(
        login.responses["401"].content["application/json"].schema.required
      ).toEqual(expect.arrayContaining(["statusCode", "message", "error"]));

      expect(body.components.securitySchemes.bearer).toMatchObject({
        scheme: "bearer",
        type: "http",
      });
      expect(paths["/api/me/sheet"].get.security).toEqual([{ bearer: [] }]);
      expect(paths["/api/auth/me"].get.security).toEqual([{ bearer: [] }]);
      expect(login.security).toBeUndefined();
      expect(paths["/api/health"].get.security).toBeUndefined();
    });
  });
});
