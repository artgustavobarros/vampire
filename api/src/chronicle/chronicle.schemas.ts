import { z } from "zod";
import { playerSheetSchema } from "../sheets/sheets.schemas.js";

const INVALID_COTERIE = "Coterie inválida.";
const INVALID_ENEMY = "Inimigo inválido.";
const INVALID_ENTRY = "Participante inválido na rodada.";
const INVALID_ROUND = "Rodada inválida.";
const OUT_OF_ORDER = "Vez fora da ordem.";

/** Inteiro de `min` a `max`, com a mesma mensagem em qualquer falha. */
const int = (min: number, max: number, error: string) =>
  z.int({ error }).min(min, { error }).max(max, { error });

const text = (max: number, error: string) =>
  z.string({ error }).max(max, { error });

// ---------------------------------------------------------------- coteries

export const coterieNameSchema = z.object(
  {
    nome: z
      .string({ error: INVALID_COTERIE })
      .trim()
      .max(80, { error: "O nome da coterie tem no máximo 80 caracteres." }),
  },
  { error: INVALID_COTERIE }
);

export const createCoterieSchema = coterieNameSchema.partial();

export const coterieSchema = z.object({
  id: z.uuid(),
  membros: z
    .array(playerSheetSchema)
    .meta({ description: "Por ordem de entrada na coterie" }),
  nome: z.string(),
});

export const coterieListSchema = z.array(coterieSchema);

/** Só o necessário para o cartão: nome, clã, Fome e as trilhas. */
export const projectedSheetSchema = z
  .object({
    attrs: z.record(z.string(), z.number()),
    cla: z.string().optional(),
    criada: z.boolean().optional(),
    fdv: z.array(z.number()).optional(),
    fome: z.number().optional(),
    nome: z.string().optional(),
    vit: z.array(z.number()).optional(),
  })
  .meta({
    description:
      "Parte da ficha visível a outros jogadores; `attrs` só com Vigor, Autocontrole e Determinação",
  });

export const myCoterieSchema = z.object({
  coterie: z
    .object({
      id: z.uuid(),
      membros: z.array(
        z.object({ sheet: projectedSheetSchema.nullable(), userId: z.uuid() })
      ),
      nome: z.string(),
    })
    .nullable(),
});

// ---------------------------------------------------------------- inimigos

const marks = z.array(
  z.union([z.literal(0), z.literal(1), z.literal(2)], { error: INVALID_ENEMY }),
  { error: INVALID_ENEMY }
);

const enemyObject = z.object(
  {
    especiais: z
      .array(
        z.object(
          {
            nome: text(80, INVALID_ENEMY),
            texto: text(10_000, INVALID_ENEMY).meta({
              description:
                "HTML restrito (p, br, strong, b, em, i, u, ul, ol, li); o web limpa ao exibir",
            }),
          },
          { error: INVALID_ENEMY }
        ),
        { error: INVALID_ENEMY }
      )
      .max(20, { error: INVALID_ENEMY }),
    fdv: marks,
    fdvMax: int(1, 20, INVALID_ENEMY),
    nome: text(120, INVALID_ENEMY),
    paradas: z
      .array(
        z.object(
          { dados: int(0, 30, INVALID_ENEMY), nome: text(60, INVALID_ENEMY) },
          { error: INVALID_ENEMY }
        ),
        { error: INVALID_ENEMY }
      )
      .max(20, { error: INVALID_ENEMY }),
    visivel: z
      .boolean({ error: INVALID_ENEMY })
      .meta({ description: "Jogadores veem os dados na Rodada" }),
    vit: marks,
    vitMax: int(1, 20, INVALID_ENEMY),
  },
  { error: INVALID_ENEMY }
);

export const enemyDataSchema = enemyObject.refine(
  (e) => e.vit.length <= e.vitMax && e.fdv.length <= e.fdvMax,
  { error: INVALID_ENEMY }
);

export const enemyBodySchema = z.object(
  { enemy: enemyDataSchema },
  { error: INVALID_ENEMY }
);

export const enemyRecordSchema = z.object({
  enemy: enemyDataSchema,
  id: z.uuid(),
  updatedAt: z.iso.datetime(),
});

export const enemyListSchema = z.array(enemyRecordSchema);

// ---------------------------------------------------------------- rodada

export const roundEntrySchema = z.object(
  {
    id: z.uuid({ error: INVALID_ENTRY }),
    iniciativa: int(0, 30, INVALID_ENTRY).nullable(),
    tipo: z.enum(["jogador", "inimigo"], { error: INVALID_ENTRY }),
  },
  { error: INVALID_ENTRY }
);

export const roundStateSchema = z
  .object(
    {
      ordem: z
        .array(roundEntrySchema, { error: INVALID_ENTRY })
        .max(50, { error: "A rodada tem no máximo 50 participantes." })
        .refine(
          (ordem) =>
            new Set(ordem.map((e) => `${e.tipo}:${e.id}`)).size ===
            ordem.length,
          { error: INVALID_ENTRY }
        ),
      rodada: z.int({ error: INVALID_ROUND }).min(1, { error: INVALID_ROUND }),
      vez: z.int({ error: OUT_OF_ORDER }).min(0, { error: OUT_OF_ORDER }),
    },
    { error: INVALID_ROUND }
  )
  .refine(
    (s) => (s.ordem.length === 0 ? s.vez === 0 : s.vez < s.ordem.length),
    { error: OUT_OF_ORDER }
  );

const enemyViewData = enemyObject.omit({ nome: true, visivel: true });

export const roundViewSchema = z.object({
  ordem: z.array(
    z.discriminatedUnion("tipo", [
      z.object({
        id: z.uuid(),
        iniciativa: z.int().nullable(),
        sheet: projectedSheetSchema.nullable(),
        tipo: z.literal("jogador"),
      }),
      z.object({
        dados: enemyViewData.nullable().meta({
          description:
            "`null` para jogadores quando o Mestre não deixou ver os dados",
        }),
        id: z.uuid(),
        iniciativa: z.int().nullable(),
        nome: z.string(),
        tipo: z.literal("inimigo"),
        visivel: z.boolean(),
      }),
    ])
  ),
  rodada: z.int(),
  updatedAt: z.iso.datetime().nullable(),
  vez: z.int(),
});

export type CoterieNameDto = z.infer<typeof coterieNameSchema>;
export type CreateCoterieDto = z.infer<typeof createCoterieSchema>;
export type Coterie = z.infer<typeof coterieSchema>;
export type MyCoterie = z.infer<typeof myCoterieSchema>;
export type ProjectedSheet = z.infer<typeof projectedSheetSchema>;
export type EnemyData = z.infer<typeof enemyDataSchema>;
export type EnemyBodyDto = z.infer<typeof enemyBodySchema>;
export type RoundEntry = z.infer<typeof roundEntrySchema>;
export type RoundState = z.infer<typeof roundStateSchema>;
export type RoundView = z.infer<typeof roundViewSchema>;
