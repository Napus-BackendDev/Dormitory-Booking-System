import { BadRequestException, ConflictException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { PrismaService } from "src/common/prisma.service";
import { RegisterDto } from "./dtos/register.dto";
import * as bcrypt from 'bcrypt';
import { LoginDto } from "./dtos/login.dto";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
    constructor(private prismaService: PrismaService, private jwtService: JwtService) { }

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

    async login(data: LoginDto): Promise<{ access_token: string }> {
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
        const payload = {
            email: user.email,
            sub: user.id,
            role: user.role?.name
        };

        return {
            access_token: await this.jwtService.signAsync(payload)
        };
    }


}
