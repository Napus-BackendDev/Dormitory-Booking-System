import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { AuthGuard } from '../auth/auth.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { imageUploadOptions } from 'src/common/interceptors/upload-options';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RolesGuard } from 'src/common/author/roles.guard';
import { Roles } from 'src/common/author/role.decorator';

@UseGuards(AuthGuard, RolesGuard)
@Controller('ticket')
@UseGuards(AuthGuard)
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
  @Roles("USER")
  @Post()
  create(@Body() createTicketsDto: CreateTicketDto, @CurrentUser() user: any) {
    return this.ticketService.create(createTicketsDto, user);
  }
  @Roles("USER", "STAFF")
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTicketsDto: UpdateTicketDto, @CurrentUser() user: any) {
    return this.ticketService.update(id, updateTicketsDto, user);
  }

  @Delete(':id')
  @Roles("ADMIN")
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.ticketService.delete(id, user);
  }
}
