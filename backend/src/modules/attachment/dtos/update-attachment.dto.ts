import { IsString, IsUUID } from "class-validator";
import { UUID } from "node:crypto";

export class UpdateAttachmentDto {
    @IsString()
    @IsUUID()
    id: UUID;

    @IsString()
    @IsUUID()
    ticketId: UUID;

    @IsString()
    url: string;

    @IsString()
    type: string;
}