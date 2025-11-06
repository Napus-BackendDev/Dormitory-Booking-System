import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from 'src/common/author/roles.guard';
import { Roles } from 'src/common/author/role.decorator';

@Controller('role')
@UseGuards(AuthGuard, RolesGuard)
//@Roles('ADMIN')
export class RoleController {
  constructor(private readonly roleService: RoleService) { }

  @Get()
  findAll() {
    return this.roleService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.roleService.findOne(id);
  }

  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(id, updateRoleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roleService.delete(id);
  }
}
