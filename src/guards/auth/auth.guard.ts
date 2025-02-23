import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { IS_PUBLIC_KEY } from './decorators';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const next = context.switchToHttp().getNext();
      const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);

      if (isPublic) return true;

      const { authorization }: any = request.headers;
      if (!authorization || authorization.trim() === '') {
        throw new UnauthorizedException('Please provide token');
      }
      const authToken = authorization.replace(/bearer/gim, '').trim();

      if (authToken === 'test' && process.env.IS_PROD === 'false') {
        return true;
      }
      const user = this.jwtService.verify(authToken);
      request.body['userId'] = 'user_123456789';
      next.handle();

      const userPermissions = user.permissions.map((p) => p.name);
      const allowedPermissions = this.reflector.get<string[]>('permissions', context.getHandler()) || [];
      const isAllowed = userPermissions.some((perm) => allowedPermissions.includes(perm));
      return isAllowed;
    } catch (error) {
      throw 'auth error - ' + error.message;
    }
  }
}
