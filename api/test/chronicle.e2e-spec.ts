import type { NestExpressApplication } from "@nestjs/platform-express";
import { Test } from "@nestjs/testing";
import { eq, inArray, like } from "drizzle-orm";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { AppModule } from "../src/app.module.js";
import { ApiExpressAdapter, configureApp } from "../src/app.setup.js";
import { type Database, DRIZZLE } from "../src/db/db.module.js";
import { coteries, enemies, rounds, users } from "../src/db/schema.js";

/** Precisa do Postgres do compose (`docker compose up db`) e do `.env`. */
describe("crônica: coteries, Bestiário e rodada (e2e)", () => {
  let app: NestExpressApplication;
  let db: Database;
  let dm: string;
  let savedRound: Record<string, unknown> | undefined;
  const coterieIds: string[] = [];
  const enemyIds: string[] = [];
  const run = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const emailOf = (name: string) => `${name}-${run}@e2e.test`;
  const tag = Math.random().toString(36).slice(2, 10);
  let players = 0;

  const http = () => request(app.getHttpServer());
  const asDm = () => ({ Authorization: `Bearer ${dm}` });
  const as = (token: string) => ({ Authorization: `Bearer ${token}` });

  async function player(
    name: string,
    sheet: Record<string, unknown> | null = { criada: true, nome: name }
  ): Promise<{ id: string; token: string }> {
    players += 1;
    const res = await http()
      .post("/api/auth/signup")
      .send({
        email: emailOf(name),
        name,
        password: "segredo",
        username: `c${players}_${tag}`,
      })
      .expect(201);
    const token = res.body.accessToken;
    if (sheet) {
      await http()
        .put("/api/me/sheet")
        .set(as(token))
        .send({ sheet })
        .expect(200);
    }
    return { id: res.body.user.id, token };
  }

  async function newCoterie(nome = ""): Promise<string> {
    const res = await http()
      .post("/api/coteries")
      .set(asDm())
      .send({ nome })
      .expect(201);
    coterieIds.push(res.body.id);
    return res.body.id;
  }

  const enemy = {
    especiais: [
      { nome: "Garras", texto: "<p>Garras <strong>agravadas</strong></p>" },
    ],
    fdv: [],
    fdvMax: 3,
    nome: "Encourado",
    paradas: [{ dados: 7, nome: "Garras" }],
    visivel: false,
    vit: [1],
    vitMax: 5,
  };

  async function newEnemy(patch: Partial<typeof enemy> = {}): Promise<string> {
    const res = await http()
      .post("/api/enemies")
      .set(asDm())
      .send({ enemy: { ...enemy, ...patch } })
      .expect(201);
    enemyIds.push(res.body.id);
    return res.body.id;
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
    await app.listen(0);
    db = app.get(DRIZZLE);
    [{ data: savedRound } = { data: undefined }] = await db
      .select({ data: rounds.data })
      .from(rounds)
      .where(eq(rounds.id, 1));
    const res = await http()
      .post("/api/auth/login")
      .send({ identifier: "admin@admin.com", password: "!@#ASD123asd" })
      .expect(200);
    dm = res.body.accessToken;
  });

  afterAll(async () => {
    if (savedRound) {
      await db.update(rounds).set({ data: savedRound }).where(eq(rounds.id, 1));
    }
    if (coterieIds.length) {
      await db.delete(coteries).where(inArray(coteries.id, coterieIds));
    }
    if (enemyIds.length) {
      await db.delete(enemies).where(inArray(enemies.id, enemyIds));
    }
    await db.delete(users).where(like(users.email, emailOf("%")));
    await app?.close();
  });

  describe("coteries", () => {
    it("cria, renomeia, coloca e retira membros", async () => {
      const vitoria = await player("vitoria", {
        attrs: { Força: 3, Vigor: 2 },
        cla: "Ventrue",
        criada: true,
        fome: 1,
        nome: "Vitória Salles",
      });
      const id = await newCoterie();

      const renamed = await http()
        .patch(`/api/coteries/${id}`)
        .set(asDm())
        .send({ nome: "  Os Sem-Sol " })
        .expect(200);
      expect(renamed.body).toEqual({ id, membros: [], nome: "Os Sem-Sol" });

      const added = await http()
        .put(`/api/coteries/${id}/membros/${vitoria.id}`)
        .set(asDm())
        .expect(200);
      expect(added.body.membros).toEqual([
        expect.objectContaining({
          sheet: expect.objectContaining({ nome: "Vitória Salles" }),
          user: expect.objectContaining({
            email: emailOf("vitoria"),
            id: vitoria.id,
          }),
        }),
      ]);
      // colocar de novo na mesma não muda nada
      await http()
        .put(`/api/coteries/${id}/membros/${vitoria.id}`)
        .set(asDm())
        .expect(200);

      const list = await http().get("/api/coteries").set(asDm()).expect(200);
      expect(
        list.body.find((c: { id: string }) => c.id === id).membros
      ).toHaveLength(1);

      const removed = await http()
        .delete(`/api/coteries/${id}/membros/${vitoria.id}`)
        .set(asDm())
        .expect(200);
      expect(removed.body.membros).toEqual([]);
    });

    it("um jogador fica em no máximo uma coterie", async () => {
      const p = await player("dono-de-uma");
      const a = await newCoterie("A");
      const b = await newCoterie("B");
      await http()
        .put(`/api/coteries/${a}/membros/${p.id}`)
        .set(asDm())
        .expect(200);
      const res = await http()
        .put(`/api/coteries/${b}/membros/${p.id}`)
        .set(asDm())
        .expect(409);
      expect(res.body.message).toBe("Este jogador já está em outra coterie.");
    });

    it("recusa jogador sem personagem e coterie inexistente", async () => {
      const sem = await player("sem-personagem", null);
      const id = await newCoterie();
      const res = await http()
        .put(`/api/coteries/${id}/membros/${sem.id}`)
        .set(asDm())
        .expect(400);
      expect(res.body.message).toBe(
        "Este jogador ainda não criou o personagem."
      );
      const missing = await http()
        .patch("/api/coteries/00000000-0000-4000-8000-000000000000")
        .set(asDm())
        .send({ nome: "x" })
        .expect(404);
      expect(missing.body.message).toBe("Coterie não encontrada.");
    });

    it("excluir a coterie libera os membros", async () => {
      const p = await player("liberado");
      const a = await newCoterie();
      await http()
        .put(`/api/coteries/${a}/membros/${p.id}`)
        .set(asDm())
        .expect(200);
      await http().delete(`/api/coteries/${a}`).set(asDm()).expect(204);
      const b = await newCoterie();
      await http()
        .put(`/api/coteries/${b}/membros/${p.id}`)
        .set(asDm())
        .expect(200);
    });

    it("o jogador vê a própria coterie, sem e-mail nem ficha inteira", async () => {
      const eu = await player("eu", {
        attrs: { Força: 4, Vigor: 3 },
        criada: true,
        nome: "Eu",
        notas: "segredo",
      });
      const outro = await player("outro");
      const semCoterie = await player("sozinho");
      const id = await newCoterie("Mesa");
      await http()
        .put(`/api/coteries/${id}/membros/${eu.id}`)
        .set(asDm())
        .expect(200);
      await http()
        .put(`/api/coteries/${id}/membros/${outro.id}`)
        .set(asDm())
        .expect(200);

      const { body } = await http()
        .get("/api/me/coterie")
        .set(as(outro.token))
        .expect(200);
      expect(body).toEqual({
        coterie: {
          id,
          membros: [
            {
              sheet: { attrs: { Vigor: 3 }, criada: true, nome: "Eu" },
              userId: eu.id,
            },
            {
              sheet: { attrs: {}, criada: true, nome: "outro" },
              userId: outro.id,
            },
          ],
          nome: "Mesa",
        },
      });
      expect(JSON.stringify(body)).not.toContain("@e2e.test");

      await http()
        .get("/api/me/coterie")
        .set(as(semCoterie.token))
        .expect(200, { coterie: null });
    });
  });

  describe("Bestiário e rodada", () => {
    it("cria no fim, substitui e valida o inimigo", async () => {
      const id = await newEnemy();
      const list = await http().get("/api/enemies").set(asDm()).expect(200);
      expect(list.body.at(-1)).toMatchObject({ enemy, id });

      const res = await http()
        .put(`/api/enemies/${id}`)
        .set(asDm())
        .send({ enemy: { ...enemy, vitMax: 6 } })
        .expect(200);
      expect(res.body.enemy.vitMax).toBe(6);

      const invalid = await http()
        .put(`/api/enemies/${id}`)
        .set(asDm())
        .send({ enemy: { ...enemy, vit: [0, 0, 0, 1], vitMax: 3 } })
        .expect(400);
      expect(invalid.body.message).toBe("Inimigo inválido.");
    });

    it("grava a rodada e filtra os dados de inimigo oculto para jogadores", async () => {
      const p = await player("na-rodada", {
        attrs: { Vigor: 2 },
        criada: true,
        fome: 2,
        nome: "Na Rodada",
        skills: { Briga: 3 },
      });
      const oculto = await newEnemy({ nome: "Vulto" });
      const visivel = await newEnemy({ nome: "Cão", visivel: true });
      const state = {
        ordem: [
          { id: p.id, iniciativa: 4, tipo: "jogador" },
          { id: oculto, iniciativa: 7, tipo: "inimigo" },
          { id: visivel, iniciativa: null, tipo: "inimigo" },
        ],
        rodada: 2,
        vez: 1,
      };
      const saved = await http()
        .put("/api/round")
        .set(asDm())
        .send(state)
        .expect(200);
      expect(saved.body).toMatchObject({ rodada: 2, vez: 1 });
      expect(saved.body.ordem[1]).toMatchObject({
        dados: { vitMax: 5 },
        nome: "Vulto",
        visivel: false,
      });

      const { body } = await http()
        .get("/api/round")
        .set(as(p.token))
        .expect(200);
      expect(body.ordem).toEqual([
        {
          id: p.id,
          iniciativa: 4,
          sheet: {
            attrs: { Vigor: 2 },
            criada: true,
            fome: 2,
            nome: "Na Rodada",
          },
          tipo: "jogador",
        },
        {
          dados: null,
          id: oculto,
          iniciativa: 7,
          nome: "Vulto",
          tipo: "inimigo",
          visivel: false,
        },
        expect.objectContaining({
          dados: expect.objectContaining({ paradas: enemy.paradas }),
          nome: "Cão",
          visivel: true,
        }),
      ]);
      expect(JSON.stringify(body)).not.toContain("Briga");
    });

    it("excluir o inimigo o tira da rodada", async () => {
      const a = await newEnemy({ nome: "A" });
      const b = await newEnemy({ nome: "B" });
      await http()
        .put("/api/round")
        .set(asDm())
        .send({
          ordem: [
            { id: a, iniciativa: null, tipo: "inimigo" },
            { id: b, iniciativa: null, tipo: "inimigo" },
          ],
          rodada: 1,
          vez: 1,
        })
        .expect(200);
      await http().delete(`/api/enemies/${a}`).set(asDm()).expect(204);
      const { body } = await http().get("/api/round").set(asDm()).expect(200);
      expect(body.ordem.map((e: { id: string }) => e.id)).toEqual([b]);
      expect(body.vez).toBe(0);
    });

    it("recusa participante inexistente e vez fora da ordem", async () => {
      const missing = await http()
        .put("/api/round")
        .set(asDm())
        .send({
          ordem: [
            {
              id: "00000000-0000-4000-8000-000000000000",
              iniciativa: null,
              tipo: "inimigo",
            },
          ],
          rodada: 1,
          vez: 0,
        })
        .expect(400);
      expect(missing.body.message).toBe("Participante inválido na rodada.");
      const vez = await http()
        .put("/api/round")
        .set(asDm())
        .send({ ordem: [], rodada: 1, vez: 3 })
        .expect(400);
      expect(vez.body.message).toBe("Vez fora da ordem.");
    });

    it.each([
      ["listar coteries", "get", "/api/coteries"],
      ["criar coterie", "post", "/api/coteries"],
      ["listar inimigos", "get", "/api/enemies"],
      ["criar inimigo", "post", "/api/enemies"],
      ["gravar a rodada", "put", "/api/round"],
    ] as const)("jogador não pode %s", async (_caso, method, path) => {
      const p = await player(`proibido-${method}-${path.length}`);
      const res = await http()
        [method](path)
        .set(as(p.token))
        .send({})
        .expect(403);
      expect(res.body.message).toBe("Apenas o Mestre pode fazer isso.");
    });

    it("rotas da crônica exigem token", async () => {
      await http().get("/api/round").expect(401);
      await http().get("/api/me/coterie").expect(401);
    });

    it("as rotas novas aparecem no OpenAPI", async () => {
      const { body } = await http().get("/api/docs-json").expect(200);
      expect(Object.keys(body.paths)).toEqual(
        expect.arrayContaining([
          "/api/coteries",
          "/api/coteries/{id}",
          "/api/coteries/{id}/membros/{userId}",
          "/api/me/coterie",
          "/api/enemies",
          "/api/enemies/{id}",
          "/api/round",
        ])
      );
    });
  });
});
