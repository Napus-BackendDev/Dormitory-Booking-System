import { Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { Body } from "@nestjs/common";
import { UUID } from "crypto";
import { TicketEventService } from "./ticket-event.service";
import { CreateTicketEventDto } from "./dto/create-ticket_event.dto";
import { UpdateTicketEventDto } from "./dto/update-ticket_event.dto";
import { AuthGuard } from "../auth/auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { RolesGuard } from "src/common/author/roles.guard";
import { Roles } from "src/common/author/role.decorator";

@Controller('ticket-event')
@UseGuards(AuthGuard, RolesGuard)
export class TicketEventController {
    constructor(private ticketEventService: TicketEventService) {}

    @Post()
    async createTicketEvent(@Body() createTicketEventDto: CreateTicketEventDto, @CurrentUser() user: any) {
        // You can now access the current user information
        console.log('Current user creating ticket event:', user);
        return this.ticketEventService.create(createTicketEventDto, user.sub);
    }

    @Get()
    async getAllTicketEvents() {
        return this.ticketEventService.findAll();
    }

    @Get(':id')
    @Roles("STAFF", "ADMIN")
    async getTicketEventById(@Param('id') id: UUID) {
        return this.ticketEventService.findById(id);
    }

    @Patch(':id')
    @Roles("STAFF", "ADMIN")
    async updateTicketEvent(@Param('id') id: UUID, @Body() updateData: Partial<UpdateTicketEventDto>) {
        return this.ticketEventService.update(id, updateData);
    }

    @Delete(':id')
    @Roles("ADMIN")
    async deleteTicketEvent(@Param('id') id: UUID) {
        return this.ticketEventService.delete(id);
    }

}