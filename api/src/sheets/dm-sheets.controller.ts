import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
} from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { errorResponseSchema } from "../common/error-response.schema.js";
import { Roles } from "../common/roles.decorator.js";
import {
  type PatchSheetDto,
  patchSheetSchema,
  playerSheetListSchema,
  playerSheetSchema,
  sheetResponseSchema,
} from "./sheets.schemas.js";
import {
  type PlayerSheet,
  type SheetResponse,
  SheetsService,
} from "./sheets.service.js";

const userId = new ParseUUIDPipe({
  exceptionFactory: () => new BadRequestException("Jogador inválido."),
});

/** Fichas de todos os jogadores, só para o Mestre. */
@ApiTags("sheets (Mestre)")
@ApiBearerAuth()
@ApiUnauthorizedResponse({ standardSchema: errorResponseSchema })
@ApiForbiddenResponse({
  description: "Usuário não é o Mestre",
  standardSchema: errorResponseSchema,
})
@Roles("dm")
@Controller("sheets")
export class DmSheetsController {
  constructor(private readonly sheets: SheetsService) {}

  @Get()
  @ApiOperation({ summary: "Listar os jogadores e suas fichas" })
  @ApiOkResponse({ standardSchema: playerSheetListSchema })
  list(): Promise<PlayerSheet[]> {
    return this.sheets.list();
  }

  @Get(":userId")
  @ApiOperation({ summary: "Ler a ficha de um jogador" })
  @ApiOkResponse({ standardSchema: playerSheetSchema })
  @ApiBadRequestResponse({ standardSchema: errorResponseSchema })
  @ApiNotFoundResponse({ standardSchema: errorResponseSchema })
  get(@Param("userId", userId) id: string): Promise<PlayerSheet> {
    return this.sheets.getFor(id);
  }

  @Patch(":userId")
  @ApiOperation({
    description:
      "Como `PATCH /me/sheet`, mas sem a trava de Atributos e Habilidades.",
    summary: "Mesclar campos na ficha de um jogador",
  })
  @ApiOkResponse({ standardSchema: sheetResponseSchema })
  @ApiBadRequestResponse({ standardSchema: errorResponseSchema })
  @ApiNotFoundResponse({ standardSchema: errorResponseSchema })
  merge(
    @Param("userId", userId) id: string,
    @Body({ schema: patchSheetSchema }) body: PatchSheetDto
  ): Promise<SheetResponse> {
    return this.sheets.mergeFor(id, body.patch);
  }
}
