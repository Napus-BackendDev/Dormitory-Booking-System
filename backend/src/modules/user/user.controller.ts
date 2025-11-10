import { Body, Controller, Delete, Get, Param, Put, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { AuthGuard } from "../auth/auth.guard";
import { Roles } from "src/common/author/role.decorator";
import { RolesGuard } from "src/common/author/roles.guard";
import { UpdateAccessDto } from "./dtos/update.access.dto";


@Controller('user')
@UseGuards(AuthGuard, RolesGuard)
export class UserController {
    constructor(private userService: UserService) { }


    @Get()
    async getAllUsers() {
        return this.userService.getAllUsers();
    }

    @Get('admin-user')
    @Roles("ADMIN")
    async getAdminUser() {
        return this.userService.getAdminUser();
    }

    @Delete('delete-all')
    @Roles("ADMIN")
    async deleteAllUsers() {
        return this.userService.deleteAllUsers();
    }
    
    @Put('/manage-access/:id')
    @Roles("USER")
    async manageAccess(@Param('id') id: string, @Body() updateAccessDto: UpdateAccessDto) {
        return this.userService.manageAccess(id, updateAccessDto);
    }

}