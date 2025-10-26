import { Module } from '@nestjs/common';
import { AttachmentModule } from './modules/attachment/attachment.modules';
import { PrismaModule } from './common/prisma.module';
import { TicketEventModule } from './modules/ticket_event/ticket_event.module';

@Module({
  imports: [
    PrismaModule,
    AttachmentModule,
    TicketEventModule
  ],
})
export class AppModule {}
