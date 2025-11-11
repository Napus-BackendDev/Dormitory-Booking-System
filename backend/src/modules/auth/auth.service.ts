import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, Inject } from "@nestjs/common";
import { PrismaService } from "src/common/prisma.service";
import { RegisterDto } from "./dtos/register.dto";
import * as bcrypt from 'bcrypt';
import { LoginDto } from "./dtos/login.dto";
import { JwtService } from "@nestjs/jwt";
import { Redis } from 'ioredis';

@Injectable()
export class AuthService {
    
    constructor(
        private prismaService: PrismaService, 
        private jwtService: JwtService,
    ) { }

    async register(registerDto: RegisterDto) {
        const { email, password, role, name } = registerDto;

        // Check if user exists
        const existingUser = await this.prismaService.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            throw new ConflictException('User already exists');
        }

        // Find role from database 
        const userRole = await this.prismaService.role.findUnique({
            where: { name: role || 'USER' },
        });

        if (!userRole) {
            throw new BadRequestException(`Role '${role}' does not exist in database`);
        }

        try {
            // Hash password
            const hashedPassword = await bcrypt.hash(password, 12);

            // Create user with validatepasswordd role
            const user = await this.prismaService.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    role: { connect: { id: userRole.id } },
                    name,
                },
                include: { role: true },
            });

            return {
                message: 'User registered successfully',
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role?.name,
                    name: user.name
                }
            };
        } catch (error) {
            throw new InternalServerErrorException('Error creating user');
        }
    }

    async login(data:LoginDto): Promise<{ access_token: string, user: any }> {
        const { email, password } = data;
        const user = await this.prismaService.user.findUnique({
            where: { email },
            include: { role: true },
        });
        if (!user) {
            throw new BadRequestException('Invalid email or password Or Not have account');
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            throw new BadRequestException('Invalid password');
        }
        // Use the found user as payload
        const payload = { email: user.email, sub: user.id, role: user.role?.name };
        const access_token = await this.jwtService.signAsync(payload);
        return {
            access_token: access_token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role?.name
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

        return {
            message: 'Logged out successfully'
        };
    }
}
