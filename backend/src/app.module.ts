import { Module } from '@nestjs/common';
import { TicketsModule } from './modules/tickets/tickets.module';
import { PrismaModule } from './common/prisma.module';

@Module({
  imports: [PrismaModule, TicketsModule],
})
export class AppModule {}
