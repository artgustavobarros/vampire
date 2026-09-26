import "reflect-metadata";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import type { NestExpressApplication } from "@nestjs/platform-express";
import { AppModule } from "./app.module.js";
import { ApiExpressAdapter, configureApp } from "./app.setup.js";
import type { Env } from "./config/env.js";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ApiExpressAdapter(),
    { bodyParser: false }
  );
  configureApp(app);
  const port = app.get<ConfigService<Env, true>>(ConfigService).get("PORT");
  await app.listen(port);
}

await bootstrap();
