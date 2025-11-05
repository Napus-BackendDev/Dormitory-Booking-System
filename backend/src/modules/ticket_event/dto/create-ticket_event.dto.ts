import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateTicketEventDto {
    @IsString()
    @IsUUID()
    ticketId: string;

    @IsString()
    @IsOptional()
    type?: string;

    @IsString()
    @IsOptional()
    note?: string;
}