import { Body, Controller, Get, Patch, Put } from "@nestjs/common";
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
import type { User } from "../db/schema.js";
import {
  type PatchSheetDto,
  patchSheetSchema,
  type ReplaceSheetDto,
  replaceSheetSchema,
  sheetResponseSchema,
} from "./sheets.schemas.js";
import { type SheetResponse, SheetsService } from "./sheets.service.js";

/** A ficha do jogador do token (um personagem por jogador). */
@ApiTags("sheets")
@ApiBearerAuth()
@ApiUnauthorizedResponse({ standardSchema: errorResponseSchema })
@Controller("me/sheet")
export class SheetsController {
  constructor(private readonly sheets: SheetsService) {}

  @Get()
  @ApiOperation({ summary: "Ler a ficha do jogador" })
  @ApiOkResponse({ standardSchema: sheetResponseSchema })
  get(@CurrentUser() user: User): Promise<SheetResponse> {
    return this.sheets.get(user.id);
  }

  @Put()
  @ApiOperation({ summary: "Gravar a ficha inteira" })
  @ApiOkResponse({ standardSchema: sheetResponseSchema })
  @ApiBadRequestResponse({ standardSchema: errorResponseSchema })
  @ApiForbiddenResponse({
    description: "Ficha criada: Atributos e Habilidades só pelo Mestre",
    standardSchema: errorResponseSchema,
  })
  replace(
    @CurrentUser() user: User,
    @Body({ schema: replaceSheetSchema }) body: ReplaceSheetDto
  ): Promise<SheetResponse> {
    return this.sheets.replace(user.id, body.sheet);
  }

  @Patch()
  @ApiOperation({
    description: "Troca só as chaves de primeiro nível enviadas em `patch`.",
    summary: "Mesclar campos na ficha",
  })
  @ApiOkResponse({ standardSchema: sheetResponseSchema })
  @ApiBadRequestResponse({ standardSchema: errorResponseSchema })
  @ApiForbiddenResponse({
    description: "Ficha criada: Atributos e Habilidades só pelo Mestre",
    standardSchema: errorResponseSchema,
  })
  merge(
    @CurrentUser() user: User,
    @Body({ schema: patchSheetSchema }) body: PatchSheetDto
  ): Promise<SheetResponse> {
    return this.sheets.merge(user.id, body.patch);
  }
}
