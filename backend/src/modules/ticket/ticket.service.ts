import { Injectable } from '@nestjs/common';
import { Ticket, User } from '@prisma/client';
import { PrismaService } from 'src/common/prisma.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { SLA_CONSTANTS } from 'src/common/constants/sla.constant';
import { RecieveTicketMailer } from 'src/common/email/mail-temp/recieve.confirm';
// import { EmailService } from 'src/common/email/email.service';
import { LineService } from '../line/Line.service';
import { generateImageUrl } from '../../common/utils/utils';

@Injectable()
export class TicketService {
  constructor(
    private prisma: PrismaService,
    private lineService: LineService,
    // private emailService: EmailService
  ) { }

  private computeSLA(priority: 'P1' | 'P2' | 'P3' | 'P4', now = new Date()) {
    const responseMs = SLA_CONSTANTS.response[priority];
    const resolveMs = SLA_CONSTANTS.resolve[priority];

    return {
      responseDueAt: now.getTime() + responseMs,
      resolveDueAt: now.getTime() + resolveMs,
    };
  }

  async findAll() {
    return this.prisma.ticket.findMany({take: 50, skip: 0});
  }

  async findOne(id: string): Promise<Ticket | null> {
    return this.prisma.ticket.findUnique({ where: { id } });
  }


  async create(createTicketDto: CreateTicketDto, photos: Express.Multer.File[], user: User): Promise<Ticket> {
    // try {
    //   await RecieveTicketMailer(this.emailService, user.email);
    // } catch (error) {
    //   console.error('Failed to send ticket confirmation email:', error);
    // }

    const photoUrls = photos.map(file => generateImageUrl(file.filename));

    const { responseDueAt, resolveDueAt } = this.computeSLA(createTicketDto.priority);
    const ticket = await this.prisma.ticket.create({
      data: {
        ...createTicketDto,
        status: createTicketDto.status,
        photo: photoUrls,
        createdAt: new Date(),
        responseDueAt: new Date(responseDueAt),
        resolveDueAt: new Date(resolveDueAt),
      },
    });

    this.lineService.sendLineCreateTicket(ticket);

    return ticket;
  }

  async update(id: string, updateTicketDto: UpdateTicketDto): Promise<Ticket> {
    // const data = {
    //   status: updateTicketsDto.status,
    //   TicketEvent: {
    //     create: {
    //       type: 'STATUS_UPDATED',
    //       createdBy: user.id, // Use user ID from JWT
    //     },
    //   },
    // };

    const { userId, technicianId, ...updatedData } = updateTicketDto;

    if (updateTicketDto.status === 'COMPLETED') {

      const ticket = await this.prisma.ticket.findUnique({
        where: { id },
      });

      if (ticket) {
        this.lineService.sendLineUpdateTicket(ticket);
      }
    }

    return await this.prisma.ticket.update({
      data: {
        ...updatedData,
        ...(technicianId ? { technician: { connect: { id: technicianId } } } : {})
      },
      where: { id }
    });
  }

  async delete(id: string): Promise<Ticket> {
    return this.prisma.ticket.delete({ where: { id } });
  }


}