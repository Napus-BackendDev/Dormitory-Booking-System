import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { LocationService } from './location.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from 'src/common/author/roles.guard';
import { Roles } from 'src/common/author/role.decorator';

@Controller('location')
@UseGuards(AuthGuard, RolesGuard)
export class LocationController {
  constructor(private readonly locationService: LocationService) { }

  @Get()
  findAll() {
    return this.locationService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.locationService.findOne(id);
  }

  @Post()
  @Roles('ADMIN')
  create(@Body() createLocationDto: CreateLocationDto) {
    return this.locationService.create(createLocationDto);
  }

  @Patch(':id')
  @Roles('ADMIN')
  update(@Param('id') id: string, @Body() updateLocationDto: UpdateLocationDto) {
    return this.locationService.update(id, updateLocationDto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.locationService.delete(id);
  }
}
