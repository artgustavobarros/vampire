import { Controller, Get } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { CurrentUser } from "../common/current-user.decorator.js";
import { errorResponseSchema } from "../common/error-response.schema.js";
import type { User } from "../db/schema.js";
import { type MyCoterie, myCoterieSchema } from "./chronicle.schemas.js";
import { CoteriesService } from "./coteries.service.js";

/** A coterie do jogador do token, com a ficha dos membros resumida. */
@ApiTags("coterie")
@ApiBearerAuth()
@ApiUnauthorizedResponse({ standardSchema: errorResponseSchema })
@Controller("me/coterie")
export class MyCoterieController {
  constructor(private readonly coteries: CoteriesService) {}

  @Get()
  @ApiOperation({
    description:
      "`coterie: null` quando o jogador não está em nenhuma. Sem e-mail e só com a parte da ficha que o cartão mostra.",
    summary: "Ler a coterie do jogador",
  })
  @ApiOkResponse({ standardSchema: myCoterieSchema })
  get(@CurrentUser() user: User): Promise<MyCoterie> {
    return this.coteries.forUser(user.id);
  }
}
