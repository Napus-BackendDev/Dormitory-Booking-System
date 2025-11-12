import { Injectable } from "@nestjs/common";
import { UUID } from "node:crypto";
import { Attachment } from '@prisma/client';
import { PrismaService } from "src/common/prisma.service";
import { CreateAttachmentDto } from "./dto/create-attachment.dto";
import { UpdateAttachmentDto } from "./dto/update-attachment.dto";

@Injectable()
export class AttachmentService {
    constructor(private prisma: PrismaService) { }

    async create(createAttachmentDto: CreateAttachmentDto): Promise<Attachment> {
        const attachment = await this.prisma.attachment.create({
            data: {
                ticketId: createAttachmentDto.ticketId,
                url: createAttachmentDto.url,
                type: createAttachmentDto.type
            }
        });
        return attachment;
    }

    async findAll(): Promise<Attachment[]> {
        return this.prisma.attachment.findMany({ take: 50, skip: 0 });
    }

    async findById(id: UUID): Promise<Attachment> {
        const attachment = await this.prisma.attachment.findUnique({
            where: { id }
        });
        if (!attachment) {
            throw new Error('Attachment not found');
        }
        return attachment;
    }

    async delete(id: UUID): Promise<void> {
        await this.prisma.attachment.delete({
            where: { id }
        });
    }

    async update(id: UUID, updateData: Partial<UpdateAttachmentDto>): Promise<Attachment> {
        return this.prisma.attachment.update({
            where: { id },
            data: updateData
        });
    }
}