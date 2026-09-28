import { Module } from "@nestjs/common";
import { UsersModule } from "../users/users.module.js";
import { CoteriesController } from "./coteries.controller.js";
import { CoteriesService } from "./coteries.service.js";
import { EnemiesController } from "./enemies.controller.js";
import { EnemiesService } from "./enemies.service.js";
import { MyCoterieController } from "./my-coterie.controller.js";
import { RoundController } from "./round.controller.js";
import { RoundService } from "./round.service.js";

/** A mesa do Mestre: coteries, Bestiário e rodada. */
@Module({
  controllers: [
    CoteriesController,
    MyCoterieController,
    EnemiesController,
    RoundController,
  ],
  imports: [UsersModule],
  providers: [CoteriesService, EnemiesService, RoundService],
})
export class ChronicleModule {}
