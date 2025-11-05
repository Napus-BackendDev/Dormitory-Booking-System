import { Module } from "@nestjs/common";
import { TicketEventService } from "./ticket-event.service";
import { TicketEventController } from "./ticket-event.controller";
import { AuthModule } from "../auth/auth.module";

@Module({
    imports: [AuthModule],
    controllers: [TicketEventController],
    providers: [TicketEventService],
})
export class TicketEventModule {}