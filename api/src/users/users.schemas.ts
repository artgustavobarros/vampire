import { z } from "zod";

/** O usuário como sai da API, sem o hash da senha. */
export const publicUserSchema = z.object({
  email: z.email(),
  id: z.uuid(),
  name: z.string(),
});

export type PublicUser = z.infer<typeof publicUserSchema>;
