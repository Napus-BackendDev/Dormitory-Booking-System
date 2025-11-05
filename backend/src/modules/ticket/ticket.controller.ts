import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';


@Controller('ticket')
export class TicketController {
  constructor(private readonly ticketService: TicketService) { }

  @Get()
  findAll() {
    return this.ticketService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.ticketService.findOne(id);
  }

  @Post()
  create(@Body() createTicketsDto: CreateTicketDto) {
    return this.ticketService.create(createTicketsDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTicketsDto: UpdateTicketDto) {
    return this.ticketService.update(id, updateTicketsDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ticketService.delete(id);
  }
}
