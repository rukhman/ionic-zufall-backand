import { Controller, Get, Post, Res, Delete, Param, ParseIntPipe, Body, Query } from '@nestjs/common';
import { Response } from 'express';

import { UserService } from './user.service';
import { catchError, from, mergeMap, of, tap } from 'rxjs';
import {
  E_AuthService,
  E_Gender,
  E_ResponseTypes,
  GoogleRespUserDto,
  IYandexResponseUserData,
  UserProfile,
} from './types';
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
    const userData = await this.userService.getUserDataById(id);

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
      .getYandexJwtToken(authDto?.accessToken)
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
          console.log(process.env.YANDEX_SECRET);
          try {
            userYandex = this.jwtService.verify(jwtToken, {
              secret: process.env.YANDEX_SECRET,
            });
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
          return from(this.userService.getUserData(userData.authId, E_AuthService.Yandex));
        }),
        mergeMap((userData: User & { permissions: Permission[] }) => {
          userData.permissions = [];
          userData.roles.forEach((role) => (userData.permissions = [...userData.permissions, ...role.permissions]));
          userData.permissions = uniq(userData.permissions);

          return from(this.jwtService.signAsync(JSON.stringify(userData)));
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

  /**
   * авторизация
   */
  @Public()
  @Post('/google-auth')
  async googleAuth(@Body() { accessToken }: { accessToken: string }) {
    const googleUserData: GoogleRespUserDto = await this.userService.getUserGoogleDataByAccessToken(accessToken);
    if (!googleUserData) return;
    const userData: User = await this.userService.getUserData(+googleUserData.sub, E_AuthService.Google);

    let jwt;
    if (!userData) {
      const newUser = await this.userService.upsertUser(
        new UserProfile({
          authService: E_AuthService.Google,
          authId: +googleUserData.sub,
          firstName: googleUserData.given_name,
          secondName: googleUserData.family_name,
          fullName: googleUserData.name,
          email: googleUserData.email,
          avatarId: googleUserData.picture,
          phone: null,
          birthDate: null,
          gender: null,
        }),
      );
      jwt = await this.jwtService.signAsync(JSON.stringify(newUser));
    } else {
      jwt = await this.jwtService.signAsync(JSON.stringify(userData));
    }

    return { jwt };
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
