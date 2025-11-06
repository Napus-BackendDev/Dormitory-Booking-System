import { PartialType } from '@nestjs/mapped-types';
import { CreateTicketEventDto } from './create-ticket_event.dto';

export class UpdateTicketEventDto extends PartialType(CreateTicketEventDto) { }