import { TicketEventType } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateTicketEventDto {
    @IsString()
    ticketId: string;

    @IsString()
    @IsEnum(TicketEventType)
    type: TicketEventType;

    @IsString()
    @IsOptional()
    note?: string;
}