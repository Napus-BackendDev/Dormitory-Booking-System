import { IsString } from "class-validator";

export class UpdateAccessDto {
    @IsString()
    role?: string;
}