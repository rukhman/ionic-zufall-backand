import { SetMetadata } from '@nestjs/common';

export const PermissionsMetadata = (permissions: string[]) => SetMetadata('permissions', permissions);

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
