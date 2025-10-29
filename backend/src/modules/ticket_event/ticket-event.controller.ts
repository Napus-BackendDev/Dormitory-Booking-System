import { Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { Body } from "@nestjs/common";
import { UUID } from "crypto";
import { TicketEventService } from "./ticket-event.service";
import { CreateTicketEventDto } from "./dto/create-ticket-event.dto";
import { UpdateTicketEventDto } from "./dto/update-ticket-event.dto";

@Controller('ticket-event')
export class TicketEventController {
    constructor(private ticketEventService: TicketEventService) {}

    @Post()
    async createTicketEvent(@Body() createTicketEventDto: CreateTicketEventDto) {
        return this.ticketEventService.create(createTicketEventDto);
    }

    @Get()
    async getAllTicketEvents() {
        return this.ticketEventService.findAll();
    }

    @Get(':id')
    async getTicketEventById(@Param('id') id: UUID) {
        return this.ticketEventService.findById(id);
    }

    @Patch(':id')
    async updateTicketEvent(@Param('id') id: UUID, @Body() updateData: Partial<UpdateTicketEventDto>) {
        return this.ticketEventService.update(id, updateData);
    }
    
    @Delete(':id')
    async deleteTicketEvent(@Param('id') id: UUID) {
        return this.ticketEventService.delete(id);
    }

}