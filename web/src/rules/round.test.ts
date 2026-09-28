import { describe, expect, it } from "vitest";
import type { RoundEntry, RoundState } from "#/lib/types";
import {
  add,
  canPrev,
  clear,
  currentEntry,
  move,
  next,
  prev,
  remove,
  removeEntry,
  restart,
  setInitiative,
  sortByInitiative,
} from "./round";

const entry = (
  id: string,
  iniciativa: number | null = null,
  tipo: RoundEntry["tipo"] = "inimigo"
): RoundEntry => ({ id, iniciativa, tipo });

const state = (ordem: RoundEntry[], vez = 0, rodada = 1): RoundState => ({
  ordem,
  rodada,
  vez,
});

const ids = (s: RoundState) => s.ordem.map((e) => e.id);

describe("regras da rodada", () => {
  it("virar a rodada: depois do último, rodada 2 com a vez do primeiro", () => {
    const s = next(state([entry("a"), entry("b")], 1));
    expect(s).toMatchObject({ rodada: 2, vez: 0 });
  });

  it("próximo avança a vez dentro da rodada", () => {
    expect(next(state([entry("a"), entry("b")], 0))).toMatchObject({
      rodada: 1,
      vez: 1,
    });
  });

  it("voltar da rodada: antes do primeiro, último da rodada anterior", () => {
    const s = prev(state([entry("a"), entry("b"), entry("c")], 0, 2));
    expect(s).toMatchObject({ rodada: 1, vez: 2 });
  });

  it("anterior não faz nada na rodada 1, vez do primeiro", () => {
    const s = state([entry("a"), entry("b")], 0, 1);
    expect(canPrev(s)).toBe(false);
    expect(prev(s)).toBe(s);
    expect(canPrev(state([], 0, 3))).toBe(false);
  });

  it("próximo sem ninguém não muda nada", () => {
    const s = state([]);
    expect(next(s)).toBe(s);
  });

  it("reiniciar volta à rodada 1 sem mexer na ordem", () => {
    const s = restart(state([entry("a"), entry("b")], 1, 4));
    expect(s).toMatchObject({ rodada: 1, vez: 0 });
    expect(ids(s)).toEqual(["a", "b"]);
  });

  it("ordenar por iniciativa mantém a vez e põe vazias por último", () => {
    const s = sortByInitiative(
      state([entry("a", 3), entry("b"), entry("c", 9)], 0)
    );
    expect(ids(s)).toEqual(["c", "a", "b"]);
    expect(currentEntry(s)?.id).toBe("a");
  });

  it("ordenar mantém os empates na ordem atual", () => {
    const s = sortByInitiative(
      state([entry("a", 5), entry("b", 7), entry("c", 5)])
    );
    expect(ids(s)).toEqual(["b", "a", "c"]);
  });

  it("↑/↓ trocam com o vizinho e a vez segue o participante", () => {
    const s = move(state([entry("a"), entry("b"), entry("c")], 1), 1, -1);
    expect(ids(s)).toEqual(["b", "a", "c"]);
    expect(currentEntry(s)?.id).toBe("b");
    const same = state([entry("a")]);
    expect(move(same, 0, -1)).toBe(same);
  });

  it("remover quem tem a vez passa a vez a quem vem depois", () => {
    const s = remove(state([entry("a"), entry("b"), entry("c")], 1), 1);
    expect(ids(s)).toEqual(["a", "c"]);
    expect(currentEntry(s)?.id).toBe("c");
    expect(s.rodada).toBe(1);
  });

  it("remover alguém antes da vez faz a vez recuar", () => {
    const s = remove(state([entry("a"), entry("b"), entry("c")], 2), 0);
    expect(currentEntry(s)?.id).toBe("c");
  });

  it("remover o último com a vez volta ao primeiro na mesma rodada", () => {
    const s = remove(state([entry("a"), entry("b")], 1, 3), 1);
    expect(s).toMatchObject({ rodada: 3, vez: 0 });
  });

  it("colocar acrescenta no fim sem mudar a vez e não repete", () => {
    const s = add(state([entry("a")], 0), "jogador", "u1");
    expect(s.ordem.at(-1)).toEqual({
      id: "u1",
      iniciativa: null,
      tipo: "jogador",
    });
    expect(s.vez).toBe(0);
    expect(add(s, "jogador", "u1")).toBe(s);
  });

  it("tirar pelo tipo e id", () => {
    const s = removeEntry(state([entry("a"), entry("b")]), "inimigo", "a");
    expect(ids(s)).toEqual(["b"]);
  });

  it("esvaziar volta ao início", () => {
    expect(clear()).toEqual({ ordem: [], rodada: 1, vez: 0 });
  });

  it("iniciativa fica entre 0 e 30", () => {
    const s = state([entry("a")]);
    expect(setInitiative(s, 0, 42).ordem[0]?.iniciativa).toBe(30);
    expect(setInitiative(s, 0, -1).ordem[0]?.iniciativa).toBe(0);
    expect(setInitiative(s, 0, null).ordem[0]?.iniciativa).toBeNull();
  });
});
