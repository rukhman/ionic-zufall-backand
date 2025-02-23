import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { AxiosHeaders } from 'axios';
import { HttpService } from '@nestjs/axios';
import { Observable, from, map } from 'rxjs';
import { E_AuthService, GoogleRespUserDto, UserProfile } from './types';
import { User } from './entities/user.entity';
import { Role } from '../role/entities/role.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    private httpService: HttpService,
  ) {}

  availableFields = ['nameFirst', 'nameLast', 'email', 'gender', 'birthDate'];
  shortUserFields = ['authId', 'fullName', 'avatarId'];

  private filterFields(body: { [k: string]: any }) {
    const filteredBody: { [k: string]: any } = {};

    Object.keys(body).filter((k) => {
      if (this.availableFields.includes(k)) {
        filteredBody[k] = body[k];
      }
    });

    return filteredBody;
  }

  upsertUser(userData: UserProfile) {
    return from(this.userRepository.upsert(userData, ['authId'])).pipe(
      map(({ generatedMaps }) => ({ id: generatedMaps[0].id, ...userData })),
    );
  }

  public async createUser(userData: UserProfile) {
    const newUser = this.userRepository.create(userData);
    return await this.userRepository.save(newUser);
  }

  public async getAllUsers(res) {
    let select: string[];
    let relations = {
      roles: {
        permissions: true,
      },
    };

    switch (res) {
      case 'short':
        select = this.shortUserFields;
        relations = null;
        break;
    }
    return await this.userRepository.find({
      select: select as any,
      relations,
    });
  }

  public async deleteUser(id: number) {
    return await this.userRepository.delete(id);
  }

  getYandexJwtToken(accessToken: string): Observable<string> {
    const headers = new AxiosHeaders({ Authorization: 'OAuth ' + accessToken });
    return this.httpService
      .get<string>('https://login.yandex.ru/info?format=jwt', {
        headers,
      })
      .pipe(map((res) => res.data));
  }

  async getUserData(authId: number, authService: E_AuthService): Promise<User> {
    return this.userRepository.findOne({
      relations: {
        roles: {
          permissions: true,
        },
      },
      where: { authId, authService },
    });
  }

  async getUserGoogleDataByAccessToken(accessToken: string): Promise<GoogleRespUserDto> {
    return this.httpService
      .get<GoogleRespUserDto>(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`)
      .toPromise()
      .then((data) => data.data);
  }
  // `https://www.googleapis.com/oauth2/v3/userinfo?access_token={access_token}`
  async getUserDataById(id: number): Promise<User> {
    return this.userRepository.findOne({
      relations: {
        roles: {
          permissions: true,
        },
      },
      where: { id },
    });
  }

  async setRoles(authId: number, roleIds: number[]): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { authId },
      relations: ['roles'],
    });

    if (!user) {
      throw new Error('User not found');
    }

    const roles = await this.roleRepository.findBy({ id: In(roleIds) });

    if (!roles.length) {
      throw new Error('No courses found with the provided IDs');
    }

    user.roles = roles;
    return this.userRepository.save(user);
  }

  async setPermissions(authId: number, permissionIds: number[]): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { authId },
      relations: ['permissions'],
    });

    if (!user) {
      throw new Error('User not found');
    }

    const permissions = await this.roleRepository.findBy({
      id: In(permissionIds),
    });

    if (!permissions.length) {
      throw new Error('No courses found with the provided IDs');
    }

    // user.permissions = permissions;
    return this.userRepository.save(user);
  }
}
