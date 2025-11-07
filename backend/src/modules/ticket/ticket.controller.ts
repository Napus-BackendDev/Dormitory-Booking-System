import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { AuthGuard } from '../auth/auth.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { imageUploadOptions } from 'src/common/interceptors/upload-options';

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

  @Post()
  @UseInterceptors(FilesInterceptor('photo', 5, imageUploadOptions))
  create(@Body() createTicketsDto: CreateTicketDto, @UploadedFiles() photos: Express.Multer.File[]) {
    return this.ticketService.create(createTicketsDto, photos);
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
