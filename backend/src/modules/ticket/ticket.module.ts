import { Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { AuthModule } from '../auth/auth.module';
import { EmailModule } from 'src/common/email/email.module';
import { RedisModule } from '../../common/redis/redis.module';

@Module({
  imports: [AuthModule, EmailModule, RedisModule],
  controllers: [TicketController],
  providers: [TicketService],
})
export class TicketModule {}

