import { Injectable } from '@nestjs/common';
import { Ticket } from '@prisma/client';
import { PrismaService } from 'src/common/prisma.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';

@Injectable()
export class TicketService {
  constructor(private prisma: PrismaService) { }

  async findAll() {
    return this.prisma.ticket.findMany();
  }

  async findOne(id: string): Promise<Ticket | null> {
    return this.prisma.ticket.findUnique({ where: { id } });
  }

  async create(createTicketDto: CreateTicketDto): Promise<Ticket> {
    return this.prisma.ticket.create({ data: { ...createTicketDto, createdAt: new Date() } });
  }

  async update(id: string, updateTicketsDto: UpdateTicketDto): Promise<Ticket> {
    return this.prisma.ticket.update({ data: updateTicketsDto, where: { id } });
  }

  async delete(id: string): Promise<Ticket> {
    return this.prisma.ticket.delete({ where: { id } });
  }
}
