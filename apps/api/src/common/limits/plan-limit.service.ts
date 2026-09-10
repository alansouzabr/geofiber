import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../modules/prisma/prisma.service';

@Injectable()
export class PlanLimitService {
  constructor(private prisma: PrismaService) {}

  async canAddUser(companyId: string): Promise<boolean> {
    return true;
  }

  async canAddTrt(companyId: string): Promise<boolean> {
    return true;
  }
}
