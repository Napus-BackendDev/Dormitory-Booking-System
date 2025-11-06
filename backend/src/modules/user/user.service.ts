import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/common/prisma.service";
import { UpdateAccessDto } from "./dtos/update.access.dto";

@Injectable()
export class UserService {
    

    constructor(private prismaService: PrismaService) {}

    getAllUsers() {
        return this.prismaService.user.findMany();
    }

    updateUserRole(userId: string, newRole: string) {
        const updatedUser= this.prismaService.user.update({
            where: { id: userId },
            data: { role: newRole }
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
    getAdminUser() {
        const adminUser= this.prismaService.user.findFirst({
            where: { role: 'ADMIN' }
        });
        return adminUser;
    }
    manageAccess(userId: string, updateAccessDto: UpdateAccessDto) {
        const { role} = updateAccessDto;
        const updates: any = {};
        if (role) {
            updates.role = role;
        }
        return this.prismaService.user.update({
            where: { id: userId },
            data: updates
        });
    }

}