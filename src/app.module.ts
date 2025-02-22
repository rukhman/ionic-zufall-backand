import { Module } from '@nestjs/common';

import { ConfigModule } from './config.module';
import { TypeOrmModule } from './db/typeorm.module';
import { UserModule } from './entities/user/user.module';
import { EventModule } from './entities/event/event.module';
import { RoleModule } from './entities/role/role.module';
import { PermissionModule } from './entities/permission/permission.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './guards/auth/auth.guard';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [ConfigModule, TypeOrmModule, UserModule, EventModule, RoleModule, PermissionModule],
  providers: [
    JwtService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
