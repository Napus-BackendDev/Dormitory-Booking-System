import { PartialType } from "@nestjs/mapped-types";
import { CreateTicketsDto } from "./create-tickets.dto";

export class UpdateTicketsDto extends PartialType(CreateTicketsDto) { }