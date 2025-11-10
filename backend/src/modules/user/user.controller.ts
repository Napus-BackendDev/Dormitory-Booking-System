import { Body, Controller, Delete, Get, Param, Put, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { AuthGuard } from "../auth/auth.guard";
import { Roles } from "src/common/author/role.decorator";
import { Role } from "src/common/enums/role.enum";
import { RolesGuard } from "src/common/author/roles.guard";
import { UpdateAccessDto } from "./dtos/update.access.dto";


@Controller('user')
@UseGuards(AuthGuard, RolesGuard)
export class UserController {
    constructor(private userService: UserService) { }


    @Get()
    @Roles(Role.USER,Role.STAFF, Role.ADMIN)
    async getAllUsers() {
        return this.userService.getAllUsers();
    }

    @Get('admin-user')
    @Roles(Role.ADMIN)
    async getAdminUser() {
        return this.userService.getAdminUser();
    }

    @Delete('delete-all')
    @Roles(Role.ADMIN)
    async deleteAllUsers() {
        return this.userService.deleteAllUsers();
    }

    
    
    @Put('/manage-access/:id')
    @Roles(Role.USER)
    async manageAccess(@Param('id') id: string, @Body() updateAccessDto: UpdateAccessDto) {
        return this.userService.manageAccess(id, updateAccessDto);
    }

}