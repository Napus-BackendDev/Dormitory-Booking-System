import { IsOptional, IsString } from 'class-validator';

export class UpdateTicketEventDto {
    @IsString()
    @IsOptional()
    type?: string;

    @IsString()
    @IsOptional()
    note?: string;
}