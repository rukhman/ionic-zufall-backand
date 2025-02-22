import { Controller, Get, Post, Res, Delete, Param, ParseIntPipe, Body, Query } from '@nestjs/common';
import { Response } from 'express';

import { UserService } from './user.service';
import { catchError, from, mergeMap, of, tap } from 'rxjs';
import { E_AuthService, E_Gender, E_ResponseTypes, IYandexResponseUserData, UserProfile } from './types';
import { JwtService } from '@nestjs/jwt';
import { SetRolesDto } from '../role/dto/update-role.dto';
import { SetPermissionDto } from '../permission/dto/update-permission.dto';
import { User } from './entities/user.entity';
import { PermissionsMetadata, Public } from 'src/guards/auth/decorators';
import { permissions } from 'src/guards/auth/permissions';
import { AuthDto } from './dto/auth.dto ';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Permission } from '../permission/entities/permission.entity';
import { uniq } from 'lodash';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  @Get('/')
  @PermissionsMetadata([permissions.canVizitAdminPanel])
  async getAllUsers(@Res() res: Response, @Query() { resp }) {
    const users = await this.userService.getAllUsers(resp);

    return res.send({
      status: E_ResponseTypes.ok,
      data: users,
    });
  }

  @Get(':id')
  @PermissionsMetadata([permissions.canVizitAdminPanel])
  async getUser(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    const userData = await this.userService.getUserData(id);

    return res.send({
      status: E_ResponseTypes.ok,
      data: userData,
    });
  }

  @Delete('/:id')
  @PermissionsMetadata([permissions.canVizitAdminPanel])
  async deleteUser(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    this.userService.deleteUser(id);
    return res.send({ status: E_ResponseTypes.ok });
  }

  /**
   * авторизация
   */
  @Public()
  @Post('/auth')
  auth(@Res() res: Response, @Body() authDto: AuthDto) {
    let jwtToken: string = null;
    this.userService
      .getJwtToken(authDto?.accessToken)
      .pipe(
        catchError(() => {
          return of(
            res.send({
              status: E_ResponseTypes.error,
              error: 'не удалось получить jwtToken',
            }),
          );
        }),
        mergeMap((token: string) => {
          jwtToken = token;
          let userYandex: IYandexResponseUserData;
          try {
            userYandex = this.jwtService.verify(jwtToken);
          } catch {
            throw 'jwtToken не валидный';
          }

          return this.userService.upsertUser(
            new UserProfile({
              authService: E_AuthService.Yandex,
              authId: +userYandex.uid,
              firstName: null,
              secondName: null,
              fullName: userYandex.name,
              email: userYandex.email,
              avatarId: userYandex.avatar_id,
              phone: userYandex.phone.number,
              birthDate: userYandex.birthday,
              gender: userYandex.gender as E_Gender,
            }),
          );
        }),
        //после того как получили пользователя от яндекс
        mergeMap((userData: UserProfile) => {
          return from(this.userService.getUserData(userData.authId));
        }),
        mergeMap((userData: User & { permissions: Permission[] }) => {
          userData.permissions = [];
          userData.roles.forEach((role) => (userData.permissions = [...userData.permissions, ...role.permissions]));
          userData.permissions = uniq(userData.permissions);

          return from(
            this.jwtService.signAsync(JSON.stringify(userData), {
              secret: process.env.APP_SECRET,
            }),
          );
        }),
        tap((jwt: any) => {
          res.send({
            status: E_ResponseTypes.ok,
            data: jwt,
          });
        }),
        catchError((error) => {
          return of(
            res.send({
              status: E_ResponseTypes.error,
              error,
            }),
          );
        }),
      )
      .subscribe();
  }

  @Post('/set-roles')
  @PermissionsMetadata([permissions.canVizitAdminPanel])
  setUserRoles(@Res() res: Response, @Body() rolesDto: SetRolesDto) {
    from(this.userService.setRoles(rolesDto.id, rolesDto.roleIds)).subscribe((resp) => {
      res.send({
        status: E_ResponseTypes.ok,
        data: resp,
      });
    });
  }

  @Post('/set-permissions')
  @PermissionsMetadata([permissions.canVizitAdminPanel])
  setUserPermissions(@Res() res: Response, @Body() permissionsDto: SetPermissionDto) {
    from(this.userService.setPermissions(permissionsDto.id, permissionsDto.permissionIds)).subscribe((resp) => {
      res.send({
        status: E_ResponseTypes.ok,
        data: resp,
      });
    });
  }
}
