import { Module } from "@nestjs/common";
import { TicketEventService } from "./ticket-event.service";
import { TicketEventController } from "./ticket-event.controller";

@Module({
    controllers: [TicketEventController],
    providers: [TicketEventService],
})
export class TicketEventModule {}