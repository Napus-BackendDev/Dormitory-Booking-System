import { Injectable } from '@nestjs/common';
import { Ticket } from '@prisma/client';
import { PrismaService } from 'src/common/prisma.service';
import { CreateTicketsDto } from './dto/create-tickets.dto';
import { UpdateTicketsDto } from './dto/update-tickets.dto';

@Injectable()
export class TicketsService {
  constructor(private prisma: PrismaService) { }

  async findAll() {
    return this.prisma.ticket.findMany();
  }

  async create(createTicketDto: CreateTicketsDto): Promise<Ticket> {
    return this.prisma.ticket.create({ data: { ...createTicketDto, createdAt: new Date() } });
  }

  async update(id: string, updateTicketsDto: UpdateTicketsDto): Promise<Ticket> {
    return this.prisma.ticket.update({ data: updateTicketsDto, where: { id } });
  }

  async delete(id: string): Promise<Ticket> {
    return this.prisma.ticket.delete({ where: { id } });
  }
}
