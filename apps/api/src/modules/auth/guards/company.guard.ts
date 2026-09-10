import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

import { Reflector } from '@nestjs/core';

@Injectable()
export class CompanyGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean {
    const isPublic =
      this.reflector.get<boolean>(
        'isPublic',
        context.getHandler(),
      );

    if (isPublic) {
      return true;
    }

    const request =
      context
        .switchToHttp()
        .getRequest();

    const user =
      request.user;

    if (!user) {
      throw new ForbiddenException(
        'Usuário não autenticado',
      );
    }

    /*
     * ROOT / MASTER pertencem à plataforma.
     *
     * Não devem depender da ativação
     * de um tenant CLIENT para acessar
     * recursos da plataforma.
     */
    const isPlatformRole =
      user.role === 'ROOT' ||
      user.role === 'MASTER';

    if (isPlatformRole) {
      return true;
    }

    /*
     * Usuários CLIENT precisam estar
     * vinculados a uma empresa ativa.
     */
    if (!user.companyId) {
      throw new ForbiddenException(
        'Usuário sem empresa',
      );
    }

    /*
     * O JwtAuthGuard atual já carrega
     * a empresa e informa sua situação
     * através de isActive.
     */
    if (user.isActive !== true) {
      throw new ForbiddenException(
        'Empresa não está ativa.',
      );
    }

    return true;
  }
}
