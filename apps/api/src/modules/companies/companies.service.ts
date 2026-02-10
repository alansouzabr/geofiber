import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CompaniesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: { name: string; cnpj?: string | null }) {
    return this.prisma.company.create({
      data: {
        name: data.name,
        cnpj: data.cnpj ?? null,
      },
    });
  }

  async findAll() {
    return this.prisma.company.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async findOne(id: string) {
    const company = await this.prisma.company.findUnique({ where: { id } });
    if (!company) throw new NotFoundException('Company not found');
    return company;
  }

  async update(id: string, data: { name?: string; cnpj?: string | null }) {
    await this.findOne(id);
    return this.prisma.company.update({
      where: { id },
      data: {
        ...(data.name !== undefined ? { name: data.name } : {}),
        ...(data.cnpj !== undefined ? { cnpj: data.cnpj } : {}),
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.company.delete({ where: { id } });
  }
}
