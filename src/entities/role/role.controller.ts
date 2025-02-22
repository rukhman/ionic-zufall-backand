import { Controller, Get, Post, Body, Param, Delete, Res } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('roles')
@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  async create(@Body() createRoleDto: CreateRoleDto, @Res() res: Response) {
    const data = await this.roleService.create(createRoleDto);
    return res.send({
      status: 'ok',
      data,
    });
  }

  @Get('/')
  async findAll(@Res() res: Response) {
    const roles = await this.roleService.findAll();

    return res.send({
      status: 'ok',
      data: roles,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roleService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roleService.remove(+id);
  }
}
