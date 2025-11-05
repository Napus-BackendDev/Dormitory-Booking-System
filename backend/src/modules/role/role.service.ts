import { Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from 'src/common/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RoleService {
  constructor(private prisma: PrismaService) { }

  async findAll() {
    return this.prisma.role.findMany();
  }

  async findOne(id: string): Promise<Role | null> {
    return this.prisma.role.findUnique({ where: { id } });
  }

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    return this.prisma.role.create({ data: createRoleDto });
  }

  async update(id: string, updateRoleDto: UpdateRoleDto): Promise<Role> {
    return this.prisma.role.update({ data: updateRoleDto, where: { id } });
  }

  async delete(id: string): Promise<Role> {
    return this.prisma.role.delete({ where: { id } });
  }
}
