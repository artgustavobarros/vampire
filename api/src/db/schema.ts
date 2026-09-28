import { sql } from "drizzle-orm";
import {
  check,
  jsonb,
  pgEnum,
  pgTable,
  smallint,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
};

/** `player` é todo cadastro; `dm` (Mestre) só vem de `ADMIN_EMAIL`/`ADMIN_PASSWORD`. */
export const roleEnum = pgEnum("user_role", ["player", "dm"]);

export const users = pgTable("users", {
  /** sempre normalizado: sem espaços nas pontas e em minúsculas */
  email: text("email").notNull().unique(),
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  passwordHash: text("password_hash").notNull(),
  role: roleEnum("role").notNull().default("player"),
  ...timestamps,
});

/** Uma ficha por jogador, no formato `Sheet` do web, guardada como veio. */
export const sheets = pgTable("sheets", {
  data: jsonb("data").$type<Record<string, unknown>>().notNull(),
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: "cascade" }),
  ...timestamps,
});

/** Coteries da crônica, montadas pelo Mestre. */
export const coteries = pgTable("coteries", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().default(""),
  ...timestamps,
});

/** Filiação: `user_id` como chave garante uma coterie por jogador. */
export const coterieMembers = pgTable("coterie_members", {
  coterieId: uuid("coterie_id")
    .notNull()
    .references(() => coteries.id, { onDelete: "cascade" }),
  createdAt: timestamps.createdAt,
  userId: uuid("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
});

/** Inimigos do Bestiário, no formato `Enemy` de `chronicle.schemas.ts`. */
export const enemies = pgTable("enemies", {
  data: jsonb("data").$type<Record<string, unknown>>().notNull(),
  id: uuid("id").primaryKey().defaultRandom(),
  ...timestamps,
});

/** A rodada da crônica: uma linha só (`id = 1`), criada pela migração. */
export const rounds = pgTable(
  "rounds",
  {
    data: jsonb("data").$type<Record<string, unknown>>().notNull(),
    id: smallint("id").primaryKey(),
    updatedAt: timestamps.updatedAt,
  },
  (t) => [check("rounds_single_row", sql`${t.id} = 1`)]
);

export type User = typeof users.$inferSelect;
export type Role = User["role"];
