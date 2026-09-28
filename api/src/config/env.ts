import { z } from "zod";

export const envSchema = z
  .object({
    /** Conta do Mestre garantida na subida; sem as duas, nenhuma é criada. */
    ADMIN_EMAIL: z
      .string()
      .trim()
      .toLowerCase()
      .pipe(z.email("ADMIN_EMAIL inválido"))
      .optional(),
    ADMIN_PASSWORD: z
      .string()
      .min(8, "ADMIN_PASSWORD precisa ter pelo menos 8 caracteres")
      .optional(),
    CORS_ORIGIN: z.string().min(1).default("http://localhost:3000"),
    DATABASE_URL: z.url({ error: "DATABASE_URL é obrigatória" }),
    JWT_EXPIRES_IN: z
      .string()
      .regex(/^\d+(ms|s|m|h|d|w|y)?$/, "JWT_EXPIRES_IN inválida (ex.: 7d, 12h)")
      .default("7d"),
    JWT_SECRET: z
      .string({ error: "JWT_SECRET é obrigatória" })
      .min(32, "JWT_SECRET precisa ter pelo menos 32 caracteres"),
    PORT: z.coerce.number().int().positive().default(3333),
  })
  .refine((env) => !env.ADMIN_EMAIL === !env.ADMIN_PASSWORD, {
    error: "Defina ADMIN_EMAIL e ADMIN_PASSWORD juntas",
    path: ["ADMIN_PASSWORD"],
  });

export type Env = z.infer<typeof envSchema>;
