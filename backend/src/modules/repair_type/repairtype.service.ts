import { Injectable } from '@nestjs/common';
import { RepairType } from '@prisma/client';
import { PrismaService } from 'src/common/prisma.service';
import { CreateRepairTypeDto } from './dto/create-repairtype.dto';
import { UpdateRepairTypeDto } from './dto/update-repairtype.dto';

@Injectable()
export class RepairTypeService {
  constructor(private prisma: PrismaService) { }

  async findAll() {
    return this.prisma.repairType.findMany();
  }

  async findOne(id: string): Promise<RepairType | null> {
    return this.prisma.repairType.findUnique({ where: { id } });
  }

  async create(createRepairTypeDto: CreateRepairTypeDto): Promise<RepairType> {
    return this.prisma.repairType.create({ data: createRepairTypeDto });
  }

  async update(id: string, updateRepairTypeDto: UpdateRepairTypeDto): Promise<RepairType> {
    return this.prisma.repairType.update({ data: updateRepairTypeDto, where: { id } });
  }

  async delete(id: string): Promise<RepairType> {
    return this.prisma.repairType.delete({ where: { id } });
  }
}
