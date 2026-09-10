import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException
} from '@nestjs/common';

import { Reflector }
from '@nestjs/core';

import { PERMISSIONS_KEY }
from '../decorators/permissions.decorator';


@Injectable()
export class PermissionGuard
implements CanActivate {

  constructor(
    private reflector: Reflector
  ) {}


  async canActivate(
    context: ExecutionContext
  ): Promise<boolean> {

    const required =
      this.reflector.getAllAndOverride<string[]>(
        PERMISSIONS_KEY,
        [
          context.getHandler(),
          context.getClass()
        ]
      );


    if (!required?.length) {
      return true;
    }


    const req =
      context
        .switchToHttp()
        .getRequest();


    const user =
      req.user;


    if (!user) {

      throw new ForbiddenException(
        'Usuário inválido'
      );

    }


    /*
     * ETAPA35A3B_MULTI_ROLE_PERMISSION_GUARD
     *
     * JwtAuthGuard reconstrói user.permissions
     * diretamente do banco a cada request e faz
     * a união das permissões de TODOS os UserRole.
     *
     * Portanto o PermissionGuard não deve consultar
     * apenas o role funcional do usuário.
     */
    const isPlatformRole =
      user.role === 'ROOT' ||
      user.role === 'MASTER';


    if (isPlatformRole) {
      return true;
    }


    const permissions =
      Array.isArray(
        user.permissions
      )
        ? user.permissions
        : [];


    const allowed =
      required.every(
        permission =>
          permissions.includes(
            permission
          )
      );


    if (!allowed) {

      throw new ForbiddenException(
        'Permissão negada'
      );

    }


    return true;

  }

}
