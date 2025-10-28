import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketsDto } from './dto/create-tickets.dto';
import { UpdateTicketsDto } from './dto/update-tickets.dto';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) { }

  @Get()
  findAll() {
    return this.ticketsService.findAll();
  }

  @Post()
  create(@Body() createTicketsDto: CreateTicketsDto) {
    return this.ticketsService.create(createTicketsDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTicketsDto: UpdateTicketsDto) {
    return this.ticketsService.update(id, updateTicketsDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ticketsService.delete(id);
  }
}
