import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Put,
} from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { errorResponseSchema } from "../common/error-response.schema.js";
import { Roles } from "../common/roles.decorator.js";
import {
  type Coterie,
  type CoterieNameDto,
  type CreateCoterieDto,
  coterieListSchema,
  coterieNameSchema,
  coterieSchema,
  createCoterieSchema,
} from "./chronicle.schemas.js";
import { CoteriesService } from "./coteries.service.js";
import { coterieId, playerId } from "./uuid-pipes.js";

/** Coteries da crônica, só para o Mestre. */
@ApiTags("coteries (Mestre)")
@ApiBearerAuth()
@ApiUnauthorizedResponse({ standardSchema: errorResponseSchema })
@ApiForbiddenResponse({
  description: "Usuário não é o Mestre",
  standardSchema: errorResponseSchema,
})
@Roles("dm")
@Controller("coteries")
export class CoteriesController {
  constructor(private readonly coteries: CoteriesService) {}

  @Get()
  @ApiOperation({ summary: "Listar as coteries com os membros e as fichas" })
  @ApiOkResponse({ standardSchema: coterieListSchema })
  list(): Promise<Coterie[]> {
    return this.coteries.list();
  }

  @Post()
  @ApiOperation({ summary: "Criar uma coterie" })
  @ApiCreatedResponse({ standardSchema: coterieSchema })
  @ApiBadRequestResponse({ standardSchema: errorResponseSchema })
  create(
    @Body({ schema: createCoterieSchema }) body: CreateCoterieDto
  ): Promise<Coterie> {
    return this.coteries.create(body.nome);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Renomear uma coterie" })
  @ApiOkResponse({ standardSchema: coterieSchema })
  @ApiBadRequestResponse({ standardSchema: errorResponseSchema })
  @ApiNotFoundResponse({ standardSchema: errorResponseSchema })
  rename(
    @Param("id", coterieId) id: string,
    @Body({ schema: coterieNameSchema }) body: CoterieNameDto
  ): Promise<Coterie> {
    return this.coteries.rename(id, body.nome);
  }

  @Delete(":id")
  @HttpCode(204)
  @ApiOperation({ summary: "Excluir uma coterie (os membros ficam sem)" })
  @ApiNoContentResponse()
  @ApiNotFoundResponse({ standardSchema: errorResponseSchema })
  remove(@Param("id", coterieId) id: string): Promise<void> {
    return this.coteries.remove(id);
  }

  @Put(":id/membros/:userId")
  @ApiOperation({
    description: "Um jogador fica em no máximo uma coterie.",
    summary: "Colocar um jogador na coterie",
  })
  @ApiOkResponse({ standardSchema: coterieSchema })
  @ApiBadRequestResponse({ standardSchema: errorResponseSchema })
  @ApiNotFoundResponse({ standardSchema: errorResponseSchema })
  @ApiConflictResponse({ standardSchema: errorResponseSchema })
  addMember(
    @Param("id", coterieId) id: string,
    @Param("userId", playerId) userId: string
  ): Promise<Coterie> {
    return this.coteries.addMember(id, userId);
  }

  @Delete(":id/membros/:userId")
  @ApiOperation({ summary: "Retirar um jogador da coterie" })
  @ApiOkResponse({ standardSchema: coterieSchema })
  @ApiNotFoundResponse({ standardSchema: errorResponseSchema })
  removeMember(
    @Param("id", coterieId) id: string,
    @Param("userId", playerId) userId: string
  ): Promise<Coterie> {
    return this.coteries.removeMember(id, userId);
  }
}
