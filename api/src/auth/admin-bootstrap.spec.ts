import type { ConfigService } from "@nestjs/config";
import bcrypt from "bcryptjs";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Env } from "../config/env.js";
import type { UsersService } from "../users/users.service.js";
import { AdminBootstrap } from "./admin-bootstrap.js";

describe("AdminBootstrap", () => {
  const users = { upsertDm: vi.fn() };

  function bootstrap(env: Partial<Env>): AdminBootstrap {
    const config = { get: (key: keyof Env) => env[key] };
    return new AdminBootstrap(
      users as unknown as UsersService,
      config as unknown as ConfigService<Env, true>
    );
  }

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("garante o Mestre com o hash da senha", async () => {
    await bootstrap({
      ADMIN_EMAIL: "mestre@exemplo.com",
      ADMIN_PASSWORD: "senha-do-mestre",
    }).onApplicationBootstrap();

    expect(users.upsertDm).toHaveBeenCalledOnce();
    const { email, name, passwordHash } = users.upsertDm.mock.calls[0][0];
    expect({ email, name }).toEqual({
      email: "mestre@exemplo.com",
      name: "Mestre",
    });
    expect(passwordHash).not.toBe("senha-do-mestre");
    expect(await bcrypt.compare("senha-do-mestre", passwordHash)).toBe(true);
  });

  it("não cria conta sem as variáveis", async () => {
    await bootstrap({}).onApplicationBootstrap();

    expect(users.upsertDm).not.toHaveBeenCalled();
  });
});
