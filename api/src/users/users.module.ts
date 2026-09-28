import { Module } from "@nestjs/common";
import { AccountsController } from "./accounts.controller.js";
import { UsersService } from "./users.service.js";

@Module({
  controllers: [AccountsController],
  exports: [UsersService],
  providers: [UsersService],
})
export class UsersModule {}
