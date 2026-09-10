import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MapsService {
  constructor(private prisma: PrismaService) {}

  // Funcionalidade temporariamente desabilitada - tabela MapElement não existe no banco
  async create(data: any) {
    return null;
  }

  async findByCompany(companyId: string) {
    return [];
  }

  async remove(id: string) {
    return null;
  }
}
