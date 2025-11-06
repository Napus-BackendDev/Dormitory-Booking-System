import { IsString, IsDateString, IsIn } from 'class-validator';

export class CreateTicketDto {
  @IsString()
  code: string;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  status: string;

  @IsIn(['P1', 'P2', 'P3', 'P4'])
  priority: 'P1' | 'P2' | 'P3' | 'P4';

  @IsDateString()
  dueAt: Date;
}