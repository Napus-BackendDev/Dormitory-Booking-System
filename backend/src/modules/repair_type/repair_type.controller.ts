import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RepairTypeService } from './repairtype.service';
import { CreateRepairTypeDto } from './dto/create-repairtype.dto';
import { UpdateRepairTypeDto } from './dto/update-repairtype.dto';

@Controller('repairtype')
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
  create(@Body() createRepairTypeDto: CreateRepairTypeDto) {
    return this.repairtypeService.create(createRepairTypeDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRepairTypeDto: UpdateRepairTypeDto) {
    return this.repairtypeService.update(id, updateRepairTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.repairtypeService.delete(id);
  }
}
