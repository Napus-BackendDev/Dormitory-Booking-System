import { Injectable } from '@nestjs/common';
import { Ticket } from '@prisma/client';
import { PrismaService } from 'src/common/prisma.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { LineService } from '../line/Line.service';

@Injectable()
export class TicketService {
  constructor(
    private prisma: PrismaService,
    private lineService: LineService,
  ) {}

  async findAll() {
    return this.prisma.ticket.findMany();
  }

  async findOne(id: string): Promise<Ticket | null> {
    return this.prisma.ticket.findUnique({ where: { id } });
  }

  async create(createTicketDto: CreateTicketDto): Promise<Ticket> {
    const ticket = await this.prisma.ticket.create({
      data: { ...createTicketDto, createdAt: new Date() },
    });

    this.lineService.sendLineCreateTicket(ticket);
    return ticket;
  }

  async update(id: string, updateTicketsDto: UpdateTicketDto): Promise<Ticket> {
    const ticket = await this.prisma.ticket.update({ data: updateTicketsDto, where: { id } });
    this.lineService.sendLineUpdateTicket(ticket);
    return ticket;
  }

  async delete(id: string): Promise<Ticket> {
    return this.prisma.ticket.delete({ where: { id } });
  }
}
