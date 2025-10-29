import { Controller, Delete, Get, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { AuthGuard } from "../auth/auth.guard";
import { Param } from "@prisma/client/runtime/library";
import { UUID } from "crypto";


@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    @Get()
    async getAllUsers() {
        return this.userService.getAllUsers();
    }
    @Delete('/delete-all')
    async deleteAllUsers() {
        return this.userService.deleteAllUsers();
    }
}