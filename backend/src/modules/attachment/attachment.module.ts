import { Module } from "@nestjs/common";
import { AttachmentController } from "./attachment.controller";
import { AttachmentService } from "./attachment.service";
import { AuthGuard } from "../auth/auth.guard";
import { RolesGuard } from "src/common/author/roles.guard";
import { Reflector } from "@nestjs/core";
import { AuthModule } from "../auth/auth.module";
import { RedisModule } from "../../common/redis/redis.module";

@Module({
    imports: [AuthModule, RedisModule],
    controllers: [AttachmentController],
    providers: [AttachmentService,RolesGuard,Reflector],
})
export class AttachmentModule {}