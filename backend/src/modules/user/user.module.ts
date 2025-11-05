import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { Prisma } from "generated/prisma/browser";
import { PrismaService } from "src/common/prisma.service";
import { AuthModule } from "../auth/auth.module";
import { RolesGuard } from "src/common/author/roles.guard";
import { Reflector } from "@nestjs/core";

@Module({
    imports: [AuthModule],
    controllers: [UserController],
    providers: [UserService, PrismaService, RolesGuard, Reflector],
})
export class UserModule {}