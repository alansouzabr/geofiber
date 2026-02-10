import { SetMetadata } from '@nestjs/common';

export const PERMISSIONS_KEY = 'permissions_required';
export const RequirePermissions = (...perms: string[]) =>
  SetMetadata(PERMISSIONS_KEY, perms);
