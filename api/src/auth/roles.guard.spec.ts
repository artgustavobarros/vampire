import { type ExecutionContext, ForbiddenException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { describe, expect, it } from "vitest";
import { ROLES } from "../common/roles.decorator.js";
import type { Role } from "../db/schema.js";
import { RolesGuard } from "./roles.guard.js";

function contextFor(role: Role | null, roles?: Role[]): ExecutionContext {
  const handler = () => undefined;
  if (roles) {
    Reflect.defineMetadata(ROLES, roles, handler);
  }
  return {
    getClass: () => class {},
    getHandler: () => handler,
    switchToHttp: () => ({
      getRequest: () => ({ user: role ? { role } : undefined }),
    }),
  } as unknown as ExecutionContext;
}

describe("RolesGuard", () => {
  const guard = new RolesGuard(new Reflector());

  it("libera rota sem @Roles", () => {
    expect(guard.canActivate(contextFor("player"))).toBe(true);
  });

  it("libera o Mestre numa rota do Mestre", () => {
    expect(guard.canActivate(contextFor("dm", ["dm"]))).toBe(true);
  });

  it("recusa o jogador numa rota do Mestre", () => {
    expect(() => guard.canActivate(contextFor("player", ["dm"]))).toThrow(
      new ForbiddenException("Apenas o Mestre pode fazer isso.")
    );
  });

  it("recusa sem usuário", () => {
    expect(() => guard.canActivate(contextFor(null, ["dm"]))).toThrow(
      ForbiddenException
    );
  });
});
