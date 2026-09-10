import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { generateId } from '../../common/utils/id';
import {
  PLATFORM_ROLES,
  COMPANY_ROLES
} from './roles.constants';

export const COMPANY_PERMISSIONS = [
  {
    key: 'module.dashboard',
    description: 'Acesso ao módulo Dashboard',
  },
  {
    key: 'module.training',
    description: 'Acesso ao módulo Treinamentos',
  },
  {
    key: 'module.files',
    description: 'Acesso ao módulo Telecomunicação',
  },
  {
    key: 'module.projects',
    description: 'Acesso ao módulo Projetos',
  },
  {
    key: 'module.execution',
    description: 'Acesso ao módulo Execução',
  },
  {
    key: 'module.company',
    description: 'Acesso ao módulo Empresa',
  },
  {
    key: 'module.settings',
    description: 'Acesso ao módulo Configurações',
  },

  {
    key: 'company.view',
    description: 'Visualizar dados da empresa',
  },
  {
    key: 'company.edit',
    description: 'Editar dados da empresa',
  },
  {
    key: 'company.users',
    description: 'Gerenciar usuários da empresa',
  },
  {
    key: 'projects.view',
    description: 'Visualizar projetos',
  },
  {
    key: 'projects.edit',
    description: 'Editar projetos',
  },
  {
    key: 'kmz.view',
    description: 'Visualizar mapas e KMZ',
  },
  {
    key: 'kmz.edit',
    description: 'Editar mapas e KMZ',
  },
  {
    key: 'trt.view',
    description: 'Visualizar TRTs',
  },
  {
    key: 'trt.approve',
    description: 'Aprovar TRTs',
  },
  {
    key: 'files.view',
    description: 'Visualizar arquivos da empresa',
  },
  {
    key: 'files.download',
    description: 'Baixar arquivos da empresa',
  },
  {
    key: 'finance.view',
    description: 'Visualizar financeiro',
  },
  {
    key: 'training.view',
    description: 'Visualizar treinamentos',
  },
] as const;

@Injectable()
export class RolesService {

  constructor(
    private prisma: PrismaService
  ) {}

  async ensureCompanyRoles(
    companyId: string
  ) {

    for (const name of COMPANY_ROLES) {

      const exists =
        await this.prisma.role.findFirst({

          where: {
            companyId,
            name
          }

        });

      if (!exists) {

        await this.prisma.role.create({

          data: {

            id: generateId(),

            companyId,

            name

          }

        });

      }

    }

  }

  async ensurePlatformRoles(
    companyId: string
  ) {

    for (const name of PLATFORM_ROLES) {

      const exists =
        await this.prisma.role.findFirst({

          where: {
            companyId,
            name
          }

        });

      if (!exists) {

        await this.prisma.role.create({

          data: {

            id: generateId(),

            companyId,

            name

          }

        });

      }

    }

  }

  async ensureCompanyPermissions(
    companyId: string
  ) {

    for (const permission of COMPANY_PERMISSIONS) {

      const exists =
        await this.prisma.permission.findFirst({

          where: {
            companyId,
            key: permission.key
          }

        });

      if (!exists) {

        await this.prisma.permission.create({

          data: {

            id: generateId(),

            companyId,

            key: permission.key,

            description:
              permission.description,

          }

        });

      }

    }

  }

  async ensureAdminPermissions(
    companyId: string
  ) {

    await this.ensureCompanyRoles(
      companyId
    );

    await this.ensureCompanyPermissions(
      companyId
    );

    const admin =
      await this.prisma.role.findFirst({

        where: {
          companyId,
          name: 'ADMIN'
        }

      });

    if (!admin) {
      throw new Error(
        `Role ADMIN não encontrada para ${companyId}`
      );
    }

    const permissions =
      await this.prisma.permission.findMany({

        where: {
          companyId
        }

      });

    for (const permission of permissions) {

      const exists =
        await this.prisma.rolePermission.findFirst({

          where: {
            roleId: admin.id,
            permissionId: permission.id
          }

        });

      if (!exists) {

        await this.prisma.rolePermission.create({

          data: {

            id: generateId(),

            roleId: admin.id,

            permissionId: permission.id

          }

        });

      }

    }

    return {
      companyId,
      role: 'ADMIN',
      permissions: permissions.map(
        permission => permission.key
      )
    };

  }

  async listPermissions() {
    return COMPANY_PERMISSIONS;
  }

  async getAdminPermissions(
    companyId: string
  ) {


    const role =
      await this.prisma.role.findFirst({
        where: {
          companyId,
          name: 'ADMIN'
        },
        include: {
          RolePermission: {
            include: {
              Permission: true
            }
          }
        }
      });

    if (!role) {
      throw new Error(
        `Role ADMIN não encontrada para ${companyId}`
      );
    }

    return {
      companyId,
      role: 'ADMIN',
      permissions:
        role.RolePermission.map(
          item => item.Permission.key
        )
    };
  }

  async setAdminPermissions(
    companyId: string,
    permissionKeys: string[]
  ) {
    await this.ensureCompanyRoles(companyId);
    await this.ensureCompanyPermissions(companyId);

    const allowedKeys =
      new Set(
        COMPANY_PERMISSIONS.map(
          permission => permission.key
        )
      );

    const requestedKeys =
      Array.from(
        new Set(
          permissionKeys.filter(
            key => allowedKeys.has(key as any)
          )
        )
      );

    const role =
      await this.prisma.role.findFirst({
        where: {
          companyId,
          name: 'ADMIN'
        }
      });

    if (!role) {
      throw new Error(
        `Role ADMIN não encontrada para ${companyId}`
      );
    }

    const permissions =
      await this.prisma.permission.findMany({
        where: {
          companyId,
          key: {
            in: requestedKeys
          }
        }
      });

    await this.prisma.$transaction(
      async tx => {

        await tx.rolePermission.deleteMany({
          where: {
            roleId: role.id
          }
        });

        for (const permission of permissions) {

          await tx.rolePermission.create({
            data: {
              id: generateId(),
              roleId: role.id,
              permissionId: permission.id
            }
          });

        }
      }
    );

    return {
      companyId,
      role: 'ADMIN',
      permissions:
        permissions.map(
          permission => permission.key
        )
    };
  }

  async assignRole(
    userId: string,
    companyId: string,
    roleName: string
  ) {

    const role =
      await this.prisma.role.findFirst({

        where: {
          companyId,
          name: roleName
        }

      });

    if (!role) {

      throw new Error(
        `Role ${roleName} não encontrada`
      );

    }

    const exists =
      await this.prisma.userRole.findFirst({

        where: {
          userId,
          roleId: role.id
        }

      });

    if (!exists) {

      await this.prisma.userRole.create({

        data: {

          id: generateId(),

          userId,

          roleId: role.id

        }

      });

    }

  }

}
