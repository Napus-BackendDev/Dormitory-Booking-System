import { Injectable } from "@nestjs/common";
import { TicketEvents } from '@prisma/client';
import { PrismaService } from "src/common/prisma.service";
import { UpdateTicketEventDto } from "./dto/update-ticket-event.dto";
import { CreateTicketEventDto } from "./dto/create-ticket-event.dto";

@Injectable()
export class TicketEventService {
    constructor(private prisma: PrismaService) {}

    async create(createTicketEventDto: CreateTicketEventDto): Promise<TicketEvents> {
        return this.prisma.ticketEvents.create({
            data: createTicketEventDto
        });
    }
    
    async findAll(): Promise<TicketEvents[]> {
        return this.prisma.ticketEvents.findMany();
    }

    async findById(id: string): Promise<TicketEvents> {
        const ticketEvent = await this.prisma.ticketEvents.findUnique({
            where: { id }
        });
        if (!ticketEvent) {
            throw new Error('TicketEvent not found');
        }
        return ticketEvent;
    }

    async delete(id: string): Promise<void> {
        await this.prisma.ticketEvents.delete({
            where: { id }
        });
    }

    async update(id: string, updateData: UpdateTicketEventDto): Promise<TicketEvents> {
        return this.prisma.ticketEvents.update({
            where: { id },
            data: updateData
        });
    }

}