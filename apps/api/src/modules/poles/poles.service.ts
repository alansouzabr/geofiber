import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePoleDto, UpdatePoleDto } from './dto';

@Injectable()
export class PolesService {
  constructor(private prisma: PrismaService) {}

  async create(companyId: string, userId: string, dto: CreatePoleDto) {
    return this.prisma.pole.create({
      data: {
        companyId,
        userId,
        folderId: dto.folderId ?? null,
        name: dto.name ?? null,
        lat: Number(dto.lat),
        lng: Number(dto.lng),
        address: dto.address ?? null,
        notes: dto.notes ?? null,
        visible: dto.visible ?? true,
      },
    });
  }

  async list(companyId: string) {
    return this.prisma.pole.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' },
      take: 5000,
    });
  }

  async update(companyId: string, id: string, dto: UpdatePoleDto) {
    const current = await this.prisma.pole.findFirst({
      where: { id, companyId },
      select: { id: true },
    });

    if (!current) {
      throw new NotFoundException('Poste não encontrado');
    }

    return this.prisma.pole.update({
      where: { id },
      data: {
        ...(dto.lat !== undefined ? { lat: Number(dto.lat) } : {}),
        ...(dto.lng !== undefined ? { lng: Number(dto.lng) } : {}),
        ...(dto.name !== undefined ? { name: dto.name ?? null } : {}),
        ...(dto.address !== undefined ? { address: dto.address ?? null } : {}),
        ...(dto.notes !== undefined ? { notes: dto.notes ?? null } : {}),
        ...(dto.folderId !== undefined ? { folderId: dto.folderId ?? null } : {}),
        ...(dto.visible !== undefined ? { visible: !!dto.visible } : {}),
      },
    });
  }

  async remove(companyId: string, id: string) {
    const current = await this.prisma.pole.findFirst({
      where: { id, companyId },
      select: { id: true },
    });

    if (!current) {
      throw new NotFoundException('Poste não encontrado');
    }

    await this.prisma.pole.delete({
      where: { id },
    });

    return { ok: true };
  }
}
