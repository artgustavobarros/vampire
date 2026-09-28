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
    username: "vitoria",
    ...overrides,
  };
}

describe("AuthService", () => {
  const users = {
    create: vi.fn(),
    findByEmail: vi.fn(),
    findByUsername: vi.fn(),
    freeUsername: vi.fn(),
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
    const dto = {
      email: "vitoria@exemplo.com",
      name: "V",
      password: "segredo",
      username: "vitoria",
    };

    it("grava só o hash da senha e devolve token e jogador", async () => {
      users.findByEmail.mockResolvedValue(undefined);
      users.findByUsername.mockResolvedValue(undefined);
      users.create.mockImplementation((input) => makeUser(input));

      const result = await service.signup({
        email: "vitoria@exemplo.com",
        name: "Vitória",
        password: "segredo",
        username: "vitoria",
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
          username: "vitoria",
        },
      });
    });

    it("recusa e-mail já cadastrado", async () => {
      users.findByEmail.mockResolvedValue(makeUser());
      await expect(service.signup(dto)).rejects.toThrow(
        new ConflictException('E-mail já cadastrado. Use "Entrar".')
      );
      expect(users.create).not.toHaveBeenCalled();
    });

    it("recusa nome de usuário já em uso", async () => {
      users.findByEmail.mockResolvedValue(undefined);
      users.findByUsername.mockResolvedValue(makeUser());
      await expect(service.signup(dto)).rejects.toThrow(
        new ConflictException("Nome de usuário já em uso.")
      );
      expect(users.create).not.toHaveBeenCalled();
    });

    it("recusa o nome de usuário do Mestre", async () => {
      users.findByEmail.mockResolvedValue(undefined);
      users.findByUsername.mockResolvedValue(undefined);
      await expect(
        service.signup({ ...dto, username: "mestre" })
      ).rejects.toThrow(new ConflictException("Nome de usuário já em uso."));
      expect(users.create).not.toHaveBeenCalled();
    });

    describe("sem nome de usuário", () => {
      const { username: _, ...semUsuario } = dto;
      const unique = (constraint: string) =>
        new Error("Failed query", { cause: { code: "23505", constraint } });

      beforeEach(() => {
        users.findByEmail.mockResolvedValue(undefined);
        users.create.mockImplementation((input) => makeUser(input));
      });

      it("gera um livre a partir do nome", async () => {
        users.freeUsername.mockResolvedValue("vitoria_salles2");
        const result = await service.signup({
          ...semUsuario,
          name: "Vitória Salles",
        });
        expect(users.freeUsername).toHaveBeenCalledWith("vitoria_salles");
        expect(users.findByUsername).not.toHaveBeenCalled();
        expect(users.create.mock.calls[0][0].username).toBe("vitoria_salles2");
        expect(result.user.username).toBe("vitoria_salles2");
      });

      it("tenta de novo se outro cadastro pegar o nome gerado", async () => {
        users.freeUsername
          .mockResolvedValueOnce("v__")
          .mockResolvedValueOnce("v__2");
        users.create.mockRejectedValueOnce(unique("users_username_unique"));
        const result = await service.signup(semUsuario);
        expect(users.create).toHaveBeenCalledTimes(2);
        expect(result.user.username).toBe("v__2");
      });

      it("desiste depois de algumas tentativas", async () => {
        users.freeUsername.mockResolvedValue("v__");
        users.create.mockRejectedValue(unique("users_username_unique"));
        await expect(service.signup(semUsuario)).rejects.toThrow(
          "Nome de usuário já em uso."
        );
        expect(users.create).toHaveBeenCalledTimes(3);
      });

      it("não tenta de novo quando o e-mail é que colidiu", async () => {
        users.freeUsername.mockResolvedValue("v__");
        users.create.mockRejectedValue(unique("users_email_unique"));
        await expect(service.signup(semUsuario)).rejects.toThrow(
          'E-mail já cadastrado. Use "Entrar".'
        );
        expect(users.create).toHaveBeenCalledTimes(1);
      });
    });

    it("não tenta de novo com o nome de usuário informado", async () => {
      users.findByEmail.mockResolvedValue(undefined);
      users.findByUsername.mockResolvedValue(undefined);
      users.create.mockRejectedValue(
        new Error("Failed query", {
          cause: { code: "23505", constraint: "users_username_unique" },
        })
      );
      await expect(service.signup(dto)).rejects.toThrow(
        "Nome de usuário já em uso."
      );
      expect(users.create).toHaveBeenCalledTimes(1);
      expect(users.freeUsername).not.toHaveBeenCalled();
    });

    it.each([
      ["users_email_unique", 'E-mail já cadastrado. Use "Entrar".'],
      ["users_username_unique", "Nome de usuário já em uso."],
    ])(
      "traduz a violação de %s de um cadastro simultâneo",
      async (constraint, message) => {
        users.findByEmail.mockResolvedValue(undefined);
        users.findByUsername.mockResolvedValue(undefined);
        users.create.mockRejectedValue(
          new Error("Failed query", { cause: { code: "23505", constraint } })
        );
        const error = await service.signup(dto).catch((e: unknown) => e);
        expect(error).toBeInstanceOf(ConflictException);
        expect((error as ConflictException).message).toBe(message);
      }
    );
  });

  describe("login", () => {
    it("entra pelo e-mail com a senha certa", async () => {
      users.findByEmail.mockResolvedValue(makeUser());
      const result = await service.login({
        identifier: "vitoria@exemplo.com",
        password: "segredo",
      });
      expect(result.accessToken).toBe("token");
      expect(users.findByEmail).toHaveBeenCalledWith("vitoria@exemplo.com");
      expect(users.findByUsername).not.toHaveBeenCalled();
    });

    it("entra pelo nome de usuário com a senha certa", async () => {
      users.findByUsername.mockResolvedValue(makeUser());
      const result = await service.login({
        identifier: "vitoria",
        password: "segredo",
      });
      expect(result.user.username).toBe("vitoria");
      expect(users.findByUsername).toHaveBeenCalledWith("vitoria");
      expect(users.findByEmail).not.toHaveBeenCalled();
    });

    it.each([
      ["senha errada", "vitoria@exemplo.com", makeUser()],
      ["e-mail desconhecido", "vitoria@exemplo.com", undefined],
      ["usuário desconhecido", "vitoria", undefined],
    ])("responde igual para %s", async (_caso, identifier, user) => {
      users.findByEmail.mockResolvedValue(user);
      users.findByUsername.mockResolvedValue(user);
      await expect(
        service.login({ identifier, password: "errada" })
      ).rejects.toThrow(
        new UnauthorizedException("E-mail, usuário ou senha incorretos.")
      );
      expect(jwt.signAsync).not.toHaveBeenCalled();
    });
  });
});
