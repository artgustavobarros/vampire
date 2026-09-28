import {
  Body,
  Controller,
  NotFoundException,
  Param,
  Patch,
} from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { CurrentUser } from "../common/current-user.decorator.js";
import { errorResponseSchema } from "../common/error-response.schema.js";
import { Roles } from "../common/roles.decorator.js";
import { playerId } from "../common/uuid-pipes.js";
import type { User } from "../db/schema.js";
import {
  type PublicUser,
  publicUserSchema,
  type UpdateAccountDto,
  updateAccountSchema,
} from "./users.schemas.js";
import { toPublicUser, UsersService } from "./users.service.js";

/** Nome, nome de usuário, e-mail e senha: da própria conta ou, pelo Mestre, de jogadores. */
@ApiTags("accounts")
@ApiBearerAuth()
@ApiUnauthorizedResponse({ standardSchema: errorResponseSchema })
@ApiBadRequestResponse({ standardSchema: errorResponseSchema })
@ApiConflictResponse({
  description: "E-mail ou nome de usuário de outra conta",
  standardSchema: errorResponseSchema,
})
@Controller()
export class AccountsController {
  constructor(private readonly users: UsersService) {}

  @Patch("me/account")
  @ApiOperation({
    description:
      "Só os campos enviados mudam. Mudar e-mail ou senha exige `currentPassword`. Do Mestre, só o nome.",
    summary: "Editar a própria conta",
  })
  @ApiOkResponse({ standardSchema: publicUserSchema })
  @ApiForbiddenResponse({
    description:
      "Senha atual incorreta, ou campo do Mestre definido no servidor",
    standardSchema: errorResponseSchema,
  })
  async updateMine(
    @CurrentUser() user: User,
    @Body({ schema: updateAccountSchema }) body: UpdateAccountDto
  ): Promise<PublicUser> {
    return toPublicUser(
      await this.users.updateAccount(user, body, {
        requireCurrentPassword: true,
      })
    );
  }

  @Patch("accounts/:userId")
  @Roles("dm")
  @ApiOperation({
    description:
      "Como `PATCH /me/account`, sem a senha atual do jogador (`currentPassword` é ignorado).",
    summary: "Editar a conta de um jogador (Mestre)",
  })
  @ApiOkResponse({ standardSchema: publicUserSchema })
  @ApiForbiddenResponse({
    description: "Usuário não é o Mestre",
    standardSchema: errorResponseSchema,
  })
  @ApiNotFoundResponse({ standardSchema: errorResponseSchema })
  async updatePlayer(
    @Param("userId", playerId) id: string,
    @Body({ schema: updateAccountSchema }) body: UpdateAccountDto
  ): Promise<PublicUser> {
    const player = await this.users.findPlayerById(id);
    if (!player) {
      throw new NotFoundException("Jogador não encontrado.");
    }
    return toPublicUser(
      await this.users.updateAccount(player, body, {
        requireCurrentPassword: false,
      })
    );
  }
}
