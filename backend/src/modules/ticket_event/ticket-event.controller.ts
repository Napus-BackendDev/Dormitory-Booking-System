import { Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { Body } from "@nestjs/common";
import { UUID } from "crypto";
import { TicketEventService } from "./ticket-event.service";
import { CreateTicketEventDto } from "./dto/create-ticket-event.dto";
import { UpdateTicketEventDto } from "./dto/update-ticket-event.dto";
import { AuthGuard } from "../auth/auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { RolesGuard } from "src/common/author/roles.guard";
import { Roles } from "src/common/author/role.decorator";
import { Role } from "src/common/enums/role.enum";

@Controller('ticket-event')
@UseGuards(AuthGuard, RolesGuard)
export class TicketEventController {
    constructor(private ticketEventService: TicketEventService) {}

    @Post()
    @Roles(Role.USER, Role.STAFF, Role.ADMIN)
    async createTicketEvent(@Body() createTicketEventDto: CreateTicketEventDto, @CurrentUser() user: any) {
        // You can now access the current user information
        console.log('Current user creating ticket event:', user);
        return this.ticketEventService.create(createTicketEventDto, user.sub);
    }

    @Get()
    @Roles(Role.STAFF, Role.ADMIN)
    async getAllTicketEvents() {
        return this.ticketEventService.findAll();
    }

    @Get(':id')
    @Roles(Role.STAFF, Role.ADMIN)
    async getTicketEventById(@Param('id') id: UUID) {
        return this.ticketEventService.findById(id);
    }

    @Patch(':id')
    @Roles(Role.STAFF, Role.ADMIN)
    async updateTicketEvent(@Param('id') id: UUID, @Body() updateData: Partial<UpdateTicketEventDto>) {
        return this.ticketEventService.update(id, updateData);
    }

    @Delete(':id')
    @Roles(Role.ADMIN)
    async deleteTicketEvent(@Param('id') id: UUID) {
        return this.ticketEventService.delete(id);
    }

}