import { describe, expect, it } from "vitest";
import type { RoundEntry } from "./chronicle.schemas.js";
import { keepEntries, readRound } from "./round-state.js";

const entry = (id: string): RoundEntry => ({
  id,
  iniciativa: null,
  tipo: "inimigo",
});
const [A, B, C] = [entry("a"), entry("b"), entry("c")];
const ids = (ordem: RoundEntry[]) => ordem.map((e) => e.id);

describe("keepEntries", () => {
  it("quem estava antes da vez faz a vez recuar", () => {
    const next = keepEntries(
      { ordem: [A, B, C], rodada: 2, vez: 2 },
      (e) => e.id !== "a"
    );
    expect(ids(next.ordem)).toEqual(["b", "c"]);
    expect(next).toMatchObject({ rodada: 2, vez: 1 });
  });

  it("se sai quem tinha a vez, ela passa ao seguinte", () => {
    const next = keepEntries(
      { ordem: [A, B, C], rodada: 1, vez: 1 },
      (e) => e.id !== "b"
    );
    expect(next.vez).toBe(1);
    expect(next.ordem[next.vez]?.id).toBe("c");
  });

  it("se sai o último com a vez, ela volta ao primeiro sem mudar a rodada", () => {
    const next = keepEntries(
      { ordem: [A, B, C], rodada: 4, vez: 2 },
      (e) => e.id !== "c"
    );
    expect(next).toMatchObject({ rodada: 4, vez: 0 });
  });

  it("ordem vazia fica com vez 0", () => {
    expect(keepEntries({ ordem: [A], rodada: 1, vez: 0 }, () => false)).toEqual(
      {
        ordem: [],
        rodada: 1,
        vez: 0,
      }
    );
  });
});

describe("readRound", () => {
  it("completa o que falta", () => {
    expect(readRound(undefined)).toEqual({ ordem: [], rodada: 1, vez: 0 });
    expect(readRound({ rodada: 3 })).toEqual({ ordem: [], rodada: 3, vez: 0 });
  });
});
