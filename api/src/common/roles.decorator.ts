import { SetMetadata } from "@nestjs/common";
import type { Role } from "../db/schema.js";

export const ROLES = "roles";

/** Restringe a rota aos papéis dados (checado pelo `RolesGuard` global). */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES, roles);
