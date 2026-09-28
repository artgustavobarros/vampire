import {
  type CanActivate,
  type ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import type { Request } from "express";
import { ROLES } from "../common/roles.decorator.js";
import type { Role, User } from "../db/schema.js";

/**
 * Global, depois do `JwtAuthGuard`: rotas com `@Roles(...)` exigem um desses
 * papéis. O papel vem do usuário lido do banco, não do token.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<Role[] | undefined>(ROLES, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!roles?.length) {
      return true;
    }
    const { user } = context
      .switchToHttp()
      .getRequest<Request & { user?: User }>();
    if (!(user && roles.includes(user.role))) {
      throw new ForbiddenException("Apenas o Mestre pode fazer isso.");
    }
    return true;
  }
}
