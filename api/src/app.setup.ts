import {
  BadRequestException,
  StandardSchemaValidationPipe,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  ExpressAdapter,
  type NestExpressApplication,
} from "@nestjs/platform-express";
import { HttpExceptionFilter } from "./common/http-exception.filter.js";
import type { Env } from "./config/env.js";

/** O adapter padrão repassa a mensagem em inglês do `JSON.parse`. */
export class ApiExpressAdapter extends ExpressAdapter {
  override mapException(error: unknown): unknown {
    if (error instanceof SyntaxError) {
      return new BadRequestException("JSON inválido.", { cause: error });
    }
    return super.mapException(error);
  }
}

/** Prefixo, CORS, corpo, validação e erros. Usado pelo `main.ts` e pelos e2e. */
export function configureApp(app: NestExpressApplication): void {
  const config = app.get<ConfigService<Env, true>>(ConfigService);
  app.setGlobalPrefix("api");
  app.useBodyParser("json", { limit: "1mb" });
  app.enableCors({
    allowedHeaders: ["Authorization", "Content-Type"],
    origin: config
      .get("CORS_ORIGIN", { infer: true })
      .split(",")
      .map((origin) => origin.trim()),
  });
  app.useGlobalPipes(
    new StandardSchemaValidationPipe({
      // a primeira mensagem já vem em português, pronta para o toast do web
      exceptionFactory: (issues) =>
        new BadRequestException(issues[0]?.message ?? "Requisição inválida."),
    })
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableShutdownHooks();
}
