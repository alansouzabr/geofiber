import { Controller, Get, Post, Body, Param, Patch, Delete, Req, UseGuards } from "@nestjs/common";
import { CompaniesService } from "./companies.service";
import { PrismaService } from '../prisma/prisma.service';
import { z } from 'zod';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { generateId } from '../../common/utils/id';

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

  @Get('mine')
  async mine(@Req() req: any) {
    const companyId = req.user?.companyId ?? null;

    // ROOT (companyId null/undefined) pode listar tudo
    if (companyId === null) {
      const companies = await this.prisma.company.findMany({
        select: { id: true, name: true, razaoSocial: true, cnpj: true, createdAt: true, isActive: true },
        orderBy: { createdAt: 'desc' },
      });
      return { isRoot: true, companies };
    }

    // Usuario comum: retorna a propria empresa do token
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
      select: { id: true, name: true, razaoSocial: true, cnpj: true, createdAt: true, isActive: true },
    });

    return { isRoot: false, companies: company ? [company] : [] };
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

  @UseGuards(RolesGuard)
  @Roles('ROOT')
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
      registroProfissional: string;
      tiposOperacao: Array<'FTTH' | 'BACKBONE' | 'DATACENTER'>;
      name?: string;
    },
  ) {
    const schema = z.object({
      razaoSocial: z.string().min(3),
      cnpj: z.string().min(14),
      registroProfissional: z.string().min(3),
      tiposOperacao: z.array(z.enum(['FTTH', 'BACKBONE', 'DATACENTER'])).min(1),
      name: z.string().optional(),
    });

    const data = schema.parse(body);
    const cnpjDigits = data.cnpj.replace(/\D/g, '');

    const exists = await this.prisma.company.findUnique({ where: { cnpj: cnpjDigits } });
    if (exists) return { ok: false, error: 'CNPJ já cadastrado' };

    const company = await this.companies.create({
      name: data.name || data.razaoSocial,
      cnpj: cnpjDigits,
    });

    await this.prisma.company.update({
      where: { id: company.id },
      data: {
        razaoSocial: data.razaoSocial,
        registroProfissional: data.registroProfissional,
        isActive: false,
        status: 'PENDING',
      },
    });

    return { ok: true, company };
  }

  // ============================
  // MASTER/ROOT ONLY
  // ============================


}
