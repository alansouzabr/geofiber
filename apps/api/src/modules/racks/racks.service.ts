import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RacksService {
  constructor(private readonly prisma: PrismaService) {}

  list(companyId: string, stationId: string) {
    return this.prisma.rack.findMany({
      where: { companyId, stationId },
      include: { equipments: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(companyId: string, dto: any) {
    const station = await this.prisma.station.findFirst({
      where: { id: dto.stationId, companyId },
      select: { id: true },
    });
    if (!station) throw new NotFoundException('Station não encontrada');

    return this.prisma.rack.create({
      data: {
        companyId,
        stationId: dto.stationId,
        name: dto.name,
      },
    });
  }
}
