import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtModule } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';
import { User } from './entities/user.entity';
import { Role } from '../role/entities/role.entity';
import { Permission } from '../permission/entities/permission.entity';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([User, Role, Permission]),
    JwtModule.register({ secret: process.env.YANDEX_SECRET }),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
