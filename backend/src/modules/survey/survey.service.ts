import { Injectable } from '@nestjs/common';
import { CreateSurveyDto } from './dto/create-survey.dto';
import { UpdateSurveyDto } from './dto/update-survey.dto';
import { PrismaService } from 'src/common/prisma.service';
import { Survey } from '@prisma/client';

@Injectable()
export class SurveyService {
  constructor(private prisma: PrismaService) { }

  async findAll() {
    return this.prisma.survey.findMany();
  }

  async findOne(id: string): Promise<Survey | null> {
    return this.prisma.survey.findUnique({ where: { id } });
  }

  async create(createSurveyDto: CreateSurveyDto): Promise<Survey> {
    return this.prisma.survey.create({ data: createSurveyDto });
  }

  async update(id: string, updateSurveysDto: UpdateSurveyDto): Promise<Survey> {
    return this.prisma.survey.update({ data: updateSurveysDto, where: { id } });
  }

  async delete(id: string): Promise<Survey> {
    return this.prisma.survey.delete({ where: { id } });
  }
}
