import { Controller, Get, HttpStatus, Inject, Res } from "@nestjs/common";
import {
  ApiOkResponse,
  ApiOperation,
  ApiServiceUnavailableResponse,
  ApiTags,
} from "@nestjs/swagger";
import { sql } from "drizzle-orm";
import type { Response } from "express";
import { Public } from "../common/public.decorator.js";
import { type Database, DRIZZLE } from "../db/db.module.js";
import { type Health, healthSchema } from "./health.schemas.js";

@ApiTags("health")
@Controller("health")
export class HealthController {
  constructor(@Inject(DRIZZLE) private readonly db: Database) {}

  @Public()
  @Get()
  @ApiOperation({ summary: "Saúde da API e do banco" })
  @ApiOkResponse({ standardSchema: healthSchema })
  @ApiServiceUnavailableResponse({
    description: "Banco fora do ar",
    standardSchema: healthSchema,
  })
  async check(@Res({ passthrough: true }) res: Response): Promise<Health> {
    try {
      await this.db.execute(sql`select 1`);
      return { db: "up", status: "ok" };
    } catch {
      res.status(HttpStatus.SERVICE_UNAVAILABLE);
      return { db: "down", status: "error" };
    }
  }
}
