import {
  type CanActivate,
  type ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import type { Request } from "express";
import { IS_PUBLIC } from "../common/public.decorator.js";
import type { User } from "../db/schema.js";
import { UsersService } from "../users/users.service.js";
import type { JwtPayload } from "./auth.service.js";

const EXPIRED = "Sessão expirada. Entre novamente.";

/** Global: toda rota exige `Authorization: Bearer <token>`, exceto `@Public()`. */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwt: JwtService,
    private readonly users: UsersService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: User }>();
    const [scheme, token] = request.headers.authorization?.split(" ") ?? [];
    if (scheme !== "Bearer" || !token) {
      throw new UnauthorizedException("Entre para continuar.");
    }
    let payload: JwtPayload;
    try {
      payload = await this.jwt.verifyAsync<JwtPayload>(token);
    } catch (error) {
      throw new UnauthorizedException(EXPIRED, { cause: error });
    }
    const user = await this.users.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException(EXPIRED);
    }
    request.user = user;
    return true;
  }
}
