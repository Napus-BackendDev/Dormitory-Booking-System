import { IsEnum } from "class-validator";
import { Role } from "src/common/enums/role.enum";

export class UpdateAccessDto {
    @IsEnum(Role)
    role?: Role;
}