import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { PrismaModule } from "../../common/prisma.module";
import { PrismaService } from "src/common/prisma.service";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { jwtConstants } from "src/common/constants/jwt.constant";
import { AuthGuard } from "./auth.guard";

@Module({
    imports: [PrismaModule,
        JwtModule.register({
            global: true,
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '1d' }, // 1 day expiration
        })],
    controllers: [AuthController],
    providers: [AuthService, PrismaService, AuthGuard],
    exports: [AuthService, AuthGuard]
})
export class AuthModule {}