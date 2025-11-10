import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { SurveyService } from './survey.service';
import { CreateSurveyDto } from './dto/create-survey.dto';
import { UpdateSurveyDto } from './dto/update-survey.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('survey')
@UseGuards(AuthGuard)
export class SurveyController {
  constructor(private readonly surveyService: SurveyService) { }

  @Get()
  findAll() {
    return this.surveyService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.surveyService.findOne(id);
  }

  @Post()
  create(@Body() createSurveyDto: CreateSurveyDto) {
    return this.surveyService.create(createSurveyDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSurveyDto: UpdateSurveyDto) {
    return this.surveyService.update(id, updateSurveyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.surveyService.delete(id);
  }
}
