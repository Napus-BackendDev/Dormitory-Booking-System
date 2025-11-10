import { AttachmentType } from "@prisma/client";
import { IsEnum, IsString } from "class-validator";

export class CreateAttachmentDto {
    @IsString()
    ticketId: string;

    @IsString()
    url: string;

    @IsEnum(AttachmentType)
    type: AttachmentType;
}