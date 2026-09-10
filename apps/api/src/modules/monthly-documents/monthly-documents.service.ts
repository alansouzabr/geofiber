import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MonthlyDocumentsService {
  constructor(private prisma: PrismaService) {}

  // Funcionalidade temporariamente desabilitada - tabela MonthlyDocument não existe no banco
  async save(data: any) {
    return null;
  }

  async list(companyId: string) {
    return [];
  }

  async remove(data: any) {
    return { ok: true };
  }
}
