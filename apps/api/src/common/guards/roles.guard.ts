import {
  CanActivate,
  ExecutionContext,
  Injectable
} from '@nestjs/common';

import { Reflector } from '@nestjs/core';

import { ROLES_KEY } from '../decorators/roles.decorator';

import { RoleName } from '../../modules/roles/roles.constants';

import { AuthenticatedUser } from '../interfaces/authenticated-user.interface';

@Injectable()
export class RolesGuard
implements CanActivate {

  constructor(
    private reflector: Reflector
  ) {}

  canActivate(
    context: ExecutionContext
  ): boolean {

    const requiredRoles =
      this.reflector.getAllAndOverride<RoleName[]>(
        ROLES_KEY,
        [
          context.getHandler(),
          context.getClass()
        ]
      );

    if (!requiredRoles) {
      return true;
    }

    const request =
      context
        .switchToHttp()
        .getRequest<{ user?: AuthenticatedUser }>();

    const user =
      request.user;

    if (!user) {
      return false;
    }

    return requiredRoles.includes(
      user.role
    );
  }
}
