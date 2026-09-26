import { Inject, Injectable } from "@nestjs/common";
import { eq, type SQL, sql } from "drizzle-orm";
import { type Database, DRIZZLE } from "../db/db.module.js";
import { sheets } from "../db/schema.js";
import type { SheetData } from "./sheets.schemas.js";

export interface SheetResponse {
  sheet: SheetData | null;
  updatedAt: Date | null;
}

const columns = { sheet: sheets.data, updatedAt: sheets.updatedAt };

@Injectable()
export class SheetsService {
  constructor(@Inject(DRIZZLE) private readonly db: Database) {}

  async get(userId: string): Promise<SheetResponse> {
    const [row] = await this.db
      .select(columns)
      .from(sheets)
      .where(eq(sheets.userId, userId));
    return row ?? { sheet: null, updatedAt: null };
  }

  /** Cria ou substitui a ficha inteira. */
  replace(userId: string, sheet: SheetData): Promise<SheetResponse> {
    return this.upsert(userId, sheet, sql`excluded.data`);
  }

  /**
   * Mescla rasa, como o `patch` do web: `jsonb || jsonb` troca só as chaves
   * enviadas. Um único comando, então patches seguidos não se sobrescrevem.
   */
  merge(userId: string, patch: SheetData): Promise<SheetResponse> {
    return this.upsert(userId, patch, sql`${sheets.data} || excluded.data`);
  }

  private async upsert(
    userId: string,
    data: SheetData,
    onConflict: SQL
  ): Promise<SheetResponse> {
    const [row] = await this.db
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
