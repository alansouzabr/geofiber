import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { generateId } from '../../common/utils/id';

@Injectable()
export class AuditService {

  constructor(
    private readonly prisma: PrismaService
  ) {}

  async log(data: {
    companyId: string;
    actorUserId?: string | null;
    action: string;
    entity: string;
    metadata?: any;
  }) {

    let actorUserId: string | null = null;

    if (data.actorUserId) {

      const user = await this.prisma.user.findUnique({
        where: {
          id: data.actorUserId
        },
        select: {
          id: true
        }
      });

      if (user) {
        actorUserId = user.id;
      }

    }

    return this.prisma.auditLog.create({

      data: {

        id: generateId(),

        companyId: data.companyId,

        actorUserId,

        action: data.action,

        entity: data.entity,

        metadata: data.metadata ?? {}

      }

    });

  }

}
