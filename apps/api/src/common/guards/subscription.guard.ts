import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../modules/prisma/prisma.service';

@Injectable()
export class SubscriptionGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const user = req.user;

    const company = await this.prisma.company.findUnique({
      where: { id: user.companyId }
    });

    if (!company?.isActive) {
      throw new ForbiddenException("Plano inativo");
    }

    return true;
  }
}
