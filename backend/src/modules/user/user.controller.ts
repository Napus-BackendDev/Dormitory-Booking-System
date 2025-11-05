import { Controller, Delete, Get, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { AuthGuard } from "../auth/auth.guard";
import { Roles } from "src/common/author/role.decorator";
import { Role } from "src/common/enums/role.enum";
import { RolesGuard } from "src/common/author/roles.guard";


@Controller('user')
@UseGuards(AuthGuard, RolesGuard)
export class UserController {
    constructor(private userService: UserService) {}


    @Get()
    @Roles(Role.USER)
    async getAllUsers() {
        return this.userService.getAllUsers();
    }

    @Delete('/delete-all')
    @Roles(Role.ADMIN)
    async deleteAllUsers() {
        return this.userService.deleteAllUsers();
    }

    @Get('/admin-user')
    @Roles(Role.ADMIN)
    async getAdminUser() {
        return this.userService.getAdminUser();
    }
}