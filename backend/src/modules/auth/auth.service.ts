import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, Inject } from "@nestjs/common";
import { PrismaService } from "src/common/prisma.service";
import { RegisterDto } from "./dtos/register.dto";
import * as bcrypt from 'bcrypt';
import { Role } from "../../common/enums/role.enum";
import { LoginDto } from "./dtos/login.dto";
import { JwtService } from "@nestjs/jwt";
import { Redis } from 'ioredis';

@Injectable()
export class AuthService {
    
    constructor(
        private prismaService: PrismaService, 
        private jwtService: JwtService,
        @Inject('REDIS_CLIENT') private redisClient: Redis
    ) {}

    async register(registerDto: RegisterDto) {
        const { email, password, role, name } = registerDto;
        
        // Check if user exists
        const existingUser = await this.prismaService.user.findUnique({
            where: { email }
        });
        
        if (existingUser) {
            throw new ConflictException('User already exists');
        }

        // Validate role 
        if (role && !Object.values(Role).includes(role)) {
            throw new BadRequestException(`Invalid role. Must be one of: ${Object.values(Role).join(', ')}`);
        }

        try {
            // Hash password
            const hashedPassword = await bcrypt.hash(password, 12);
            
            // Create user with validated role
            const user = await this.prismaService.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    role: role || Role.USER,
                    name,
                }
            });

            return {
                message: 'User registered successfully',
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                    name: user.name
                }
            };
        } catch (error) {
            throw new InternalServerErrorException('Error creating user');
        }
    }

    async login(data:LoginDto): Promise<{ access_token: string, user: any }> {
        const { email, password } = data;
        const NotUser = await this.prismaService.user.findUnique({
            where: { email }
        });
        if (!NotUser) {
            throw new BadRequestException('Invalid email or password Or Not have account');
        }

        const passwordMatch = await bcrypt.compare(password, NotUser.password);
        if (!passwordMatch) {
            throw new BadRequestException('Invalid password');
        }
        const payload = { email: NotUser.email, sub: NotUser.id, role: NotUser.role };
        const access_token = await this.jwtService.signAsync(payload);
        return {
            access_token: access_token,
            user: {
                id: NotUser.id,
                email: NotUser.email,
                name: NotUser.name,
                role: NotUser.role
            }
        };
    }
    async getProfile(userId: string) {
        const user = await this.prismaService.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true
            }
        });

        if (!user) {
            throw new BadRequestException('User not found');
        }

        return user;
    }
    async logout(token: string) {
        const decoded = this.jwtService.decode(token) as { [key: string]: any };
        if (!decoded || !decoded.exp) {
            throw new BadRequestException('Invalid token');
        }

        const currentTime = Math.floor(Date.now() / 1000);
        if (decoded.exp < currentTime) {
            throw new BadRequestException('Token already expired');
        }

        // Calculate remaining time until token expires (in seconds)
        const expiresIn = decoded.exp - currentTime;

        if (expiresIn > 0) {
            // Store token in Redis blacklist with expiration
            await this.redisClient.setex(`blacklist:${token}`, expiresIn, 'true');
        }

        return {
            message: 'Logged out successfully'
        };
    }


}
