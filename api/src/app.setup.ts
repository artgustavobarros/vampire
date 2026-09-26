import {
  BadRequestException,
  StandardSchemaValidationPipe,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  ExpressAdapter,
  type NestExpressApplication,
} from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
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
  setupSwagger(app);
}

/**
 * Swagger UI em `/api/docs` e o OpenAPI em `/api/docs-json`. Montados direto
 * no Express, ficam fora do `JwtAuthGuard`.
 */
function setupSwagger(app: NestExpressApplication): void {
  const config = new DocumentBuilder()
    .setTitle("Vampiro: A Máscara — API")
    .setDescription(
      "Contas com JWT e a ficha de cada jogador. Entre por `/auth/login`, " +
        'copie o `accessToken` e use em "Authorize".'
    )
    .setVersion("0.1.0")
    .addBearerAuth()
    .build();
  SwaggerModule.setup(
    "docs",
    app,
    () => SwaggerModule.createDocument(app, config),
    {
      jsonDocumentUrl: "docs-json",
      swaggerOptions: { persistAuthorization: true },
      useGlobalPrefix: true,
    }
  );
}
