import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RackEquipmentsService {
  constructor(private readonly prisma: PrismaService) {}

  list(companyId: string, rackId: string) {
    return this.prisma.rackEquipment.findMany({
      where: { companyId, rackId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(companyId: string, dto: any) {
    const rack = await this.prisma.rack.findFirst({
      where: { id: dto.rackId, companyId },
      select: { id: true },
    });
    if (!rack) throw new NotFoundException('Rack não encontrado');

    return this.prisma.rackEquipment.create({
      data: {
        companyId,
        rackId: dto.rackId,
        name: dto.name,
        type: dto.type,
        vendor: dto.vendor ?? null,
        model: dto.model ?? null,
        serial: dto.serial ?? null,
      },
    });
  }
}
