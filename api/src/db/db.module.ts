import {
  Global,
  Inject,
  Injectable,
  Logger,
  Module,
  type OnApplicationShutdown,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import type { Env } from "../config/env.js";
import {
  coterieMembers,
  coteries,
  enemies,
  rounds,
  sheets,
  users,
} from "./schema.js";

const schema = { coterieMembers, coteries, enemies, rounds, sheets, users };

export const DRIZZLE = Symbol("DRIZZLE");
const PG_POOL = Symbol("PG_POOL");

export type Database = NodePgDatabase<typeof schema>;

@Injectable()
class PoolCloser implements OnApplicationShutdown {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  async onApplicationShutdown(): Promise<void> {
    await this.pool.end();
  }
}

@Global()
@Module({
  exports: [DRIZZLE],
  providers: [
    {
      inject: [ConfigService],
      provide: PG_POOL,
      useFactory: (config: ConfigService<Env, true>) => {
        const pool = new Pool({ connectionString: config.get("DATABASE_URL") });
        // conexão ociosa derrubada pelo banco: sem ouvinte, o processo cai
        pool.on("error", (error) =>
          new Logger("DbModule").error(
            `Conexão com o banco perdida: ${error.message}`
          )
        );
        return pool;
      },
    },
    {
      inject: [PG_POOL],
      provide: DRIZZLE,
      useFactory: (pool: Pool): Database => drizzle({ client: pool, schema }),
    },
    PoolCloser,
  ],
})
export class DbModule {}
