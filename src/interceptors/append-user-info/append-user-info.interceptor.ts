import { CallHandler, ExecutionContext, Injectable, NestInterceptor, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class AppendUserInfoInterceptor implements NestInterceptor {
  constructor(private readonly jwtService: JwtService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    const { authorization }: any = request.headers;
    if (!authorization || authorization.trim() === '') {
      throw new UnauthorizedException('Please provide token');
    }
    const authToken = authorization.replace(/bearer/gim, '').trim();

    const user = this.jwtService.verify(authToken, { secret: process.env.APP_SECRET });
    request.me = user;
    return next.handle();
  }
}
