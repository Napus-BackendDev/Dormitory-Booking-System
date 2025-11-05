import { BadRequestException, ConflictException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { PrismaService } from "src/common/prisma.service";
import { RegisterDto } from "./dtos/register.dto";
import * as bcrypt from 'bcrypt';
import { Role } from "../../common/enums/role.enum";
import { LoginDto } from "./dtos/login.dto";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
    
    constructor(private prismaService: PrismaService, private jwtService: JwtService) {}

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

    async login(data:LoginDto): Promise<{ access_token: string }> {
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
        return {
            access_token: await this.jwtService.signAsync(payload)
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
                // Add other fields you want to include, but exclude password
            }
        });

        if (!user) {
            throw new BadRequestException('User not found');
        }

        return user;
    }


}
