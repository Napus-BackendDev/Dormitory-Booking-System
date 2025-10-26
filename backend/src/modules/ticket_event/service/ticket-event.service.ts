import { Injectable } from "@nestjs/common";
import { TicketEvent } from "../entitys/ticket-event.entity";
import { UpdateTicketEventDto } from "../dtos/update-ticket-event.dto";
import { PrismaService } from "src/common/services/prisma.service";
import { CreateTicketEventDto } from "../dtos/create-ticket-event.dto";

@Injectable()
export class TicketEventService {
    constructor(private prisma: PrismaService) {}

    async create(createTicketEventDto: CreateTicketEventDto): Promise<TicketEvent> {
        return this.prisma.ticket_events.create({
            data: createTicketEventDto
        });
    }
    
    async findAll(): Promise<TicketEvent[]> {
        return this.prisma.ticket_events.findMany();
    }

    async findById(id: string): Promise<TicketEvent> {
        const ticketEvent = await this.prisma.ticket_events.findUnique({
            where: { id }
        });
        if (!ticketEvent) {
            throw new Error('TicketEvent not found');
        }
        return ticketEvent;
    }

    async delete(id: string): Promise<void> {
        await this.prisma.ticket_events.delete({
            where: { id }
        });
    }

    async update(id: string, updateData: UpdateTicketEventDto): Promise<TicketEvent> {
        return this.prisma.ticket_events.update({
            where: { id },
            data: updateData
        });
    }

}