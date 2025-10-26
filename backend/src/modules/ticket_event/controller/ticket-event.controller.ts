import { Controller } from "@nestjs/common";
import { TicketEventService } from "../service/ticket-event.service";

@Controller('ticket-events')
export class TicketEventController {
    constructor(private ticketEventService: TicketEventService) {}

    
}