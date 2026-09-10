import {
  Injectable,
  NotFoundException
} from "@nestjs/common";

import { PrismaService }
from "../prisma/prisma.service";

@Injectable()

export class PoleAccessoriesService {

  constructor(

    private prisma: PrismaService

  ) {}

  async create(

    companyId: string,

    dto: any

  ) {

    const pole =
      await this.prisma.pole.findFirst({
        where: {
          id: dto.poleId,
          companyId
        }
      });

    if (!pole) {
      throw new NotFoundException("Pole not found");
    }

    return this.prisma.poleAccessory.create({

      data: {

        id: crypto.randomUUID(),

        poleId: dto.poleId,

        companyId,

        type: dto.type,

        name: dto.name,

        capacity: dto.capacity ?? null,

        occupiedPorts:
          dto.occupiedPorts ?? 0,

        status:
          dto.status ?? null,

        updatedAt:
          new Date()

      }

    });

  }

  async list(

    companyId: string

  ) {

    return this.prisma.poleAccessory.findMany({

      where: {
        companyId
      },

      orderBy: {
        createdAt: "asc"
      }

    });

  }

  async update(

    companyId: string,

    id: string,

    dto: any

  ) {

    const item =
      await this.prisma.poleAccessory.findFirst({

        where: {

          id,

          companyId

        }

      });

    if (!item)

      throw new NotFoundException(
        "Accessory not found"
      );

    return this.prisma.poleAccessory.update({

      where: {

        id

      },

      data: {

        name:
          dto.name ?? item.name,

        capacity:
          dto.capacity ?? item.capacity,

        occupiedPorts:
          dto.occupiedPorts ??
          item.occupiedPorts,

        status:
          dto.status ??
          item.status,

        updatedAt:
          new Date()

      }

    });

  }

  async remove(

    companyId: string,

    id: string

  ) {

    const item =
      await this.prisma.poleAccessory.findFirst({

        where: {

          id,

          companyId

        }

      });

    if (!item)

      throw new NotFoundException(
        "Accessory not found"
      );

    await this.prisma.poleAccessory.delete({

      where: {

        id

      }

    });

    return {

      ok: true

    };

  }

}
