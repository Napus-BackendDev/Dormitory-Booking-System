import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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
import { EmailModule } from './common/email/email.module';
import { BullModule } from '@nestjs/bull';
import { SlaMonitorModule } from './modules/sla-monitor/sla.monitor.module';
import { RedisModule } from './common/redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
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
    EmailModule,
    RedisModule,
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
      }
    }),
    SlaMonitorModule,
  ],
})
export class AppModule { }
