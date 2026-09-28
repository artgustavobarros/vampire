ALTER TABLE "users" ADD COLUMN "username" text;--> statement-breakpoint
-- contas antigas: o Mestre vira `mestre`; os demais, a parte local do e-mail
-- no formato ^[a-z][a-z0-9_.]{2,19}$, com número no fim em caso de colisão
DO $$
DECLARE
  u record;
  base text;
  candidate text;
  n int;
BEGIN
  UPDATE "users" SET "username" = 'mestre'
  WHERE "id" = (
    SELECT "id" FROM "users" WHERE "role" = 'dm' ORDER BY "created_at", "id" LIMIT 1
  );
  FOR u IN
    SELECT "id", "email" FROM "users" WHERE "username" IS NULL ORDER BY "created_at", "id"
  LOOP
    base := regexp_replace(lower(split_part(u."email", '@', 1)), '[^a-z0-9_.]', '_', 'g');
    IF base !~ '^[a-z]' THEN
      base := 'u' || base;
    END IF;
    base := left(base, 17);
    IF length(base) < 3 THEN
      base := rpad(base, 3, '_');
    END IF;
    candidate := base;
    n := 1;
    WHILE candidate = 'mestre' OR EXISTS (SELECT 1 FROM "users" WHERE "username" = candidate) LOOP
      n := n + 1;
      candidate := base || n;
    END LOOP;
    UPDATE "users" SET "username" = candidate WHERE "id" = u."id";
  END LOOP;
END $$;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "username" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_username_unique" UNIQUE("username");
