import { IsObject } from 'class-validator';

export class CreateRoleDto {
  @IsObject()
  name: Record<string, string>;
}