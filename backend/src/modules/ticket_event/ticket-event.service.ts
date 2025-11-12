import { Injectable } from "@nestjs/common";
import { TicketEvent } from '@prisma/client';
import { PrismaService } from "src/common/prisma.service";
import { UpdateTicketEventDto } from "./dto/update-ticket_event.dto";
import { CreateTicketEventDto } from "./dto/create-ticket_event.dto";

@Injectable()
export class TicketEventService {
    constructor(private prisma: PrismaService) {}

    async create(createTicketEventDto: CreateTicketEventDto, userId: string): Promise<TicketEvent> {
        return this.prisma.ticketEvent.create({
            data: {
                ...createTicketEventDto,
                createdBy: userId
            }
        });
    }
    
    async findAll(): Promise<TicketEvent[]> {
        return this.prisma.ticketEvent.findMany({ take: 50, skip: 0 });
    }

    async findById(id: string): Promise<TicketEvent> {
        const ticketEvent = await this.prisma.ticketEvent.findUnique({
            where: { id }
        });
        if (!ticketEvent) {
            throw new Error('TicketEvent not found');
        }
        return ticketEvent;
    }

    async delete(id: string): Promise<void> {
        await this.prisma.ticketEvent.delete({
            where: { id }
        });
    }

    async update(id: string, updateData: UpdateTicketEventDto): Promise<TicketEvent> {
        return this.prisma.ticketEvent.update({
            where: { id },
            data: updateData
        });
    }

}