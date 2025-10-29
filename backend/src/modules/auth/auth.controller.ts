import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dtos/register.dto";
import { LoginDto } from "./dtos/login.dto";
import { AuthGuard } from "./auth.guard";

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

}