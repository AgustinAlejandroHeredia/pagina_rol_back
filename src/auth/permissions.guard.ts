import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { PERMISSIONS_KEY } from "./permissions.decorator";

@Injectable()
export class PermissionGuard implements CanActivate {

    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
            PERMISSIONS_KEY,
            [context.getHandler(), context.getClass()]
        )

        if(!requiredPermissions){
            return true
        }

        const request = context.switchToHttp().getRequest()
        const user = request.user

        const userPermissions: string[] = user?.permissions ?? []

        return requiredPermissions.every((permission) => userPermissions.includes(permission))
    }
}