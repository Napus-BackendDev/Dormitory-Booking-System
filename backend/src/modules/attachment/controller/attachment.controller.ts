import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { AttachmentService } from "../service/attachment.service";
import { CreateAttachmentDto } from "../dtos/create-attachment.dto";
import { UUID } from "crypto";
import { UpdateAttachmentDto } from "../dtos/update-attachment.dto";
import { TicketEvent } from "src/modules/ticket_event/entitys/ticket-event.entity";

@Controller("attachments")
export class AttachmentController {
    constructor(private attachmentService: AttachmentService) {}

    @Post()
    async createAttachment(@Body() createAttachmentDto: CreateAttachmentDto) {
        return this.attachmentService.create(createAttachmentDto);
    }
    @Get()
    async getAllAttachments() {
        return this.attachmentService.findAll();
    }
    @Get(":id")
    async getAttachmentById(@Param("id") id: UUID) {
        return this.attachmentService.findById(id);
    }
    @Put(":id")
    async updateAttachment(@Param("id") id: UUID, @Body() updateData: Partial<UpdateAttachmentDto>) {
        return this.attachmentService.update(id, updateData);
    }
    @Delete(":id")
    async deleteAttachment(@Param("id") id: UUID) {
        console.log("Deleting attachment with ID:", id);
        return this.attachmentService.delete(id);
    }
}   