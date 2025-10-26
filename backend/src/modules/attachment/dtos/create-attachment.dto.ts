import { IsOptional, IsString, IsUUID } from "class-validator";

export class CreateAttachmentDto {
    @IsString()
    @IsUUID()
    ticketId: string;

    @IsString()
    @IsOptional()
    url?: string;

    @IsString()
    @IsOptional()
    type?: string;
}