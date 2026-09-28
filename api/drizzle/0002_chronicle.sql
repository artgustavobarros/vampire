CREATE TABLE "coterie_members" (
	"coterie_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"user_id" uuid PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE "coteries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "enemies" (
	"data" jsonb NOT NULL,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rounds" (
	"data" jsonb NOT NULL,
	"id" smallint PRIMARY KEY NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "rounds_single_row" CHECK ("rounds"."id" = 1)
);
--> statement-breakpoint
ALTER TABLE "coterie_members" ADD CONSTRAINT "coterie_members_coterie_id_coteries_id_fk" FOREIGN KEY ("coterie_id") REFERENCES "public"."coteries"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coterie_members" ADD CONSTRAINT "coterie_members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
-- a rodada da crônica começa vazia
INSERT INTO "rounds" ("id", "data") VALUES (1, '{"rodada": 1, "vez": 0, "ordem": []}'::jsonb) ON CONFLICT ("id") DO NOTHING;
