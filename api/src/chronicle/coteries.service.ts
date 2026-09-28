import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { and, asc, eq, sql } from "drizzle-orm";
import { isUniqueViolation } from "../common/pg-errors.js";
import { type Database, DRIZZLE } from "../db/db.module.js";
import { coterieMembers, coteries, sheets, users } from "../db/schema.js";
import { toPublicUser, UsersService } from "../users/users.service.js";
import type { Coterie, MyCoterie } from "./chronicle.schemas.js";
import { projectSheet } from "./sheet-projection.js";

const NOT_FOUND = "Coterie não encontrada.";
const TAKEN = "Este jogador já está em outra coterie.";

@Injectable()
export class CoteriesService {
  constructor(
    @Inject(DRIZZLE) private readonly db: Database,
    private readonly players: UsersService
  ) {}

  /** Coteries por ordem de criação; membros por ordem de entrada. */
  async list(): Promise<Coterie[]> {
    const rows = await this.db
      .select({ id: coteries.id, nome: coteries.name })
      .from(coteries)
      .orderBy(asc(coteries.createdAt), asc(coteries.id));
    const membros = await this.members();
    return rows.map((c) => ({ ...c, membros: membros.get(c.id) ?? [] }));
  }

  async create(nome = ""): Promise<Coterie> {
    const [row] = await this.db
      .insert(coteries)
      .values({ name: nome })
      .returning({ id: coteries.id, nome: coteries.name });
    return { ...row, membros: [] };
  }

  async rename(id: string, nome: string): Promise<Coterie> {
    const [row] = await this.db
      .update(coteries)
      .set({ name: nome, updatedAt: sql`now()` })
      .where(eq(coteries.id, id))
      .returning({ id: coteries.id });
    if (!row) {
      throw new NotFoundException(NOT_FOUND);
    }
    return this.get(id);
  }

  async remove(id: string): Promise<void> {
    const [row] = await this.db
      .delete(coteries)
      .where(eq(coteries.id, id))
      .returning({ id: coteries.id });
    if (!row) {
      throw new NotFoundException(NOT_FOUND);
    }
  }

  /** Coloca o jogador; já estar nesta mesma coterie não muda nada. */
  async addMember(id: string, userId: string): Promise<Coterie> {
    await this.get(id);
    const user = await this.players.findPlayerById(userId);
    if (!user) {
      throw new NotFoundException("Jogador não encontrado.");
    }
    const [sheet] = await this.db
      .select({ data: sheets.data })
      .from(sheets)
      .where(eq(sheets.userId, userId));
    if (sheet?.data.criada !== true) {
      throw new BadRequestException(
        "Este jogador ainda não criou o personagem."
      );
    }
    const [current] = await this.db
      .select({ coterieId: coterieMembers.coterieId })
      .from(coterieMembers)
      .where(eq(coterieMembers.userId, userId));
    if (current) {
      if (current.coterieId !== id) {
        throw new ConflictException(TAKEN);
      }
      return this.get(id);
    }
    try {
      await this.db.insert(coterieMembers).values({ coterieId: id, userId });
    } catch (error) {
      // outro pedido colocou o jogador entre a checagem e o insert
      if (isUniqueViolation(error)) {
        throw new ConflictException(TAKEN, { cause: error });
      }
      throw error;
    }
    return this.get(id);
  }

  /** Retira o jogador; quem não está na coterie não muda nada. */
  async removeMember(id: string, userId: string): Promise<Coterie> {
    await this.get(id);
    await this.db
      .delete(coterieMembers)
      .where(
        and(eq(coterieMembers.coterieId, id), eq(coterieMembers.userId, userId))
      );
    return this.get(id);
  }

  /** A coterie do usuário, com a ficha dos membros só na projeção. */
  async forUser(userId: string): Promise<MyCoterie> {
    const [own] = await this.db
      .select({ coterieId: coterieMembers.coterieId, nome: coteries.name })
      .from(coterieMembers)
      .innerJoin(coteries, eq(coteries.id, coterieMembers.coterieId))
      .where(eq(coterieMembers.userId, userId));
    if (!own) {
      return { coterie: null };
    }
    const rows = await this.db
      .select({ data: sheets.data, userId: coterieMembers.userId })
      .from(coterieMembers)
      .leftJoin(sheets, eq(sheets.userId, coterieMembers.userId))
      .where(eq(coterieMembers.coterieId, own.coterieId))
      .orderBy(asc(coterieMembers.createdAt), asc(coterieMembers.userId));
    return {
      coterie: {
        id: own.coterieId,
        membros: rows.map((r) => ({
          sheet: projectSheet(r.data),
          userId: r.userId,
        })),
        nome: own.nome,
      },
    };
  }

  private async get(id: string): Promise<Coterie> {
    const [row] = await this.db
      .select({ id: coteries.id, nome: coteries.name })
      .from(coteries)
      .where(eq(coteries.id, id));
    if (!row) {
      throw new NotFoundException(NOT_FOUND);
    }
    const membros = await this.members(id);
    return { ...row, membros: membros.get(id) ?? [] };
  }

  /** Membros agrupados por coterie, com a ficha inteira (visão do Mestre). */
  private async members(coterieId?: string) {
    const rows = await this.db
      .select({
        coterieId: coterieMembers.coterieId,
        sheet: sheets.data,
        updatedAt: sheets.updatedAt,
        user: users,
      })
      .from(coterieMembers)
      .innerJoin(users, eq(users.id, coterieMembers.userId))
      .leftJoin(sheets, eq(sheets.userId, coterieMembers.userId))
      .where(coterieId ? eq(coterieMembers.coterieId, coterieId) : undefined)
      .orderBy(asc(coterieMembers.createdAt), asc(coterieMembers.userId));
    const byCoterie = new Map<string, Coterie["membros"]>();
    for (const { coterieId: key, sheet, updatedAt, user } of rows) {
      const list = byCoterie.get(key) ?? [];
      list.push({
        sheet,
        updatedAt: updatedAt?.toISOString() ?? null,
        user: toPublicUser(user),
      });
      byCoterie.set(key, list);
    }
    return byCoterie;
  }
}
