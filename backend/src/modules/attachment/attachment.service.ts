import { Injectable } from "@nestjs/common";
import { UUID } from "node:crypto";
import { Attachments } from '@prisma/client';
import { PrismaService } from "src/common/prisma.service";
import { CreateAttachmentDto } from "./dto/create-attachment.dto";
import { UpdateAttachmentDto } from "./dto/update-attachment.dto";

@Injectable()
export class AttachmentService {
    constructor(private prisma: PrismaService) { }

    async create(createAttachmentDto: CreateAttachmentDto): Promise<Attachments> {
        const attachment = await this.prisma.attachments.create({
            data: {
                ticketId: createAttachmentDto.ticketId,
                url: createAttachmentDto.url,
                type: createAttachmentDto.type
            }
        });
        return attachment;
    }

    async findAll(): Promise<Attachments[]> {
        return this.prisma.attachments.findMany();
    }

    async findById(id: UUID): Promise<Attachments> {
        const attachment = await this.prisma.attachments.findUnique({
            where: { id }
        });
        if (!attachment) {
            throw new Error('Attachment not found');
        }
        return attachment;
    }

    async delete(id: UUID): Promise<void> {
        await this.prisma.attachments.delete({
            where: { id }
        });
    }

    async update(id: UUID, updateData: Partial<UpdateAttachmentDto>): Promise<Attachments> {
        return this.prisma.attachments.update({
            where: { id },
            data: updateData
        });
    }
}