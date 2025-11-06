import { Injectable } from '@nestjs/common';
import { Ticket } from '@prisma/client';
import { PrismaService } from 'src/common/prisma.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { SLA_CONSTANTS} from 'src/common/constants/sla.constant';
import { RecieveTicketMailer } from 'src/common/email/mail-temp/recieve.confirm';
import { EmailService } from 'src/common/email/email.service';

@Injectable()
export class TicketService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService
  ) { }

  private computeSLA(priority: 'P1' | 'P2' | 'P3' | 'P4', now = new Date()) {
    const responseMs = SLA_CONSTANTS.response[priority];
    const resolveMs = SLA_CONSTANTS.resolve[priority];

    return {
      slaResponseDueAt: now.getTime() + responseMs,
      slaResolveDueAt: now.getTime() + resolveMs,
    };
  }

  async create(createTicketDto: CreateTicketDto, user: any): Promise<Ticket> {
    // Send email notification to the user who created the ticket
    try {
      await RecieveTicketMailer(this.emailService, user.email);
    } catch (error) {
      console.error('Failed to send ticket confirmation email:', error);
      // Don't fail the ticket creation if email fails
    }

    const { slaResponseDueAt, slaResolveDueAt } = this.computeSLA(createTicketDto.priority);
    const ticket = await this.prisma.ticket.create({
      data: {
        ...createTicketDto,
        createdAt: new Date(),
        slaResponseDueAt: new Date(slaResponseDueAt),
        slaResolveDueAt: new Date(slaResolveDueAt),
      },
    });

    await this.prisma.ticketEvent.create({
      data: {
        type: 'CREATED',
        createdBy: user.sub.toString(),
        ticketId: ticket.id,
      },
    });

    return ticket;
  }

  async update(id: string, updateTicketsDto: UpdateTicketDto, user: any): Promise<Ticket> {
    const data: any = {
      status: updateTicketsDto.status,
      TicketEvent: {
        create: {
          type: 'STATUS_UPDATED',
          createdBy: user.sub, // Use user ID from JWT
        },
      },
    };

    return await this.prisma.ticket.update({ data, where: { id } });
  }

  async delete(id: string, user: any): Promise<Ticket> {
    return this.prisma.ticket.delete({ where: { id } });
  }

  async findAll() {
    return this.prisma.ticket.findMany();
  }

  async findOne(id: string): Promise<Ticket | null> {
    return this.prisma.ticket.findUnique({ where: { id } });
  }
}

