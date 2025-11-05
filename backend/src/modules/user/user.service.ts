import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/common/prisma.service";

@Injectable()
export class UserService {
    getAdminUser() {
        const adminUser = this.prismaService.user.findFirst({
            where: {
                role: {
                    name: 'ADMIN'
                }
            }
        });
        return adminUser;
    }

    constructor(private prismaService: PrismaService) { }

    getAllUsers() {
        return this.prismaService.user.findMany();
    }

    updateUserRole(userId: string, newRole: string) {
        const updatedUser = this.prismaService.user.update({
            where: { id: userId },
            data: { name: newRole }
        });
        return updatedUser;
    }

    updateUserName(userId: string, newName: string) {
        const updatedUser = this.prismaService.user.update({
            where: { id: userId },
            data: { name: newName }
        });
        return updatedUser;
    }
    deleteAllUsers() {
        return this.prismaService.user.deleteMany();
    }

}