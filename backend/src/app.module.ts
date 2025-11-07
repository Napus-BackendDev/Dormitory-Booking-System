import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { PrismaModule } from './common/prisma.module';
import { TicketModule } from './modules/ticket/ticket.module';
import { AttachmentModule } from './modules/attachment/attachment.module';
import { TicketEventModule } from './modules/ticket_event/ticket_event.module';
import { SurveyModule } from './modules/survey/survey.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { RepairTypeModule } from './modules/repair_type/repairtype.module';
import { RoleModule } from './modules/role/role.module';
import { LocationModule } from './modules/location/location.module';
import { LineModule } from './modules/line/Line.module';
import { join } from 'path';

@Module({
  imports: [
    PrismaModule,
    AttachmentModule,
    TicketEventModule,
    TicketModule,
    SurveyModule,
    UserModule,
    AuthModule,
    RepairTypeModule,
    RoleModule,
    LocationModule,
    LineModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
  ],
})
export class AppModule {}
