import { describe, expect, it } from "vitest";
import { patchSheetSchema, replaceSheetSchema } from "./sheets.schemas.js";

describe("schemas da ficha", () => {
  it("aceita um objeto e mantém campos desconhecidos", () => {
    const sheet = { fome: 1, novoCampo: { x: [1, 2] } };
    expect(replaceSheetSchema.parse({ sheet })).toEqual({ sheet });
  });

  it.each([
    [{ sheet: [1, 2] }],
    [{ sheet: "texto" }],
    [{ sheet: null }],
    [{}],
    [undefined],
  ])("recusa %j no PUT", (body) => {
    const result = replaceSheetSchema.safeParse(body);
    expect(result.error?.issues[0]?.message).toBe("Ficha inválida.");
  });

  it("recusa patch que não é objeto", () => {
    const result = patchSheetSchema.safeParse({ patch: "texto" });
    expect(result.error?.issues[0]?.message).toBe("Ficha inválida.");
  });
});
