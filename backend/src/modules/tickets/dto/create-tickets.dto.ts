import { IsString, IsDateString } from 'class-validator';

export class CreateTicketsDto {
  @IsString()
  code: string;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  status: string;

  @IsString()
  priority: string;

  @IsDateString()
  dueAt: Date;
}