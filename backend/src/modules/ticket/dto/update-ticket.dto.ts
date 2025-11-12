import { PartialType } from "@nestjs/mapped-types";
import { CreateTicketDto } from "./create-ticket.dto";
import { IsString } from "class-validator";

export class UpdateTicketDto extends PartialType(CreateTicketDto) {
    @IsString()
    technicianId?: string;

    @IsString()
    updatedAt?: string;
 }