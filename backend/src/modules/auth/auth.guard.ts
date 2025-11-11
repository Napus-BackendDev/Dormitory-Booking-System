import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, Inject } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { jwtConstants } from "src/common/constants/jwt.constant";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private authService: AuthService, 
        private jwtService: JwtService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request) || this.extractTokenFromCookie(request);

        if (!token) {
            console.log('No token found in request (checked header and cookie)');
            throw new UnauthorizedException('No token provided');
        }

        try {

            const payload = await this.jwtService.verifyAsync(token, {
                secret: jwtConstants.secret
            });

            // Attach the decoded token payload to the request
            request['user'] = payload;
            console.log('Token verified successfully:', payload);
            return true;
        } catch (error) {
            console.error('Token verification failed:', error.message);
            throw new UnauthorizedException('Invalid token');
        }
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }

    private extractTokenFromCookie(request: Request): string | undefined {
        return request.cookies?.access_token;
    }
}
