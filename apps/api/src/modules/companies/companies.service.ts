import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RolesService } from '../roles/roles.service';
import { generateId } from '../../common/utils/id';

@Injectable()
export class CompaniesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly rolesService: RolesService
  ) {}

  async create(data: { name: string; cnpj?: string | null }) {

    const company = await this.prisma.company.create({
      data: {
        id: generateId(),
        name: data.name,
        cnpj: data.cnpj ?? null,
        kind: 'CLIENT',
        status: 'PENDING',
        isActive: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    await this.rolesService.ensureCompanyRoles(
      company.id
    );

    await this.rolesService.ensureCompanyPermissions(
      company.id
    );

    return company;
  }

  private async assertProtectedCompany(
    id: string
  ) {

    const company =
      await this.prisma.company.findUnique({

        where: {
          id
        }
      });

    if (!company) {
      throw new NotFoundException(
        'Company not found'
      );
    }

    if (company.kind === 'MASTER') {
      throw new ForbiddenException(
        'SYSTEM_COMPANY_PROTECTED'
      );
    }

    return company;
  }

  async findAll() {
    return this.prisma.company.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async findOne(id: string) {
    const company = await this.prisma.company.findUnique({ where: { id } });
    if (!company) throw new NotFoundException('Company not found');
    return company;
  }

  async update(id: string, data: { name?: string; cnpj?: string | null }) {
    await this.findOne(id);

    await this.assertProtectedCompany(
      id
    );
    return this.prisma.company.update({
      where: { id },
      data: {
        ...(data.name !== undefined ? { name: data.name } : {}),
        ...(data.cnpj !== undefined ? { cnpj: data.cnpj } : {}),
      },
    });
  }

  async remove(id: string) {

    await this.findOne(id);

    await this.assertProtectedCompany(
      id
    );

    await this.prisma.$transaction(async (tx) => {

      await tx.rolePermission.deleteMany({
        where: {
          Role: {
            companyId: id
          }
        }
      });

      await tx.userRole.deleteMany({
        where: {
          Role: {
            companyId: id
          }
        }
      });

      await tx.permission.deleteMany({
        where: {
          companyId: id
        }
      });

      await tx.role.deleteMany({
        where: {
          companyId: id
        }
      });

      await tx.auditLog.deleteMany({
        where: {
          companyId: id
        }
      });

      await tx.user.deleteMany({
        where: {
          companyId: id
        }
      });

      await tx.company.delete({
        where: {
          id
        }
      });

    });

    return {
      success: true
    };
  }

  // 🔥 ENTERPRISE: billing enforcement
  async ensureActive(companyId: string) {
    const company = await this.prisma.company.findUnique({
      where: { id: companyId }
    });

    if (!company) {
      throw new NotFoundException("Empresa não encontrada");
    }

    if (!company.isActive) {
      throw new ForbiddenException("Empresa inativa - pagamento necessário");
    }

    return company;
  }

  async activate(companyId: string) {

    await this.assertProtectedCompany(
      companyId
    );

    return this.prisma.company.update({
      where: { id: companyId },
      data: {
        isActive: true,
        status: 'ACTIVE'
      }
    });
  }

  async deactivate(companyId: string) {

    await this.assertProtectedCompany(
      companyId
    );

    return this.prisma.company.update({
      where: { id: companyId },
      data: {
        isActive: false,
        status: 'PENDING'
      }
    });
  }
}
