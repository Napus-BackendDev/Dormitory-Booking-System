import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

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
  @UseGuards(AuthGuard)
  create(@Body() createTicketsDto: CreateTicketDto, @CurrentUser() user: any) {
    return this.ticketService.create(createTicketsDto, user);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(@Param('id') id: string, @Body() updateTicketsDto: UpdateTicketDto, @CurrentUser() user: any) {
    return this.ticketService.update(id, updateTicketsDto, user);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.ticketService.delete(id, user);
  }
}
