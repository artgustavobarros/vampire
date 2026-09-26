import { Controller, Get, HttpStatus, Inject, Res } from "@nestjs/common";
import { sql } from "drizzle-orm";
import type { Response } from "express";
import { Public } from "../common/public.decorator.js";
import { type Database, DRIZZLE } from "../db/db.module.js";

@Controller("health")
export class HealthController {
  constructor(@Inject(DRIZZLE) private readonly db: Database) {}

  @Public()
  @Get()
  async check(@Res({ passthrough: true }) res: Response) {
    try {
      await this.db.execute(sql`select 1`);
      return { db: "up", status: "ok" };
    } catch {
      res.status(HttpStatus.SERVICE_UNAVAILABLE);
      return { db: "down", status: "error" };
    }
  }
}
