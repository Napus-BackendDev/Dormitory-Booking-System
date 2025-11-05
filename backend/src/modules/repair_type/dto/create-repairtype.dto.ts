import { IsString } from 'class-validator';

export class CreateRepairTypeDto {
  @IsString()
  name: string;
}