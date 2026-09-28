import { isDeepStrictEqual } from "node:util";
import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { asc, eq, type SQL, sql } from "drizzle-orm";
import { type Database, DRIZZLE } from "../db/db.module.js";
import { sheets, type User, users } from "../db/schema.js";
import type { PublicUser } from "../users/users.schemas.js";
import { toPublicUser, UsersService } from "../users/users.service.js";
import type { SheetData } from "./sheets.schemas.js";

export interface SheetResponse {
  sheet: SheetData | null;
  updatedAt: Date | null;
}

export interface PlayerSheet extends SheetResponse {
  user: PublicUser;
}

/** Características: depois de `criada`, só o Mestre muda. */
const LOCKED_KEYS = ["attrs", "skills"] as const;
const LOCKED = "Atributos e Habilidades só podem ser alterados pelo Mestre.";

const columns = { sheet: sheets.data, updatedAt: sheets.updatedAt };
const MERGE = sql`${sheets.data} || excluded.data`;

/** `db` ou uma transação dele */
type Executor = Pick<Database, "insert" | "select">;

@Injectable()
export class SheetsService {
  constructor(
    @Inject(DRIZZLE) private readonly db: Database,
    private readonly players: UsersService
  ) {}

  async get(userId: string): Promise<SheetResponse> {
    const [row] = await this.db
      .select(columns)
      .from(sheets)
      .where(eq(sheets.userId, userId));
    return row ?? { sheet: null, updatedAt: null };
  }

  /** Cria ou substitui a ficha inteira do próprio jogador. */
  replace(userId: string, sheet: SheetData): Promise<SheetResponse> {
    return this.db.transaction(async (tx) => {
      await this.assertTraitsUnchanged(tx, userId, sheet, "replace");
      return this.upsert(tx, userId, sheet, sql`excluded.data`);
    });
  }

  /**
   * Mescla rasa, como o `patch` do web: `jsonb || jsonb` troca só as chaves
   * enviadas. Um único comando, então patches seguidos não se sobrescrevem.
   */
  merge(userId: string, patch: SheetData): Promise<SheetResponse> {
    return this.db.transaction(async (tx) => {
      await this.assertTraitsUnchanged(tx, userId, patch, "merge");
      return this.upsert(tx, userId, patch, MERGE);
    });
  }

  /** Todos os jogadores (sem o Mestre), com a ficha ou `null`. */
  async list(): Promise<PlayerSheet[]> {
    const rows = await this.db
      .select({ ...columns, user: users })
      .from(users)
      .leftJoin(sheets, eq(sheets.userId, users.id))
      .where(eq(users.role, "player"))
      .orderBy(asc(users.name), asc(users.email));
    return rows.map(({ sheet, updatedAt, user }) => ({
      sheet,
      updatedAt,
      user: toPublicUser(user),
    }));
  }

  /** Ficha de um jogador, com o jogador, para o Mestre. */
  async getFor(userId: string): Promise<PlayerSheet> {
    const user = await this.assertPlayer(userId);
    return { ...(await this.get(userId)), user: toPublicUser(user) };
  }

  /** Mescla na ficha de um jogador, para o Mestre: sem a trava. */
  async mergeFor(userId: string, patch: SheetData): Promise<SheetResponse> {
    await this.assertPlayer(userId);
    return this.upsert(this.db, userId, patch, MERGE);
  }

  private async assertPlayer(userId: string): Promise<User> {
    const user = await this.players.findPlayerById(userId);
    if (!user) {
      throw new NotFoundException("Jogador não encontrado.");
    }
    return user;
  }

  /**
   * Recusa mudar Atributos ou Habilidades de ficha já criada. Trava a linha
   * até o fim da transação, para `criada` não mudar entre a checagem e a
   * gravação. No `replace`, chave ausente também conta como mudança.
   */
  private async assertTraitsUnchanged(
    tx: Executor,
    userId: string,
    incoming: SheetData,
    mode: "merge" | "replace"
  ): Promise<void> {
    const [row] = await tx
      .select({ data: sheets.data })
      .from(sheets)
      .where(eq(sheets.userId, userId))
      .for("update");
    if (row?.data.criada !== true) {
      return;
    }
    for (const key of LOCKED_KEYS) {
      if (mode === "merge" && !(key in incoming)) {
        continue;
      }
      if (!isDeepStrictEqual(incoming[key], row.data[key])) {
        throw new ForbiddenException(LOCKED);
      }
    }
  }

  private async upsert(
    db: Executor,
    userId: string,
    data: SheetData,
    onConflict: SQL
  ): Promise<SheetResponse> {
    const [row] = await db
      .insert(sheets)
      .values({ data, userId })
      .onConflictDoUpdate({
        set: { data: onConflict, updatedAt: sql`now()` },
        target: sheets.userId,
      })
      .returning(columns);
    return row;
  }
}
