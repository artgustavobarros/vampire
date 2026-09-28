import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { and, eq, inArray, sql } from "drizzle-orm";
import { type Database, DRIZZLE } from "../db/db.module.js";
import { enemies, rounds, sheets, type User, users } from "../db/schema.js";
import type {
  EnemyData,
  RoundEntry,
  RoundState,
  RoundView,
} from "./chronicle.schemas.js";
import { keepEntries, readRound } from "./round-state.js";
import { projectSheet } from "./sheet-projection.js";

const INVALID_ENTRY = "Participante inválido na rodada.";

const idsOf = (ordem: RoundEntry[], tipo: RoundEntry["tipo"]) =>
  ordem.filter((e) => e.tipo === tipo).map((e) => e.id);

@Injectable()
export class RoundService {
  constructor(@Inject(DRIZZLE) private readonly db: Database) {}

  /**
   * A rodada com cada participante já completo. Quem sumiu (jogador ou
   * inimigo apagado) fica de fora; os dados de inimigo oculto só vão ao Mestre.
   */
  async view(viewer: Pick<User, "role">): Promise<RoundView> {
    const [row] = await this.db
      .select({ data: rounds.data, updatedAt: rounds.updatedAt })
      .from(rounds)
      .where(eq(rounds.id, 1));
    const stored = readRound(row?.data);
    const players = await this.players(idsOf(stored.ordem, "jogador"));
    const foes = await this.enemies(idsOf(stored.ordem, "inimigo"));
    const state = keepEntries(stored, (e) =>
      e.tipo === "jogador" ? players.has(e.id) : foes.has(e.id)
    );
    const isDm = viewer.role === "dm";

    return {
      ordem: state.ordem.map((entry) => {
        if (entry.tipo === "jogador") {
          return {
            id: entry.id,
            iniciativa: entry.iniciativa,
            sheet: projectSheet(players.get(entry.id) ?? null),
            tipo: "jogador" as const,
          };
        }
        const { nome, visivel, ...dados } = foes.get(entry.id) as EnemyData;
        return {
          dados: isDm || visivel ? dados : null,
          id: entry.id,
          iniciativa: entry.iniciativa,
          nome,
          tipo: "inimigo" as const,
          visivel,
        };
      }),
      rodada: state.rodada,
      updatedAt: row?.updatedAt.toISOString() ?? null,
      vez: state.vez,
    };
  }

  /** Grava o estado inteiro, que o Mestre calcula no web. */
  async replace(state: RoundState, viewer: Pick<User, "role">) {
    const players = await this.players(idsOf(state.ordem, "jogador"), true);
    const foes = await this.enemies(idsOf(state.ordem, "inimigo"));
    const valid = state.ordem.every((e) =>
      e.tipo === "jogador" ? players.has(e.id) : foes.has(e.id)
    );
    if (!valid) {
      throw new BadRequestException(INVALID_ENTRY);
    }
    await this.db
      .insert(rounds)
      .values({ data: state, id: 1 })
      .onConflictDoUpdate({
        set: { data: state, updatedAt: sql`now()` },
        target: rounds.id,
      });
    return this.view(viewer);
  }

  /** Fichas dos jogadores existentes; `criadas` exige personagem criado. */
  private async players(ids: string[], criadas = false) {
    const map = new Map<string, Record<string, unknown> | null>();
    if (ids.length === 0) {
      return map;
    }
    const rows = await this.db
      .select({ data: sheets.data, id: users.id })
      .from(users)
      .leftJoin(sheets, eq(sheets.userId, users.id))
      .where(and(inArray(users.id, ids), eq(users.role, "player")));
    for (const { data, id } of rows) {
      if (!criadas || data?.criada === true) {
        map.set(id, data);
      }
    }
    return map;
  }

  private async enemies(ids: string[]) {
    const map = new Map<string, EnemyData>();
    if (ids.length === 0) {
      return map;
    }
    const rows = await this.db
      .select({ data: enemies.data, id: enemies.id })
      .from(enemies)
      .where(inArray(enemies.id, ids));
    for (const { data, id } of rows) {
      map.set(id, data as unknown as EnemyData);
    }
    return map;
  }
}
