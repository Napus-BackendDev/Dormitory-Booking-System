import { Module } from "@nestjs/common";
import { TicketEventService } from "./ticket-event.service";
import { TicketEventController } from "./ticket-event.controller";
import { AuthModule } from "../auth/auth.module";
import { Reflector } from "@nestjs/core";
import { RedisModule } from "../../common/redis/redis.module";

@Module({
    imports: [AuthModule, RedisModule],
    controllers: [TicketEventController],
    providers: [TicketEventService, Reflector],
})
export class TicketEventModule {}