import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
} from "@nestjs/common";
import bcrypt from "bcryptjs";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Database } from "../db/db.module.js";
import type { User } from "../db/schema.js";
import { UsersService } from "./users.service.js";

function makeUser(overrides: Partial<User> = {}): User {
  const now = new Date();
  return {
    createdAt: now,
    email: "ana@exemplo.com",
    id: "user-1",
    name: "Ana",
    passwordHash: bcrypt.hashSync("segredo", 4),
    role: "player",
    updatedAt: now,
    username: "ana",
    ...overrides,
  };
}

describe("UsersService.updateAccount", () => {
  const set = vi.fn();
  const returning = vi.fn();
  const db = {
    update: vi.fn(() => ({
      set: (values: unknown) => {
        set(values);
        return { where: () => ({ returning }) };
      },
    })),
  };
  const service = new UsersService(db as unknown as Database);
  const self = { requireCurrentPassword: true };
  const asDm = { requireCurrentPassword: false };
  let target: User;

  beforeEach(() => {
    vi.clearAllMocks();
    target = makeUser();
    vi.spyOn(service, "findByEmail").mockResolvedValue(undefined);
    vi.spyOn(service, "findByUsername").mockResolvedValue(undefined);
    returning.mockImplementation(async () => [
      { ...target, ...set.mock.calls[0][0] },
    ]);
  });

  it("muda o nome sem pedir a senha", async () => {
    const user = await service.updateAccount(target, { name: "Ana S" }, self);
    expect(user.name).toBe("Ana S");
    expect(set.mock.calls[0][0]).toMatchObject({ name: "Ana S" });
  });

  it("muda o nome de usuário sem pedir a senha", async () => {
    const user = await service.updateAccount(
      target,
      { username: "ana_s" },
      self
    );
    expect(user.username).toBe("ana_s");
  });

  it("não grava nada se os campos são os atuais", async () => {
    const user = await service.updateAccount(
      target,
      { email: "ana@exemplo.com", name: "Ana", username: "ana" },
      self
    );
    expect(user).toBe(target);
    expect(db.update).not.toHaveBeenCalled();
    expect(service.findByUsername).not.toHaveBeenCalled();
  });

  it.each([
    ["de outra conta", "bia"],
    ["do Mestre", "mestre"],
  ])("recusa nome de usuário %s", async (_caso, username) => {
    vi.mocked(service.findByUsername).mockResolvedValue(
      username === "bia" ? makeUser({ id: "user-2", username }) : undefined
    );
    await expect(
      service.updateAccount(target, { username }, self)
    ).rejects.toThrow(new ConflictException("Nome de usuário já em uso."));
    expect(db.update).not.toHaveBeenCalled();
  });

  it("recusa e-mail de outra conta", async () => {
    vi.mocked(service.findByEmail).mockResolvedValue(
      makeUser({ id: "user-2" })
    );
    await expect(
      service.updateAccount(
        target,
        { currentPassword: "segredo", email: "bia@exemplo.com" },
        self
      )
    ).rejects.toThrow(
      new ConflictException("E-mail já em uso por outra conta.")
    );
  });

  it("muda o e-mail com a senha atual", async () => {
    const user = await service.updateAccount(
      target,
      { currentPassword: "segredo", email: "novo@exemplo.com" },
      self
    );
    expect(user.email).toBe("novo@exemplo.com");
  });

  it("troca a senha guardando só o hash", async () => {
    await service.updateAccount(
      target,
      { currentPassword: "segredo", password: "nova123" },
      self
    );
    const { passwordHash } = set.mock.calls[0][0];
    expect(await bcrypt.compare("nova123", passwordHash)).toBe(true);
  });

  it.each([
    ["e-mail", { email: "novo@exemplo.com" }],
    ["senha", { password: "nova123" }],
  ])("exige a senha atual para mudar %s", async (_caso, input) => {
    await expect(service.updateAccount(target, input, self)).rejects.toThrow(
      new BadRequestException("Informe a senha atual.")
    );
    await expect(
      service.updateAccount(
        target,
        { ...input, currentPassword: "errada" },
        self
      )
    ).rejects.toThrow(new ForbiddenException("Senha atual incorreta."));
    expect(db.update).not.toHaveBeenCalled();
  });

  it("o Mestre muda e-mail e senha do jogador sem a senha atual", async () => {
    const user = await service.updateAccount(
      target,
      { email: "novo@exemplo.com", password: "mesa123" },
      asDm
    );
    expect(user.email).toBe("novo@exemplo.com");
    const { passwordHash } = set.mock.calls[0][0];
    expect(await bcrypt.compare("mesa123", passwordHash)).toBe(true);
  });

  it("do Mestre, só o nome muda", async () => {
    target = makeUser({ role: "dm", username: "mestre" });
    const user = await service.updateAccount(
      target,
      { name: "Narrador" },
      self
    );
    expect(user.name).toBe("Narrador");
    await Promise.all(
      [
        { username: "narrador" },
        { email: "outro@exemplo.com" },
        { currentPassword: "segredo", password: "outra123" },
      ].map((input) =>
        expect(service.updateAccount(target, input, self)).rejects.toThrow(
          new ForbiddenException(
            "E-mail, usuário e senha do Mestre são definidos no servidor."
          )
        )
      )
    );
  });

  it.each([
    ["users_username_unique", "Nome de usuário já em uso."],
    ["users_email_unique", "E-mail já em uso por outra conta."],
  ])("traduz a violação de %s na corrida", async (constraint, message) => {
    returning.mockRejectedValue(
      new Error("Failed query", { cause: { code: "23505", constraint } })
    );
    await expect(
      service.updateAccount(target, { username: "ana_s" }, self)
    ).rejects.toThrow(message);
  });
});
