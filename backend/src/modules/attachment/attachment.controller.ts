import { Body, Controller, Delete, Get, Param, Post, Patch } from "@nestjs/common";
import { UUID } from "crypto";
import { CreateAttachmentDto } from "./dto/create-attachment.dto";
import { UpdateAttachmentDto } from "./dto/update-attachment.dto";
import { AttachmentService } from "./attachment.service";

@Controller("attachment")
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
    @Patch(":id")
    async updateAttachment(@Param("id") id: UUID, @Body() updateData: Partial<UpdateAttachmentDto>) {
        return this.attachmentService.update(id, updateData);
    }
    @Delete(":id")
    async deleteAttachment(@Param("id") id: UUID) {
        console.log("Deleting attachment with ID:", id);
        return this.attachmentService.delete(id);
    }
}   