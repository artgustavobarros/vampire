import {
  Injectable,
  Logger,
  type OnApplicationBootstrap,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import bcrypt from "bcryptjs";
import type { Env } from "../config/env.js";
import { UsersService } from "../users/users.service.js";
import { BCRYPT_COST } from "./auth.service.js";

/**
 * Garante a conta do Mestre a partir de `ADMIN_EMAIL` e `ADMIN_PASSWORD` a cada
 * subida: a senha fica fora do repositório e trocar a variável troca a senha.
 */
@Injectable()
export class AdminBootstrap implements OnApplicationBootstrap {
  private readonly logger = new Logger(AdminBootstrap.name);

  constructor(
    private readonly users: UsersService,
    private readonly config: ConfigService<Env, true>
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    const email = this.config.get("ADMIN_EMAIL", { infer: true });
    const password = this.config.get("ADMIN_PASSWORD", { infer: true });
    if (!(email && password)) {
      return;
    }
    await this.users.upsertDm({
      email,
      name: "Mestre",
      passwordHash: await bcrypt.hash(password, BCRYPT_COST),
    });
    this.logger.log(`Conta do Mestre garantida: ${email}`);
  }
}
