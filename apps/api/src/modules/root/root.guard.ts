import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';

@Injectable()
export class RootGuard implements CanActivate {
  canActivate(ctx: ExecutionContext) {
    const req = ctx.switchToHttp().getRequest();
    const user = req.user;

    // ROOT = companyId null
    if (user && (user.companyId === null || user.companyId === undefined)) return true;

    throw new ForbiddenException('Acesso permitido apenas para ROOT');
  }
}
