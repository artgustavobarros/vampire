import { Inject, Injectable } from "@nestjs/common";
import { and, eq, ne, sql } from "drizzle-orm";
import { type Database, DRIZZLE } from "../db/db.module.js";
import { type User, users } from "../db/schema.js";
import type { PublicUser } from "./users.schemas.js";

/** Nome de usuário da conta do Mestre, reservado no cadastro. */
export const DM_USERNAME = "mestre";
/** trava de `upsertDm`, só entre subidas da API */
const DM_LOCK = 7_410_001;

export function toPublicUser({
  email,
  id,
  name,
  role,
  username,
}: User): PublicUser {
  return { email, id, name, role, username };
}

@Injectable()
export class UsersService {
  constructor(@Inject(DRIZZLE) private readonly db: Database) {}

  async findById(id: string): Promise<User | undefined> {
    const [user] = await this.db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email));
    return user;
  }

  async findByUsername(username: string): Promise<User | undefined> {
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.username, username));
    return user;
  }

  /** Só contas `player`: o Mestre não tem ficha. */
  async findPlayerById(id: string): Promise<User | undefined> {
    const [user] = await this.db
      .select()
      .from(users)
      .where(and(eq(users.id, id), eq(users.role, "player")));
    return user;
  }

  /** Lança o erro `23505` do Postgres se o e-mail ou o usuário já existir. */
  async create(input: {
    email: string;
    name: string;
    passwordHash: string;
    username: string;
  }): Promise<User> {
    const [user] = await this.db.insert(users).values(input).returning();
    return user;
  }

  /**
   * Cria o Mestre com o usuário `mestre`; se o e-mail já existir, promove a
   * `dm`, dá o `mestre` e troca a senha. Outra conta que tinha o `mestre` (o
   * Mestre de um `ADMIN_EMAIL` anterior) passa a `mestre_<início do id>`.
   */
  async upsertDm(input: {
    email: string;
    name: string;
    passwordHash: string;
  }): Promise<void> {
    await this.db.transaction(async (tx) => {
      // duas subidas ao mesmo tempo: o `on conflict` só cobre o e-mail
      await tx.execute(sql`select pg_advisory_xact_lock(${DM_LOCK})`);
      await tx
        .update(users)
        .set({
          updatedAt: new Date(),
          username: sql`${DM_USERNAME} || '_' || left(${users.id}::text, 8)`,
        })
        .where(
          and(eq(users.username, DM_USERNAME), ne(users.email, input.email))
        );
      await tx
        .insert(users)
        .values({ ...input, role: "dm", username: DM_USERNAME })
        .onConflictDoUpdate({
          set: {
            passwordHash: input.passwordHash,
            role: "dm",
            updatedAt: new Date(),
            username: DM_USERNAME,
          },
          target: users.email,
        });
    });
  }
}
