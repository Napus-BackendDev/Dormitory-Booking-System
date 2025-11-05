import { Module } from '@nestjs/common';
import { PrismaModule } from './common/prisma.module';
import { TicketModule } from './modules/ticket/ticket.module';
import { AttachmentModule } from './modules/attachment/attachment.module';
import { TicketEventModule } from './modules/ticket_event/ticket_event.module';
import { SurveyModule } from './modules/survey/survey.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    PrismaModule,
    AttachmentModule,
    TicketEventModule,
    TicketModule,
    SurveyModule,
    UserModule,
    AuthModule
  ],
})
export class AppModule { }
