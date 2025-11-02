import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { ROLE_KEY } from "./role.decorator";
import { Role } from "../enums/role.enum";
import { Reflector } from "@nestjs/core";

@Injectable()
export class RolesGuard implements CanActivate{
    constructor(private reflector: Reflector) {}
    canActivate(context: ExecutionContext): boolean {
       const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLE_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredRoles) {
            return true;
        }
        const { user } = context.switchToHttp().getRequest();
        if (!user) {
            return false;
        }
        // Check if user has the required role (our JWT payload has 'role' not 'roles')
        return requiredRoles.some((role) => user.role === role);
    }
}