import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { Prisma } from "generated/prisma/browser";
import { PrismaService } from "src/common/prisma.service";
import { AuthModule } from "../auth/auth.module";

@Module({
    imports: [AuthModule],
    controllers: [UserController],
    providers: [UserService, PrismaService],
})
export class UserModule {}