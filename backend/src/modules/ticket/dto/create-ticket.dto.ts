import { IsString, IsDateString, IsEnum, IsIn } from 'class-validator';
import { TicketPriority } from '@prisma/client';

export class CreateTicketDto {
  @IsString()
  code: string;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  status: string;

  @IsEnum(TicketPriority)
  priority: TicketPriority;

  @IsDateString()
  dueAt: Date;
}