import { Body, Controller, Get, Post, UseGuards, Request } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dtos/register.dto";
import { LoginDto } from "./dtos/login.dto";
import { AuthGuard } from "./auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {}
    
    @Post('register')
    async register(@Body() data: RegisterDto) {
        return this.authService.register(data);
    }
    @Post('login')
    async login(@Body() data: LoginDto) {
        return this.authService.login(data);
    }

    @Get('profile')
    @UseGuards(AuthGuard)
    async getProfile(@CurrentUser() user: any) {
        return this.authService.getProfile(user.sub);
    }

}