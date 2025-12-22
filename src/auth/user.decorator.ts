import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// Obtiene el id del usuario (el de auth0 que viene en el token)
export const User = createParamDecorator(
  (data: keyof any, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return data ? user[data] : user;
  },
);
