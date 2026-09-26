import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module.js";
import { envSchema } from "./config/env.js";
import { DbModule } from "./db/db.module.js";
import { HealthModule } from "./health/health.module.js";
import { SheetsModule } from "./sheets/sheets.module.js";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validationSchema: envSchema }),
    DbModule,
    HealthModule,
    AuthModule,
    SheetsModule,
  ],
})
export class AppModule {}
