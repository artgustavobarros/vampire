import { Body, Controller, Get, Put } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { CurrentUser } from "../common/current-user.decorator.js";
import { errorResponseSchema } from "../common/error-response.schema.js";
import { Roles } from "../common/roles.decorator.js";
import type { User } from "../db/schema.js";
import {
  type RoundState,
  type RoundView,
  roundStateSchema,
  roundViewSchema,
} from "./chronicle.schemas.js";
import { RoundService } from "./round.service.js";

/** A rodada da crônica: todos leem, só o Mestre grava. */
@ApiTags("round")
@ApiBearerAuth()
@ApiUnauthorizedResponse({ standardSchema: errorResponseSchema })
@Controller("round")
export class RoundController {
  constructor(private readonly round: RoundService) {}

  @Get()
  @ApiOperation({
    description:
      "Jogadores recebem `dados: null` nos inimigos que o Mestre não deixou ver.",
    summary: "Ler a rodada",
  })
  @ApiOkResponse({ standardSchema: roundViewSchema })
  get(@CurrentUser() user: User): Promise<RoundView> {
    return this.round.view(user);
  }

  @Put()
  @Roles("dm")
  @ApiOperation({ summary: "Gravar a rodada inteira (só o Mestre)" })
  @ApiOkResponse({ standardSchema: roundViewSchema })
  @ApiBadRequestResponse({ standardSchema: errorResponseSchema })
  @ApiForbiddenResponse({
    description: "Usuário não é o Mestre",
    standardSchema: errorResponseSchema,
  })
  replace(
    @CurrentUser() user: User,
    @Body({ schema: roundStateSchema }) body: RoundState
  ): Promise<RoundView> {
    return this.round.replace(body, user);
  }
}
