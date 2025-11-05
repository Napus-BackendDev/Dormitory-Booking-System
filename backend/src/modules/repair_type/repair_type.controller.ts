import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { RepairTypeService } from './repairtype.service';
import { CreateRepairTypeDto } from './dto/create-repairtype.dto';
import { UpdateRepairTypeDto } from './dto/update-repairtype.dto';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from 'src/common/author/roles.guard';
import { Roles } from 'src/common/author/role.decorator';

@Controller('repairtype')
@UseGuards(AuthGuard, RolesGuard)
export class RepairTypeController {
  constructor(private readonly repairtypeService: RepairTypeService) { }

  @Get()
  findAll() {
    return this.repairtypeService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.repairtypeService.findOne(id);
  }

  @Post()
  @Roles('ADMIN')
  create(@Body() createRepairTypeDto: CreateRepairTypeDto) {
    return this.repairtypeService.create(createRepairTypeDto);
  }

  @Patch(':id')
  @Roles('ADMIN')
  update(@Param('id') id: string, @Body() updateRepairTypeDto: UpdateRepairTypeDto) {
    return this.repairtypeService.update(id, updateRepairTypeDto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.repairtypeService.delete(id);
  }
}
