import { describe, expect, it } from "vitest";
import {
  cycleEnemyBox,
  duplicateEnemy,
  enemyMarks,
  enemyName,
  NEW_ENEMY,
  setTrackMax,
} from "./enemy";

describe("regras do inimigo", () => {
  it("novo inimigo: Vitalidade 5, Força de Vontade 3, oculto", () => {
    expect(NEW_ENEMY).toMatchObject({ fdvMax: 3, visivel: false, vitMax: 5 });
    expect(enemyMarks(NEW_ENEMY, "vit")).toEqual([0, 0, 0, 0, 0]);
  });

  it("sem nome vira 'Inimigo sem nome'", () => {
    expect(enemyName("  ")).toBe("Inimigo sem nome");
    expect(enemyName("Encourado")).toBe("Encourado");
  });

  it("o máximo fica entre 1 e 20 e descarta as caixas que saem", () => {
    const hurt = { ...NEW_ENEMY, vit: [0, 0, 0, 1, 2] as const };
    const smaller = setTrackMax({ ...hurt, vit: [...hurt.vit] }, "vit", 3);
    expect(smaller.vitMax).toBe(3);
    expect(smaller.vit).toEqual([0, 0, 0]);
    expect(setTrackMax(NEW_ENEMY, "fdv", 0).fdvMax).toBe(1);
    expect(setTrackMax(NEW_ENEMY, "fdv", 25).fdvMax).toBe(20);
  });

  it("tocar na caixa cicla vazio → superficial → agravado", () => {
    const once = cycleEnemyBox(NEW_ENEMY, "vit", 0);
    expect(once.vit[0]).toBe(1);
    expect(cycleEnemyBox(once, "vit", 0).vit[0]).toBe(2);
  });

  it("duplicar copia tudo menos o dano, com '(cópia)'", () => {
    const enemy = {
      ...NEW_ENEMY,
      especiais: [{ nome: "Garras", texto: "<b>x</b>" }],
      fdv: [1],
      nome: "Encourado",
      paradas: [{ dados: 7, nome: "Garras" }],
      visivel: true,
      vit: [2, 1],
    } as typeof NEW_ENEMY;
    expect(duplicateEnemy(enemy)).toEqual({
      ...enemy,
      fdv: [],
      nome: "Encourado (cópia)",
      vit: [],
    });
  });
});
