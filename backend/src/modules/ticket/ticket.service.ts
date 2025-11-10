import { Injectable } from '@nestjs/common';
import { Ticket } from '@prisma/client';
import { PrismaService } from 'src/common/prisma.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { SLA_CONSTANTS} from 'src/common/constants/sla.constant';
import { RecieveTicketMailer } from 'src/common/email/mail-temp/recieve.confirm';
import { EmailService } from 'src/common/email/email.service';
import { WorkDoneMailer } from 'src/common/email/mail-temp/workdone.confirm';
import { LineService } from '../line/Line.service';
import { generateImageUrl } from '../../common/utils/utils';

@Injectable()
export class TicketService {
  constructor(
    private prisma: PrismaService,
    private lineService: LineService,
      private emailService: EmailService
  ) {}

  private computeSLA(priority: 'P1' | 'P2' | 'P3' | 'P4', now = new Date()) {
    const responseMs = SLA_CONSTANTS.response[priority];
    const resolveMs = SLA_CONSTANTS.resolve[priority];

    return {
      slaResponseDueAt: now.getTime() + responseMs,
      slaResolveDueAt: now.getTime() + resolveMs,
    };
  }

  async findAll() {
    return this.prisma.ticket.findMany();
  }

  async findOne(id: string): Promise<Ticket | null> {
    return this.prisma.ticket.findUnique({ where: { id } });
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
        slaResolveDueAt: new Date(slaResolveDueAt),
      },
    });

    this.lineService.sendLineCreateTicket(ticket);

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

    // If status is being changed to completed, update resolvedAt and send completion email
    if (updateTicketsDto.status === 'completed') {
      data.resolvedAt = new Date();

      // Get ticket details and creator email
      const ticket = await this.prisma.ticket.findUnique({
        where: { id },
        include: {
          events: {
            where: { type: 'CREATED' },
            include: {
              ticket: true
            }
          }
        }
      });

      this.lineService.sendLineUpdateTicket(ticket);

      if (ticket) {
        // Find the creator's user ID from the CREATED event
        const createdEvent = ticket.events.find(event => event.type === 'CREATED');
        if (createdEvent) {
          const creator = await this.prisma.user.findUnique({
            where: { id: createdEvent.createdBy }
          });

          if (creator) {
            // Send completion email to the ticket creator
            try {
              await WorkDoneMailer(
                this.emailService,
                ticket.id,
                ticket.code,
                ticket.title,
                creator.email,
                new Date()
              );
            } catch (error) {
              console.error('Failed to send work completion email:', error);
              // Don't fail the update if email fails
            }
          }
        }
      }
    }

    return await this.prisma.ticket.update({ data, where: { id } });
  }

  async delete(id: string, user: any): Promise<Ticket> {
    return this.prisma.ticket.delete({ where: { id } });
  }


