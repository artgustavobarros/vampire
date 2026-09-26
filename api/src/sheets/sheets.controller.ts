import { Body, Controller, Get, Patch, Put } from "@nestjs/common";
import { CurrentUser } from "../common/current-user.decorator.js";
import type { User } from "../db/schema.js";
import {
  type PatchSheetDto,
  patchSheetSchema,
  type ReplaceSheetDto,
  replaceSheetSchema,
} from "./sheets.schemas.js";
import { type SheetResponse, SheetsService } from "./sheets.service.js";

/** A ficha do jogador do token (um personagem por jogador). */
@Controller("me/sheet")
export class SheetsController {
  constructor(private readonly sheets: SheetsService) {}

  @Get()
  get(@CurrentUser() user: User): Promise<SheetResponse> {
    return this.sheets.get(user.id);
  }

  @Put()
  replace(
    @CurrentUser() user: User,
    @Body({ schema: replaceSheetSchema }) body: ReplaceSheetDto
  ): Promise<SheetResponse> {
    return this.sheets.replace(user.id, body.sheet);
  }

  @Patch()
  merge(
    @CurrentUser() user: User,
    @Body({ schema: patchSheetSchema }) body: PatchSheetDto
  ): Promise<SheetResponse> {
    return this.sheets.merge(user.id, body.patch);
  }
}
