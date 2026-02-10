import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { PrismaService } from '../prisma/prisma.service';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companies: CompaniesService, private prisma: PrismaService) {}

  @Post()
  create(@Body() body: { name: string; cnpj?: string | null }) {
    return this.companies.create({
      name: String(body.name || ''),
      cnpj: body.cnpj ?? null,
    });
  }

  @Get()
  findAll() {
    return this.companies.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('mine')
  async mine(@Req() req: any) {
    const userId = req.user?.userId;

    if (!userId) {
      return { isRoot: false, companies: [], error: 'Sem userId no token' };
    }

    // ROOT (companyId null/undefined) pode listar tudo
    if (req.user?.companyId === null || req.user?.companyId === undefined) {
      const companies = await this.prisma.company.findMany({
        select: { id: true, name: true, cnpj: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
      });
      return { isRoot: true, companies };
    }

    // Usuário comum: empresas via userRole -> role.company
    const rows = await this.prisma.userRole.findMany({
      where: { userId },
      select: {
        role: {
          select: {
            company: { select: { id: true, name: true, cnpj: true, createdAt: true } },
          },
        },
      },
    });

    const map = new Map<string, any>();
    for (const r of rows) {
      const c = r.role?.company;
      if (c?.id) map.set(c.id, c);
    }

    return { isRoot: false, companies: Array.from(map.values()) };
  }



  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companies.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: { name?: string; cnpj?: string | null }) {
    return this.companies.update(id, {
      ...(body.name !== undefined ? { name: String(body.name) } : {}),
      ...(body.cnpj !== undefined ? { cnpj: body.cnpj } : {}),
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.companies.remove(id);
  }
}
