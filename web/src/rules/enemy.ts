import type { DamageMark, Enemy } from "#/lib/types";
import { cycleBox, trackBoxes } from "./tracks";

export const ENEMY_TRACK_MIN = 1;
export const ENEMY_TRACK_MAX = 20;
export const POOL_MAX = 30;

export type EnemyTrack = "vit" | "fdv";

/** O inimigo que "+ Novo inimigo" cria: fora da rodada e oculto. */
export const NEW_ENEMY: Enemy = {
  especiais: [],
  fdv: [],
  fdvMax: 3,
  nome: "",
  paradas: [],
  visivel: false,
  vit: [],
  vitMax: 5,
};

export const enemyName = (nome: string) => nome.trim() || "Inimigo sem nome";

const maxKey = (track: EnemyTrack) => (track === "vit" ? "vitMax" : "fdvMax");

/** As caixas da trilha no tamanho do máximo. */
export function enemyMarks(enemy: Enemy, track: EnemyTrack): DamageMark[] {
  return trackBoxes(enemy[track], enemy[maxKey(track)]);
}

/** Máximo de 1 a 20; as caixas que saem são descartadas. */
export function setTrackMax(
  enemy: Enemy,
  track: EnemyTrack,
  max: number
): Enemy {
  const value = Math.min(ENEMY_TRACK_MAX, Math.max(ENEMY_TRACK_MIN, max));
  return {
    ...enemy,
    [maxKey(track)]: value,
    [track]: trackBoxes(enemy[track], value),
  };
}

/** vazio → superficial → agravado → vazio */
export function cycleEnemyBox(
  enemy: Enemy,
  track: EnemyTrack,
  index: number
): Enemy {
  return { ...enemy, [track]: cycleBox(enemyMarks(enemy, track), index) };
}

/** Cópia para "Duplicar": nome com "(cópia)" e sem dano. */
export function duplicateEnemy(enemy: Enemy): Enemy {
  return {
    ...enemy,
    especiais: enemy.especiais.map((e) => ({ ...e })),
    fdv: [],
    nome: `${enemyName(enemy.nome)} (cópia)`,
    paradas: enemy.paradas.map((p) => ({ ...p })),
    vit: [],
  };
}
