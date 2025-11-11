import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { PrismaModule } from './common/prisma.module';
import { TicketModule } from './modules/ticket/ticket.module';
import { SurveyModule } from './modules/survey/survey.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { RepairTypeModule } from './modules/repair_type/repairtype.module';
import { RoleModule } from './modules/role/role.module';
import { LocationModule } from './modules/location/location.module';
import { LineModule } from './modules/line/Line.module';
import { EmailModule } from './common/email/email.module';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    TicketModule,
    SurveyModule,
    UserModule,
    AuthModule,
    RepairTypeModule,
    RoleModule,
    LocationModule,
    LineModule,
    EmailModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
  ],
})
export class AppModule {}
