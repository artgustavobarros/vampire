import { ConflictException, UnauthorizedException } from "@nestjs/common";
import type { JwtService } from "@nestjs/jwt";
import bcrypt from "bcryptjs";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { User } from "../db/schema.js";
import type { UsersService } from "../users/users.service.js";
import { AuthService } from "./auth.service.js";

function makeUser(overrides: Partial<User> = {}): User {
  const now = new Date();
  return {
    createdAt: now,
    email: "vitoria@exemplo.com",
    id: "user-1",
    name: "Vitória",
    passwordHash: bcrypt.hashSync("segredo", 4),
    role: "player",
    updatedAt: now,
    ...overrides,
  };
}

describe("AuthService", () => {
  const users = {
    create: vi.fn(),
    findByEmail: vi.fn(),
  };
  const jwt = { signAsync: vi.fn().mockResolvedValue("token") };
  const service = new AuthService(
    users as unknown as UsersService,
    jwt as unknown as JwtService
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("signup", () => {
    it("grava só o hash da senha e devolve token e jogador", async () => {
      users.findByEmail.mockResolvedValue(undefined);
      users.create.mockImplementation((input) => makeUser(input));

      const result = await service.signup({
        email: "vitoria@exemplo.com",
        name: "Vitória",
        password: "segredo",
      });

      const { passwordHash } = users.create.mock.calls[0][0];
      expect(passwordHash).not.toBe("segredo");
      expect(await bcrypt.compare("segredo", passwordHash)).toBe(true);
      expect(jwt.signAsync).toHaveBeenCalledWith({
        email: "vitoria@exemplo.com",
        sub: "user-1",
      });
      expect(result).toEqual({
        accessToken: "token",
        user: {
          email: "vitoria@exemplo.com",
          id: "user-1",
          name: "Vitória",
          role: "player",
        },
      });
    });

    it("recusa e-mail já cadastrado", async () => {
      users.findByEmail.mockResolvedValue(makeUser());
      await expect(
        service.signup({
          email: "vitoria@exemplo.com",
          name: "V",
          password: "segredo",
        })
      ).rejects.toThrow(
        new ConflictException('E-mail já cadastrado. Use "Entrar".')
      );
      expect(users.create).not.toHaveBeenCalled();
    });

    it("traduz a violação de unicidade de um cadastro simultâneo", async () => {
      users.findByEmail.mockResolvedValue(undefined);
      users.create.mockRejectedValue(
        new Error("Failed query", { cause: { code: "23505" } })
      );
      await expect(
        service.signup({
          email: "vitoria@exemplo.com",
          name: "V",
          password: "segredo",
        })
      ).rejects.toBeInstanceOf(ConflictException);
    });
  });

  describe("login", () => {
    it("entra com a senha certa", async () => {
      users.findByEmail.mockResolvedValue(makeUser());
      const result = await service.login({
        email: "vitoria@exemplo.com",
        password: "segredo",
      });
      expect(result.accessToken).toBe("token");
    });

    it.each([
      ["senha errada", makeUser()],
      ["e-mail desconhecido", undefined],
    ])("responde igual para %s", async (_caso, user) => {
      users.findByEmail.mockResolvedValue(user);
      await expect(
        service.login({ email: "vitoria@exemplo.com", password: "errada" })
      ).rejects.toThrow(
        new UnauthorizedException("E-mail ou senha incorretos.")
      );
      expect(jwt.signAsync).not.toHaveBeenCalled();
    });
  });
});
