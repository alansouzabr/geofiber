import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpsertTechnicianProfileDto, CreateTechnicianUserDto } from './dto';

type CreatedUser = {
  id: string;
  email: string;
  name: string;
  companyId: string | null;
  createdAt: Date;
};

@Injectable()
export class TechniciansService {
  constructor(private prisma: PrismaService) {}

  async list(companyId: string) {
    const users = await this.prisma.user.findMany({
      where: { companyId, isActive: true },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        techProfile: true,
      },
      orderBy: [{ techProfile: { updatedAt: 'desc' } }, { createdAt: 'desc' }],
    });

    return users.filter((u) => !!u.techProfile);
  }

  async listPaged(
    companyId: string,
    params: {
      search?: string;
      isActive?: boolean;
      page: number;
      pageSize: number;
    },
  ) {
    const page = Number.isFinite(params.page) && params.page > 0 ? Math.floor(params.page) : 1;
    const pageSizeRaw = Number.isFinite(params.pageSize) ? Math.floor(params.pageSize) : 20;
    const pageSize = Math.min(Math.max(pageSizeRaw, 1), 100);
    const skip = (page - 1) * pageSize;

    const where: any = {
      companyId,
      // só usuários que são técnicos (tem profile)
      techProfile: params.isActive === undefined
        ? { isNot: null }
        : { is: { isActive: params.isActive } },
    };

    if (params.search) {
      where.OR = [
        { email: { contains: params.search, mode: 'insensitive' } },
        { name: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    const [total, items] = await Promise.all([
      this.prisma.user.count({ where }),
      this.prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          techProfile: true,
        },
        orderBy: [{ techProfile: { updatedAt: 'desc' } }, { createdAt: 'desc' }],
        skip,
        take: pageSize,
      }),
    ]);

    const totalPages = Math.ceil(total / pageSize) || 1;

    return {
      items,
      meta: {
        total,
        page,
        pageSize,
        totalPages,
      },
    };
  }

  async getProfile(companyId: string, userId: string) {
    const user = await this.prisma.user.findFirst({
      where: { id: userId, companyId },
      select: { id: true, email: true, name: true, techProfile: true },
    });

    if (!user) throw new NotFoundException('Usuário não encontrado');
    return user;
  }

  async upsertProfile(companyId: string, userId: string, dto: UpsertTechnicianProfileDto) {
    const user = await this.prisma.user.findFirst({
      where: { id: userId, companyId },
      select: { id: true },
    });
    if (!user) throw new NotFoundException('Usuário não encontrado');

    return this.prisma.fieldTechnicianProfile.upsert({
      where: { userId },
      update: {
        document: dto.document ?? undefined,
        cboCode: dto.cboCode ?? undefined,
        registration: dto.registration ?? undefined,
        phone: dto.phone ?? undefined,
        whatsapp: dto.whatsapp ?? undefined,
        city: dto.city ?? undefined,
        state: dto.state ?? undefined,
        specialties: dto.specialties ? { set: dto.specialties } : undefined,
        companyId,
        isActive: dto.isActive ?? undefined,
      },
      create: {
        userId,
        companyId,
        isActive: dto.isActive ?? true,
        registration: dto.registration ?? null,
        phone: dto.phone ?? null,
        whatsapp: dto.whatsapp ?? null,
        city: dto.city ?? null,
        state: dto.state ?? null,
        specialties: dto.specialties ?? [],
      },
    });
  }

  async createTechnician(companyId: string, dto: CreateTechnicianUserDto): Promise<{ created: boolean; user: CreatedUser }> {
    const bcrypt = require('bcryptjs');

    // normaliza email (evita duplicar por maiúscula/espaço)
    const email = dto.email.trim().toLowerCase();

    const roleTech = await this.prisma.role.findFirst({
      where: { companyId, name: 'TECNICO_CAMPO' },
      select: { id: true },
    });
    if (!roleTech) throw new NotFoundException('Role TECNICO_CAMPO não encontrada');

    const existing = await this.prisma.user.findFirst({
      where: { companyId, email },
      select: { id: true, name: true },
    });

    // UPDATE / ENSURE
    if (existing) {
      if (dto.name && dto.name !== existing.name) {
        await this.prisma.user.update({
          where: { id: existing.id },
          data: { name: dto.name },
        });
      }

      // garante role
      const hasRole = await this.prisma.userRole.findFirst({
        where: { userId: existing.id, roleId: roleTech.id },
        select: { id: true },
      });
      if (!hasRole) {
        await this.prisma.userRole.create({
          data: { userId: existing.id, roleId: roleTech.id },
        });
      }

      // garante techProfile + atualiza phone se veio
      await this.prisma.fieldTechnicianProfile.upsert({
        where: { userId: existing.id },
        update: {
          companyId,
          phone: dto.phone ?? undefined,
        },
        create: {
          userId: existing.id,
          companyId,
          isActive: true,
          phone: dto.phone ?? null,
          specialties: [],
        },
      });

      const user = await this.prisma.user.findUnique({
        where: { id: existing.id },
        select: { id: true, email: true, name: true, companyId: true, createdAt: true },
      });
      if (!user) throw new NotFoundException('Usuário não encontrado após update');

      return { created: false, user };
    }

    // CREATE
    const passwordHash = await bcrypt.hash('Admin@12345', 10);

    const user = await this.prisma.user.create({
      data: {
        companyId,
        email,
        name: dto.name,
        passwordHash,
        isActive: true,
        roles: { create: [{ roleId: roleTech.id }] },
        techProfile: {
          create: {
            companyId,
            phone: dto.phone ?? null,
            specialties: [],
          },
        },
      },
      select: { id: true, email: true, name: true, companyId: true, createdAt: true },
    });

    return { created: true, user };
  }

  async myProfile(companyId: string, userId: string) {
    const user = await this.prisma.user.findFirst({
      where: { id: userId, companyId },
      select: { id: true, email: true, name: true, createdAt: true, techProfile: true },
    });
    if (!user) throw new NotFoundException('Usuário não encontrado');
    return user;
  }

  async upsertMyProfile(companyId: string, userId: string, dto: UpsertTechnicianProfileDto) {
    const user = await this.prisma.user.findFirst({ where: { id: userId, companyId }, select: { id: true } });
    if (!user) throw new NotFoundException('Usuário não encontrado');
    return this.upsertProfile(companyId, userId, dto);
  }
}
