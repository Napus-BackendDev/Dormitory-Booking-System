import { IsString, IsDateString, IsEnum } from 'class-validator';
import { TicketPriority, TicketStatus } from '@prisma/client';

export class CreateTicketDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsEnum(TicketStatus)
  status: TicketStatus;

  @IsEnum(TicketPriority)
  priority: TicketPriority;

  @IsDateString()
  responseDueAt : Date;

  @IsDateString()
  resolveDueAt : Date;

  @IsString()
  userId: string;
}