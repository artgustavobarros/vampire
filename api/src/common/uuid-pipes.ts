import { BadRequestException, ParseUUIDPipe } from "@nestjs/common";

const uuid = (message: string) =>
  new ParseUUIDPipe({
    exceptionFactory: () => new BadRequestException(message),
  });

export const coterieId = uuid("Coterie inválida.");
export const enemyId = uuid("Inimigo inválido.");
export const playerId = uuid("Jogador inválido.");
