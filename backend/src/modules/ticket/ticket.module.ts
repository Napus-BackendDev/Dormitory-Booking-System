import { Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { LineModule } from '../line/Line.module';

@Module({
  imports: [LineModule],
  controllers: [TicketController],
  providers: [TicketService],
})
export class TicketModule {}

