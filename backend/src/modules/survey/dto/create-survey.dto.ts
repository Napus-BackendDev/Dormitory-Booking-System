import { IsNumber, IsString } from 'class-validator';

export class CreateSurveyDto {
    @IsString()
    ticketId: string;

    @IsNumber()
    score: number;
    
    @IsString()
    comment?: string;
}
