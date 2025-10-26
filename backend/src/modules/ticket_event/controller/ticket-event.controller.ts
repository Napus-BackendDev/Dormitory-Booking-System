import { Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { TicketEventService } from "../service/ticket-event.service";
import { Body } from "@nestjs/common";
import { CreateTicketEventDto } from "../dtos/create-ticket-event.dto";
import { UUID } from "crypto";
import { UpdateTicketEventDto } from "../dtos/update-ticket-event.dto";

@Controller('ticket-events')
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

    @Put(':id')
    async updateTicketEvent(@Param('id') id: UUID, @Body() updateData: Partial<UpdateTicketEventDto>) {
        return this.ticketEventService.update(id, updateData);
    }
    
    @Delete(':id')
    async deleteTicketEvent(@Param('id') id: UUID) {
        return this.ticketEventService.delete(id);
    }

}