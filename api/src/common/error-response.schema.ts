import { z } from "zod";

/** Corpo de todo erro da API (ver `HttpExceptionFilter`). */
export const errorResponseSchema = z.object({
  error: z.string().meta({ description: "Nome do status HTTP" }),
  message: z
    .string()
    .meta({ description: "Mensagem em português, pronta para o toast" }),
  statusCode: z.number().int(),
});

export type ErrorResponse = z.infer<typeof errorResponseSchema>;
