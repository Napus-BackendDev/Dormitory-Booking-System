import { Injectable } from "@nestjs/common";
import { Attachment } from "../entitys/attachment.entity";
import { UUID } from "node:crypto";
import { CreateAttachmentDto } from "../dtos/create-attachment.dto";
import { UpdateAttachmentDto } from "../dtos/update-attachment.dto";
import { PrismaService } from "../../../common/services/prisma.service";

@Injectable()
export class AttachmentService {
    constructor(private prisma: PrismaService){}
    async create(createAttachmentDto: CreateAttachmentDto): Promise<Attachment> {
        if(createAttachmentDto.ticketId) {
            throw new Error('Invalid ticket ID');
        }
        const attachment = await this.prisma.attachments.create({
            data: {
                ticketId: createAttachmentDto.ticketId,
                url: createAttachmentDto.url,
                type: createAttachmentDto.type
            }
        });
        return attachment;
    }    async findAll(): Promise<Attachment[]> {
        return this.prisma.attachments.findMany();
    }

    async findById(id: UUID): Promise<Attachment> {
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

    async update(id: UUID, updateData: Partial<UpdateAttachmentDto>): Promise<Attachment> {
        if(!updateData.ticketId) throw new Error('Not have ID');
        return this.prisma.attachments.update({ 
            where: { id }, 
            data: updateData 
        });
    }

}