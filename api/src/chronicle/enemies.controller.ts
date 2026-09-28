import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
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
  type EnemyBodyDto,
  enemyBodySchema,
  enemyListSchema,
  enemyRecordSchema,
} from "./chronicle.schemas.js";
import { EnemiesService, type EnemyRecord } from "./enemies.service.js";
import { enemyId } from "./uuid-pipes.js";

/** O Bestiário, só para o Mestre. */
@ApiTags("enemies (Mestre)")
@ApiBearerAuth()
@ApiUnauthorizedResponse({ standardSchema: errorResponseSchema })
@ApiForbiddenResponse({
  description: "Usuário não é o Mestre",
  standardSchema: errorResponseSchema,
})
@Roles("dm")
@Controller("enemies")
export class EnemiesController {
  constructor(private readonly enemies: EnemiesService) {}

  @Get()
  @ApiOperation({ summary: "Listar os inimigos, por ordem de criação" })
  @ApiOkResponse({ standardSchema: enemyListSchema })
  list(): Promise<EnemyRecord[]> {
    return this.enemies.list();
  }

  @Post()
  @ApiOperation({ summary: "Criar um inimigo" })
  @ApiCreatedResponse({ standardSchema: enemyRecordSchema })
  @ApiBadRequestResponse({ standardSchema: errorResponseSchema })
  create(
    @Body({ schema: enemyBodySchema }) body: EnemyBodyDto
  ): Promise<EnemyRecord> {
    return this.enemies.create(body.enemy);
  }

  @Put(":id")
  @ApiOperation({ summary: "Substituir os dados de um inimigo" })
  @ApiOkResponse({ standardSchema: enemyRecordSchema })
  @ApiBadRequestResponse({ standardSchema: errorResponseSchema })
  @ApiNotFoundResponse({ standardSchema: errorResponseSchema })
  replace(
    @Param("id", enemyId) id: string,
    @Body({ schema: enemyBodySchema }) body: EnemyBodyDto
  ): Promise<EnemyRecord> {
    return this.enemies.replace(id, body.enemy);
  }

  @Delete(":id")
  @HttpCode(204)
  @ApiOperation({ summary: "Excluir um inimigo (e tirá-lo da rodada)" })
  @ApiNoContentResponse()
  @ApiNotFoundResponse({ standardSchema: errorResponseSchema })
  remove(@Param("id", enemyId) id: string): Promise<void> {
    return this.enemies.remove(id);
  }
}
