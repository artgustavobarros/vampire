import { Inject, Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { type Database, DRIZZLE } from "../db/db.module.js";
import { type User, users } from "../db/schema.js";
import type { PublicUser } from "./users.schemas.js";

export function toPublicUser({ email, id, name }: User): PublicUser {
  return { email, id, name };
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

  /** Lança o erro `23505` do Postgres se o e-mail já existir. */
  async create(input: {
    email: string;
    name: string;
    passwordHash: string;
  }): Promise<User> {
    const [user] = await this.db.insert(users).values(input).returning();
    return user;
  }
}
