/**
 * Aplica as migrações de `drizzle/`. Roda sem dependências de desenvolvimento:
 * em dev com `node src/db/migrate.ts` (Node remove os tipos) e no container
 * com `node dist/db/migrate.js`.
 */
import { fileURLToPath } from "node:url";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL é obrigatória");
  process.exit(1);
}

// src/db → ../../drizzle; dist/db → ../../drizzle
const migrationsFolder = fileURLToPath(
  new URL("../../drizzle", import.meta.url)
);

const pool = new Pool({ connectionString: url });
try {
  await migrate(drizzle({ client: pool }), { migrationsFolder });
  console.log("Migrações aplicadas.");
} finally {
  await pool.end();
}
