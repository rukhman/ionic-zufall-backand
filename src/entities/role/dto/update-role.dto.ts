import { IsNumber, IsString } from 'class-validator';

export class UpdateRoleDto {
  @IsString()
  role: string;

  @IsNumber()
  id: string;
}

export class SetRolesDto {
  @IsNumber({}, { each: true })
  roleIds: number[];

  @IsNumber()
  id: number;
}
