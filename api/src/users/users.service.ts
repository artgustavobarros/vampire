import { Inject, Injectable } from "@nestjs/common";
import { and, eq } from "drizzle-orm";
import { type Database, DRIZZLE } from "../db/db.module.js";
import { type User, users } from "../db/schema.js";
import type { PublicUser } from "./users.schemas.js";

export function toPublicUser({ email, id, name, role }: User): PublicUser {
  return { email, id, name, role };
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

  /** Só contas `player`: o Mestre não tem ficha. */
  async findPlayerById(id: string): Promise<User | undefined> {
    const [user] = await this.db
      .select()
      .from(users)
      .where(and(eq(users.id, id), eq(users.role, "player")));
    return user;
  }

  /** Lança o erro `23505` do Postgres se o e-mail já existir. */
  async create(input: {
    email: string;
    name: string;
    passwordHash: string;
  }): Promise<User> {
    const [user] = await this.db.insert(users).values(input).returning();
    return user;
  }

  /** Cria o Mestre; se o e-mail já existir, promove a `dm` e troca a senha. */
  async upsertDm(input: {
    email: string;
    name: string;
    passwordHash: string;
  }): Promise<void> {
    await this.db
      .insert(users)
      .values({ ...input, role: "dm" })
      .onConflictDoUpdate({
        set: {
          passwordHash: input.passwordHash,
          role: "dm",
          updatedAt: new Date(),
        },
        target: users.email,
      });
  }
}
