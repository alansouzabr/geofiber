import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PolesService {
  constructor(private prisma: PrismaService) {}

  async create(companyId: string, userId: string, dto: any) {
    let poleName = dto.name;

    if (
      !poleName ||
      String(poleName).startsWith("Poste")
    ) {

      const poles =
        await this.prisma.pole.findMany({
          where: { companyId },
          select: { name: true }
        });

      let maxNumber = 0;

      for (const pole of poles) {

        const match =
          String(pole.name)
            .match(/^Poste-(\d+)$/);

        if (!match) {
          continue;
        }

        const n =
          Number(match[1]);

        if (n > maxNumber) {
          maxNumber = n;
        }
      }

      poleName =
        `Poste-${maxNumber + 1}`;
    }

    return this.prisma.pole.create({
      data: {
        id: crypto.randomUUID(),
        companyId,
        name: poleName,
        type:
          dto.type ||
          'POSTE_CONCRETO',
        folderId:
          dto.folderId || null,
        lat: dto.lat,
        lng: dto.lng,
        createdBy: userId,
      },
    });
  }

  async list(companyId: string) {
return this.prisma.pole.findMany({

        where:{
          companyId,
        },

        include:{
          accessories:true,
        },

        orderBy:{
          createdAt:'desc',
        },

      });
  }

  async update(companyId: string, id: string, dto: any) {
    const pole = await this.prisma.pole.findFirst({
      where: {
        id,
        companyId,
      },
    });

    if (!pole) {
      throw new NotFoundException('Pole not found');
    }

    return this.prisma.pole.update({
      where: { id },
      data: {
        name: dto.name ?? pole.name,
        lat: dto.lat ?? pole.lat,
        lng: dto.lng ?? pole.lng,
      },
    });
  }

  async remove(companyId: string, id: string) {
    const pole = await this.prisma.pole.findFirst({
      where: {
        id,
        companyId,
      },
    });

    if (!pole) {
      throw new NotFoundException('Pole not found');
    }

    await this.prisma.pole.delete({
      where: { id },
    });

    return { ok: true };
  }
}
