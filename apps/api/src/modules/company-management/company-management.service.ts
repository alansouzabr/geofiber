import { Injectable }
from '@nestjs/common';

import { PrismaService }
from '../prisma/prisma.service';

import * as bcrypt
from 'bcrypt';

@Injectable()

export class CompanyManagementService {

  constructor(
    private prisma: PrismaService
  ) {}

  async list() {
    return this.prisma.company.findMany({
      include: {
        User: {
          select: {
            id: true,
            name: true,
            email: true,
            isActive: true,
            UserRole: {
              select: {
                Role: {
                  select: {
                    name: true
                  }
                }
              }
            },
            FieldTechnicianProfile: {
              select: {
                whatsapp: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async findOne(
    companyId: string
  ) {
    return this.prisma.company.findUnique({
      where: {
        id: companyId
      },
      include: {
        User: {
          select: {
            id: true,
            name: true,
            email: true,
            isActive: true,
            UserRole: {
              select: {
                Role: {
                  select: {
                    name: true
                  }
                }
              }
            },
            FieldTechnicianProfile: {
              select: {
                whatsapp: true
              }
            }
          }
        }
      }
    });
  }

  async update(
    companyId: string,
    body: any
  ) {

    try {

    const company =
      await this.prisma.company.update({

        where: {
          id: companyId
        },

        data: {

          name:
            body.name,

          razaoSocial:
            body.razaoSocial,

          cnpj:

            body.cnpj &&
            body.cnpj !== "" &&
            body.cnpj !== "CNPJ"

              ? body.cnpj
                  .replace(/\D/g, '')

              : null,

          isActive:
            body.isActive
        }
      });

    if (
      body.userId
    ) {

      const updateData: any = {

        name:
          body.userName,

        email:
          body.email
      };

      if (
        body.password
      ) {

        updateData.passwordHash =
          await bcrypt.hash(
            body.password,
            10
          );
      }

      await this.prisma.user.update({

        where: {
          id: body.userId
        },

        data: updateData
      });

      if (
        body.whatsapp !== undefined
      ) {

        const profile =
          await this.prisma.fieldTechnicianProfile.findUnique({

            where: {
              userId: body.userId
            }
          });

        if (profile) {

          await this.prisma.fieldTechnicianProfile.update({

            where: {
              userId: body.userId
            },

            data: {
              whatsapp:
                body.whatsapp || null
            }
          });

        } else {

          await this.prisma.fieldTechnicianProfile.create({

            data: {
              id:
                Math.random().toString(36).substring(7),

              companyId,

              userId:
                body.userId,

              whatsapp:
                body.whatsapp || null,

              updatedAt:
                new Date()
            }
          });
        }
      }
    }

    await this.prisma.auditLog.create({

      data: {
          id: Math.random().toString(36).substring(7),
          action: 'COMPANY_UPDATE',
          entity: 'Company',
          companyId,
          metadata: JSON.stringify({ ...body, password: undefined })
        }
    });

    return {

      success: true,

      company
    };

    } catch (error) {

      console.log(
        'COMPANY UPDATE ERROR',
        error
      );

      throw error;
    }
  }
}
