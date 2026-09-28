import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { asc, eq, sql } from "drizzle-orm";
import { type Database, DRIZZLE } from "../db/db.module.js";
import { enemies, rounds } from "../db/schema.js";
import type { EnemyData } from "./chronicle.schemas.js";
import { keepEntries, readRound } from "./round-state.js";

const NOT_FOUND = "Inimigo não encontrado.";

export interface EnemyRecord {
  enemy: EnemyData;
  id: string;
  updatedAt: Date;
}

const columns = {
  enemy: sql<EnemyData>`${enemies.data}`,
  id: enemies.id,
  updatedAt: enemies.updatedAt,
};

@Injectable()
export class EnemiesService {
  constructor(@Inject(DRIZZLE) private readonly db: Database) {}

  /** Por ordem de criação: o novo fica embaixo. */
  list(): Promise<EnemyRecord[]> {
    return this.db
      .select(columns)
      .from(enemies)
      .orderBy(asc(enemies.createdAt), asc(enemies.id));
  }

  async create(enemy: EnemyData): Promise<EnemyRecord> {
    const [row] = await this.db
      .insert(enemies)
      .values({ data: enemy })
      .returning(columns);
    return row;
  }

  async replace(id: string, enemy: EnemyData): Promise<EnemyRecord> {
    const [row] = await this.db
      .update(enemies)
      .set({ data: enemy, updatedAt: sql`now()` })
      .where(eq(enemies.id, id))
      .returning(columns);
    if (!row) {
      throw new NotFoundException(NOT_FOUND);
    }
    return row;
  }

  /** Apaga o inimigo e o tira da rodada, na mesma transação. */
  remove(id: string): Promise<void> {
    return this.db.transaction(async (tx) => {
      const [row] = await tx
        .delete(enemies)
        .where(eq(enemies.id, id))
        .returning({ id: enemies.id });
      if (!row) {
        throw new NotFoundException(NOT_FOUND);
      }
      const [round] = await tx
        .select({ data: rounds.data })
        .from(rounds)
        .where(eq(rounds.id, 1))
        .for("update");
      if (!round) {
        return;
      }
      const state = readRound(round.data);
      const next = keepEntries(
        state,
        (e) => !(e.tipo === "inimigo" && e.id === id)
      );
      if (next.ordem.length !== state.ordem.length) {
        await tx
          .update(rounds)
          .set({ data: next, updatedAt: sql`now()` })
          .where(eq(rounds.id, 1));
      }
    });
  }
}
