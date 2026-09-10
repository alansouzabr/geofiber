import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PlanLimitService } from '../../common/limits/plan-limit.service';

@Injectable()
export class TrtService {
  constructor(
    private prisma: PrismaService,
    private limit: PlanLimitService
  ) {}

  // Funcionalidade temporariamente desabilitada - tabela Trt não existe no banco
  async create(data: any) {
    return null;
  }

  async list(user: any) {
    return [];
  }

  async approve(id: string, user: any) {
    return null;
  }

  async delete(id: string, user: any) {
    return null;
  }
}
