import { describe, expect, it } from "vitest";
import {
  coterieNameSchema,
  enemyBodySchema,
  roundStateSchema,
} from "./chronicle.schemas.js";

const enemy = {
  especiais: [
    { nome: "Garras", texto: "<p>Garras <strong>agravadas</strong></p>" },
  ],
  fdv: [],
  fdvMax: 3,
  nome: "Encourado",
  paradas: [{ dados: 7, nome: "Garras" }],
  visivel: false,
  vit: [0, 1, 2],
  vitMax: 5,
};
const ID = "00000000-0000-4000-8000-000000000001";
const ID2 = "00000000-0000-4000-8000-000000000002";

const message = (result: { error?: { issues: { message: string }[] } }) =>
  result.error?.issues[0]?.message;

describe("schemas da crônica", () => {
  it("aceita um inimigo válido", () => {
    expect(enemyBodySchema.parse({ enemy })).toEqual({ enemy });
  });

  it.each([
    ["trilha maior que o máximo", { vit: [0, 0, 0, 1], vitMax: 3 }],
    ["marca fora de 0–2", { vit: [3] }],
    ["máximo acima de 20", { vitMax: 21 }],
    ["dados acima de 30", { paradas: [{ dados: 31, nome: "x" }] }],
    ["nome longo demais", { nome: "x".repeat(121) }],
    ["visibilidade ausente", { visivel: undefined }],
  ])("recusa inimigo com %s", (_caso, patch) => {
    const result = enemyBodySchema.safeParse({ enemy: { ...enemy, ...patch } });
    expect(message(result)).toBe("Inimigo inválido.");
  });

  it("apara o nome da coterie e limita a 80", () => {
    expect(coterieNameSchema.parse({ nome: "  Os Sem-Sol " })).toEqual({
      nome: "Os Sem-Sol",
    });
    expect(message(coterieNameSchema.safeParse({ nome: "x".repeat(81) }))).toBe(
      "O nome da coterie tem no máximo 80 caracteres."
    );
  });

  it("aceita a rodada vazia e uma com participantes", () => {
    expect(
      roundStateSchema.safeParse({ ordem: [], rodada: 1, vez: 0 }).success
    ).toBe(true);
    const ordem = [
      { id: ID, iniciativa: 4, tipo: "jogador" },
      { id: ID2, iniciativa: null, tipo: "inimigo" },
    ];
    expect(
      roundStateSchema.safeParse({ ordem, rodada: 3, vez: 1 }).success
    ).toBe(true);
  });

  it("recusa a vez fora da ordem", () => {
    const ordem = [
      { id: ID, iniciativa: null, tipo: "jogador" },
      { id: ID2, iniciativa: null, tipo: "inimigo" },
    ];
    expect(
      message(roundStateSchema.safeParse({ ordem, rodada: 1, vez: 3 }))
    ).toBe("Vez fora da ordem.");
    expect(
      message(roundStateSchema.safeParse({ ordem: [], rodada: 1, vez: 1 }))
    ).toBe("Vez fora da ordem.");
  });

  it("recusa participante repetido ou inválido", () => {
    const repetido = [
      { id: ID, iniciativa: null, tipo: "jogador" },
      { id: ID, iniciativa: 2, tipo: "jogador" },
    ];
    expect(
      message(
        roundStateSchema.safeParse({ ordem: repetido, rodada: 1, vez: 0 })
      )
    ).toBe("Participante inválido na rodada.");
    expect(
      message(
        roundStateSchema.safeParse({
          ordem: [{ id: ID, iniciativa: 31, tipo: "jogador" }],
          rodada: 1,
          vez: 0,
        })
      )
    ).toBe("Participante inválido na rodada.");
  });
});
