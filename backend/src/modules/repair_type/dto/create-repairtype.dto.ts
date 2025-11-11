import { Optional } from '@nestjs/common';
import { IsString } from 'class-validator';

export class CreateRepairTypeDto {
  @IsString()
  name: string;

  @IsString()
  @Optional()
  description?: string;
  
  @IsString()
  @Optional()
  color?: string
}