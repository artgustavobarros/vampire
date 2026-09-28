CREATE TYPE "public"."user_role" AS ENUM('player', 'dm');--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "role" "user_role" DEFAULT 'player' NOT NULL;--> statement-breakpoint
-- conta do Mestre; senha "!@#ASD123asd" (bcrypt, custo 10). Troque fora de desenvolvimento.
INSERT INTO "users" ("email", "name", "password_hash", "role")
VALUES ('admin@admin.com', 'Mestre', '$2b$10$ptI4chkvfNa5bsdixu8a5uGJJfr9pgc7ebIhQwMh77MHQLhyk4Nse', 'dm')
ON CONFLICT ("email") DO UPDATE SET "role" = 'dm', "password_hash" = EXCLUDED."password_hash";
