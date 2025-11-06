import { Body, Controller, Get, Post, UseGuards, Request, Headers, BadRequestException, Res } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dtos/register.dto";
import { LoginDto } from "./dtos/login.dto";
import { AuthGuard } from "./auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { Response } from 'express';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {}
    
    @Post('register')
    async register(@Body() data: RegisterDto) {
        return this.authService.register(data);
    }
    @Post('login')
    async login(@Body() data: LoginDto, @Res({ passthrough: true }) response: Response) {
        const result = await this.authService.login(data);

        // Set JWT token in HTTP-only cookie
        response.cookie('access_token', result.access_token, {
            httpOnly: true, // Prevents JavaScript access (XSS protection)
            secure: process.env.NODE_ENV === 'production', // HTTPS only in production
            sameSite: 'strict', // CSRF protection
            maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
        });

        return {
            message: 'Login successful',
            user: result.user
        };
    }    @Get('profile')
    @UseGuards(AuthGuard)
    async getProfile(@CurrentUser() user: any) {
        return this.authService.getProfile(user.sub);
    }
    @Post('logout')
    @UseGuards(AuthGuard)
    async logout(@CurrentUser() user: any, @Res({ passthrough: true }) response: Response, @Headers('authorization') authHeader: string, @Request() req: any) {
        // Extract token from header or cookie
        const token = authHeader?.replace('Bearer ', '') || req.cookies?.access_token;

        if (token) {
            await this.authService.logout(token);
        }

        // Clear the JWT token cookie
        response.clearCookie('access_token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });

        return {
            message: 'Logged out successfully'
        };
    }

}