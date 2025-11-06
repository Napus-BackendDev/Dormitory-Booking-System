import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RolesGuard } from 'src/common/author/roles.guard';
import { Role } from 'src/common/enums/role.enum';
import { Roles } from 'src/common/author/role.decorator';

@UseGuards(AuthGuard, RolesGuard)
@Controller('ticket')
export class TicketController {
  constructor(private readonly ticketService: TicketService) { }

  @Get()
  @Roles(Role.ADMIN)
  findAll() {
    return this.ticketService.findAll();
  }
  @Roles(Role.STAFF, Role.ADMIN)
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.ticketService.findOne(id);
  }
  @Roles(Role.USER)
  @Post()
  create(@Body() createTicketsDto: CreateTicketDto, @CurrentUser() user: any) {
    return this.ticketService.create(createTicketsDto, user);
  }
  @Roles(Role.USER, Role.STAFF)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTicketsDto: UpdateTicketDto, @CurrentUser() user: any) {
    return this.ticketService.update(id, updateTicketsDto, user);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.ticketService.delete(id, user);
  }
}
