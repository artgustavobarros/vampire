import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
} from "@nestjs/common";
import bcrypt from "bcryptjs";
import { and, eq, ne, or, sql } from "drizzle-orm";
import { uniqueViolationConstraint } from "../common/pg-errors.js";
import { type Database, DRIZZLE } from "../db/db.module.js";
import { type User, users } from "../db/schema.js";
import type { PublicUser, UpdateAccountDto } from "./users.schemas.js";

export const BCRYPT_COST = 10;
/** Nome de usuário da conta do Mestre, reservado no cadastro. */
export const DM_USERNAME = "mestre";
export const USERNAME_TAKEN = "Nome de usuário já em uso.";
const EMAIL_IN_USE = "E-mail já em uso por outra conta.";
const DM_ACCOUNT =
  "E-mail, usuário e senha do Mestre são definidos no servidor.";
/** trava de `upsertDm`, só entre subidas da API */
const DM_LOCK = 7_410_001;

type AccountChanges = Partial<
  Pick<User, "email" | "name" | "passwordHash" | "username">
>;

/** Nome, usuário e e-mail enviados que diferem dos atuais. */
function changedFields(
  target: User,
  { email, name, username }: UpdateAccountDto
): AccountChanges {
  const changes: AccountChanges = {};
  if (name !== undefined && name !== target.name) {
    changes.name = name;
  }
  if (username !== undefined && username !== target.username) {
    changes.username = username;
  }
  if (email !== undefined && email !== target.email) {
    changes.email = email;
  }
  return changes;
}

async function checkCurrentPassword(
  target: User,
  currentPassword: string | undefined
): Promise<void> {
  if (!currentPassword) {
    throw new BadRequestException("Informe a senha atual.");
  }
  if (!(await bcrypt.compare(currentPassword, target.passwordHash))) {
    throw new ForbiddenException("Senha atual incorreta.");
  }
}

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

  /**
   * O primeiro de `base`, `base2`, `base3`… que ninguém usa, nunca `mestre`.
   * `base` vem de `slugUsername`: só `a-z`, `0-9` e `_`, sem nada de regex.
   */
  async freeUsername(base: string): Promise<string> {
    const rows = await this.db
      .select({ username: users.username })
      .from(users)
      .where(
        or(
          eq(users.username, base),
          sql`${users.username} ~ ${`^${base}[0-9]+$`}`
        )
      );
    const taken = new Set([DM_USERNAME, ...rows.map((row) => row.username)]);
    let candidate = base;
    for (let n = 2; taken.has(candidate); n += 1) {
      candidate = `${base}${n}`;
    }
    return candidate;
  }

  /**
   * Muda os campos enviados que diferem dos atuais. Com
   * `requireCurrentPassword` (a própria conta), mudar e-mail ou senha exige
   * `currentPassword`; o Mestre edita jogadores sem ela. Do Mestre, só o nome
   * muda: o resto vem de `ADMIN_EMAIL`/`ADMIN_PASSWORD` a cada subida.
   */
  async updateAccount(
    target: User,
    input: UpdateAccountDto,
    { requireCurrentPassword }: { requireCurrentPassword: boolean }
  ): Promise<User> {
    const { currentPassword, email, password, username } = input;
    if (
      target.role === "dm" &&
      (email !== undefined || password !== undefined || username !== undefined)
    ) {
      throw new ForbiddenException(DM_ACCOUNT);
    }
    const changes = changedFields(target, input);
    if (requireCurrentPassword && (changes.email || password !== undefined)) {
      await checkCurrentPassword(target, currentPassword);
    }
    await this.checkTaken(changes);
    if (password !== undefined) {
      changes.passwordHash = await bcrypt.hash(password, BCRYPT_COST);
    }
    if (Object.keys(changes).length === 0) {
      return target;
    }
    try {
      const [user] = await this.db
        .update(users)
        .set({ ...changes, updatedAt: new Date() })
        .where(eq(users.id, target.id))
        .returning();
      return user;
    } catch (error) {
      // outra conta pegou o e-mail ou o usuário entre a checagem e a gravação
      const constraint = uniqueViolationConstraint(error);
      if (constraint !== null) {
        throw new ConflictException(
          constraint === "users_username_unique"
            ? USERNAME_TAKEN
            : EMAIL_IN_USE,
          { cause: error }
        );
      }
      throw error;
    }
  }

  /** Nome de usuário e e-mail novos (diferentes dos atuais) de outra conta. */
  private async checkTaken({ email, username }: AccountChanges): Promise<void> {
    if (
      username &&
      (username === DM_USERNAME || (await this.findByUsername(username)))
    ) {
      throw new ConflictException(USERNAME_TAKEN);
    }
    if (email && (await this.findByEmail(email))) {
      throw new ConflictException(EMAIL_IN_USE);
    }
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
