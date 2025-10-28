import { Module } from "@nestjs/common";
import { TicketEventService } from "./service/ticket-event.service";
import { TicketEventController } from "./controller/ticket-event.controller";

@Module({
    controllers: [TicketEventController],
    providers: [TicketEventService],
})
export class TicketEventModule {}