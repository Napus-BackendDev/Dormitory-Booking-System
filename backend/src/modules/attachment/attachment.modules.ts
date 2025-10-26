import { Module } from "@nestjs/common";
import { AttachmentController } from "./controller/attachment.controller";
import { AttachmentService } from "./service/attachment.service";

@Module({
    controllers: [AttachmentController],
    providers: [AttachmentService],
})
export class AttachmentModule {}