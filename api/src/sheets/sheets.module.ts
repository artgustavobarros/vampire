import { Module } from "@nestjs/common";
import { UsersModule } from "../users/users.module.js";
import { DmSheetsController } from "./dm-sheets.controller.js";
import { SheetsController } from "./sheets.controller.js";
import { SheetsService } from "./sheets.service.js";

@Module({
  controllers: [SheetsController, DmSheetsController],
  imports: [UsersModule],
  providers: [SheetsService],
})
export class SheetsModule {}
