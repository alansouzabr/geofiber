import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StationsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(companyId: string, projectId: string) {
    return this.prisma.station.findMany({
      where: { companyId, projectId },
      include: { racks: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(companyId: string, dto: any) {
    const project = await this.prisma.project.findFirst({
      where: { id: dto.projectId, companyId },
      select: { id: true },
    });
    if (!project) throw new NotFoundException('Project/POP não encontrado');

    return this.prisma.station.create({
      data: {
        companyId,
        projectId: dto.projectId,
        type: dto.type ?? 'POP',
        name: dto.name,
        address: dto.address ?? null,
        lat: dto.lat ?? null,
        lng: dto.lng ?? null,
      },
    });
  }
}
