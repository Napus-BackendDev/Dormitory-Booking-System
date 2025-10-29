import { Module } from '@nestjs/common';
import { PrismaModule } from './common/prisma.module';
import { TicketsModule } from './modules/tickets/tickets.module';
import { AttachmentModule } from './modules/attachment/attachment.module';
import { TicketEventModule } from './modules/ticket_event/ticket_event.module';

@Module({
  imports: [
    PrismaModule,
    AttachmentModule,
    TicketEventModule,
    TicketsModule,
  ],
})
export class AppModule { }
