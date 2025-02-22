import { Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  create(createRoleDto: CreatePermissionDto) {
    const entity = this.permissionRepository.create(createRoleDto.name as Partial<Permission>);
    return this.permissionRepository.save(entity);
  }

  findAll() {
    return this.permissionRepository.find();
  }

  findOne(id: number) {
    return this.permissionRepository.findOne({ where: { id } });
  }

  update(id: number, updateRoleDto: UpdatePermissionDto) {
    return this.permissionRepository.update({ id }, updateRoleDto.name as Partial<Permission>);
  }

  remove(id: number) {
    return this.permissionRepository.delete({ id });
  }
}
