import {
  Injectable,
  BadRequestException,
  NotFoundException
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { CreateFieldTechnicianDto } from './dto/create-field-technician.dto';
import { UpdateFieldTechnicianDto } from './dto/update-field-technician.dto';

@Injectable()
export class FieldTechniciansService {

  constructor(
    private prisma: PrismaService
  ) {}

  async list(companyId: string) {

    return this.prisma.fieldTechnicianProfile.findMany({

      where: {
        companyId
      },

      include: {
        User: true
      },

      orderBy: {
        createdAt: 'desc'
      }

    });

  }

  async create(
    dto: CreateFieldTechnicianDto,
    companyId: string
  ) {

    const user =
      await this.prisma.user.findFirst({

        where: {
          id: dto.userId,
          companyId
        }

      });

    if (!user) {
      throw new NotFoundException(
        'USER_NOT_FOUND'
      );
    }

    const exists =
      await this.prisma.fieldTechnicianProfile.findFirst({

        where: {
          userId: dto.userId
        }

      });

    if (exists) {
      throw new BadRequestException(
        'TECHNICIAN_ALREADY_EXISTS'
      );
    }

    return this.prisma.fieldTechnicianProfile.create({

      data: {

        id: Math.random()
          .toString(36)
          .substring(2),

        companyId,

        userId: dto.userId,

        phone: dto.phone || null,
        whatsapp: dto.whatsapp || null,
        city: dto.city || null,
        state: dto.state || null,
        cboCode: dto.cboCode || null,
        registration: dto.registration || null,
        document: dto.document || null,
        specialties: dto.specialties || [],

        updatedAt: new Date()

      },

      include: {
        User: true
      }

    });

  }

  async findOne(
    id: string,
    companyId: string
  ) {

    const technician =
      await this.prisma.fieldTechnicianProfile.findFirst({

        where: {
          id,
          companyId
        },

        include: {
          User: true
        }

      });

    if (!technician) {
      throw new NotFoundException(
        'TECHNICIAN_NOT_FOUND'
      );
    }

    return technician;

  }

  async update(
    id: string,
    dto: UpdateFieldTechnicianDto,
    companyId: string
  ) {

    await this.findOne(
      id,
      companyId
    );

    return this.prisma.fieldTechnicianProfile.update({

      where: {
        id
      },

      data: {

        phone: dto.phone,
        whatsapp: dto.whatsapp,
        city: dto.city,
        state: dto.state,
        cboCode: dto.cboCode,
        registration: dto.registration,
        document: dto.document,
        specialties: dto.specialties,
        updatedAt: new Date()

      },

      include: {
        User: true
      }

    });

  }


  /*
   * ETAPA32G_UPDATE_TOOLS
   *
   * Inventário operacional armazenado em:
   *
   * FieldTechnicianProfile.tools
   *
   * O técnico continua obrigatoriamente
   * validado dentro da empresa recebida.
   */
  async updateTools(
    id: string,
    tools: any[],
    companyId: string
  ) {

    await this.findOne(
      id,
      companyId
    );


    return this.prisma.fieldTechnicianProfile.update({

      where: {
        id
      },

      data: {
        tools,
        updatedAt: new Date()
      },

      include: {
        User: true
      }

    });

  }



  /*
   * ETAPA32H_UPDATE_VEHICLE
   *
   * Veículo operacional vinculado
   * ao FieldTechnicianProfile.
   *
   * O técnico é validado dentro
   * da empresa antes da alteração.
   */
  async updateVehicle(
    id: string,
    vehicle: any,
    companyId: string
  ) {

    await this.findOne(
      id,
      companyId
    );


    return this.prisma.fieldTechnicianProfile.update({

      where: {
        id
      },

      data: {
        vehicle,
        updatedAt: new Date()
      },

      include: {
        User: true
      }

    });

  }


  async remove(
    id: string,
    companyId: string
  ) {

    await this.findOne(
      id,
      companyId
    );

    return this.prisma.fieldTechnicianProfile.delete({

      where: {
        id
      }

    });

  }

}
