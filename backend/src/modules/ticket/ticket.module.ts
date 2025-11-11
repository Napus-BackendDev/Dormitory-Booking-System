import { Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { EmailModule } from 'src/common/email/email.module';
import { LineModule } from '../line/Line.module';
import { AuthModule } from '../auth/auth.module'; 

@Module({
  imports: [AuthModule,LineModule, EmailModule],
  controllers: [TicketController],
  providers: [TicketService],
})
export class TicketModule {}

