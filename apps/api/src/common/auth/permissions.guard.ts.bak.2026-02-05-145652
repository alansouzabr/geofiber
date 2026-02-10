import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from './permissions.decorator';
import { PrismaService } from '../../modules/prisma/prisma.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector, private prisma: PrismaService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const required = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [ctx.getHandler(), ctx.getClass()],
    );

    // se a rota não exige permissões específicas, deixa passar
    if (!required || required.length === 0) return true;

    const req = ctx.switchToHttp().getRequest();
    const user = req.user as { userId?: string; companyId?: string | null } | undefined;

    // precisa estar autenticado
    if (!user?.userId) throw new ForbiddenException('Sem usuário autenticado');

    // ROOT global (companyId null) bypass: permite tudo
    if (user.companyId === null || user.companyId === undefined) {
      return true;
    }

    // usuário normal precisa ter companyId
    if (!user.companyId) throw new ForbiddenException('Sem empresa selecionada');

    // busca permissões do usuário (via roles)
    const rows = await this.prisma.userRole.findMany({
      where: { userId: user.userId },
      select: {
        role: {
          select: {
            perms: { select: { permission: { select: { key: true } } } },
          },
        },
      },
    });

    const userPerms = new Set<string>();
    for (const ur of rows) {
      for (const rp of ur.role.perms) userPerms.add(rp.permission.key);
    }

    const ok = required.every((p) => userPerms.has(p));
    if (!ok) throw new ForbiddenException('Permissão insuficiente');

    return true;
  }
}
