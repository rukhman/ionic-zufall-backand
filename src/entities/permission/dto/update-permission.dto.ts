import { IsNumber, IsString } from 'class-validator';

export class UpdatePermissionDto {
  @IsString()
  name: string;

  @IsNumber()
  id: number;
}

export class SetPermissionDto {
  @IsNumber({}, { each: true })
  permissionIds: number[];

  @IsNumber()
  id: number;
}
