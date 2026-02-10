import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { PrismaService } from '../prisma/prisma.service';
import { z } from 'zod';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companies: CompaniesService, private prisma: PrismaService) {}

  // Endpoint antigo (mantido)
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
        select: { id: true, name: true, cnpj: true, createdAt: true, isActive: true },
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
            company: { select: { id: true, name: true, cnpj: true, createdAt: true, isActive: true } },
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

  // ============================
  // NOVO: Cadastro PJ Telecom
  // ============================
  @Post('register-telecom')
  async registerTelecom(
    @Body()
    body: {
      razaoSocial: string;
      cnpj: string;
      responsavelTecnico: string;
      registroProfissional: string;
      tiposOperacao: Array<'FTTH' | 'BACKBONE' | 'DATACENTER'>;
      name?: string;
    },
  ) {
    const schema = z.object({
      razaoSocial: z.string().min(3),
      cnpj: z.string().min(14),
      responsavelTecnico: z.string().min(3),
      registroProfissional: z.string().min(3),
      tiposOperacao: z.array(z.enum(['FTTH', 'BACKBONE', 'DATACENTER'])).min(1),
      name: z.string().optional(),
    });

    const data = schema.parse(body);
    const cnpjDigits = data.cnpj.replace(/\D/g, '');

    const exists = await this.prisma.company.findUnique({ where: { cnpj: cnpjDigits } });
    if (exists) return { ok: false, error: 'CNPJ já cadastrado' };

    const company = await this.prisma.company.create({
      data: {
        name: data.name || data.razaoSocial, // compatibilidade
        cnpj: cnpjDigits,
        razaoSocial: data.razaoSocial,
        responsavelTecnico: data.responsavelTecnico,
        registroProfissional: data.registroProfissional,
        isActive: true,
        operations: { create: data.tiposOperacao.map((t) => ({ type: t })) },
      },
      select: { id: true, name: true, cnpj: true, razaoSocial: true, isActive: true },
    });

    return { ok: true, company };
  }

  // (por enquanto com JwtAuthGuard; no próximo passo a gente restringe para MASTER com seu guard de permissões)
  @UseGuards(JwtAuthGuard)
  @Patch(':id/activate')
  async activate(@Param('id') id: string) {
    const company = await this.prisma.company.update({
      where: { id },
      data: { isActive: true },
      select: { id: true, name: true, isActive: true },
    });
    return { ok: true, company };
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/deactivate')
  async deactivate(@Param('id') id: string) {
    const company = await this.prisma.company.update({
      where: { id },
      data: { isActive: false },
      select: { id: true, name: true, isActive: true },
    });
    return { ok: true, company };
  }
}
