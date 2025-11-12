import { Injectable } from '@nestjs/common';
import { Location } from '@prisma/client';
import { PrismaService } from 'src/common/prisma.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';

@Injectable()
export class LocationService {
  constructor(private prisma: PrismaService) { }

  async findAll() {
    return this.prisma.location.findMany({ take: 20, skip: 0 });
  }

  async findOne(id: string): Promise<Location | null> {
    return this.prisma.location.findUnique({ where: { id } });
  }

  async create(createLocationDto: CreateLocationDto): Promise<Location> {
    return this.prisma.location.create({ data: createLocationDto });
  }

  async update(id: string, updateLocationDto: UpdateLocationDto): Promise<Location> {
    return this.prisma.location.update({ data: updateLocationDto, where: { id } });
  }

  async delete(id: string): Promise<Location> {
    return this.prisma.location.delete({ where: { id } });
  }
}
