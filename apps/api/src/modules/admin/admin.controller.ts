import { Controller, Get, Patch, Param, Post, Delete, Body, UseGuards, ForbiddenException, NotFoundException, Req } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CompaniesService } from '../companies/companies.service';
import { UsersService } from '../users/users.service';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { generateId } from '../../common/utils/id';

@Controller('admin')
@UseGuards(RolesGuard)
@Roles('ROOT', 'MASTER')
export class AdminController {
  constructor(
      private prisma: PrismaService,
      private companies: CompaniesService,
      private usersService: UsersService
    ) {}

  @Get('stats')
  async stats() {
    const companies = await this.prisma.company.count();
    const users = await this.prisma.user.count();
    return { companies, users };
  }

    @Get('companies')
    async list() {

      const companies =
        await this.prisma.company.findMany({
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

      return companies.map((company) => ({
        ...company,

        User: company.User.map((user) => ({
          ...user,

          whatsapp:
            user.FieldTechnicianProfile?.whatsapp || null
        }))
      }));
    }

  @Get('users')
  async users() {
    const users = await this.prisma.user.findMany({
      include: {
        Company: true,

        UserRole: {
          include: {
            Role: true
          }
        },

        FieldTechnicianProfile: {
          select: {
            whatsapp: true
          }
        }
      },

      orderBy: {
        createdAt: 'desc'
      }
    });

    return users.map((user) => ({
      ...user,

      whatsapp:
        user.FieldTechnicianProfile?.whatsapp || null
    }));
  }

  /*
   * ETAPA35A19B_ADMIN_PLATFORM_USER_PROTECTION
   *
   * O fluxo comum de cadastro cria apenas
   * usuários de empresas CLIENT.
   */
  @Post('users')
  async createUser(@Body() body: any) {

    const companyId =
      String(
        body?.companyId ||
        ''
      ).trim();


    if (!companyId) {

      throw new ForbiddenException(
        'CLIENT_COMPANY_REQUIRED'
      );

    }


    const company =
      await this.prisma.company.findUnique({

        where: {
          id: companyId
        }

      });


    if (
      !company ||
      company.kind !== 'CLIENT'
    ) {

      throw new ForbiddenException(
        'CLIENT_COMPANY_REQUIRED'
      );

    }


    return this.usersService.create(
      body,
      {
        companyId
      }
    );

  }


  @Patch('users/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() body: any
  ) {

    /*
     * Segurança em profundidade.
     *
     * ROOT / MASTER podem atualizar dados
     * pessoais como nome, e-mail, senha
     * e WhatsApp.
     *
     * Nunca podem trocar:
     * - role
     * - companyId
     * - isActive
     * pelo fluxo comum de administração.
     */

    const target =
      await this.prisma.user.findUnique({

        where: {
          id
        },

        include: {

          UserRole: {

            include: {
              Role: true
            }

          }

        }

      });


    if (!target) {

      throw new NotFoundException(
        'USER_NOT_FOUND'
      );

    }


    const platformRole =
      target.UserRole.find(
        relation => {

          const role =
            relation.Role?.name;

          return (
            role === 'ROOT' ||
            role === 'MASTER'
          );

        }
      )?.Role?.name ||
      null;


    const isPlatformUser =
      Boolean(
        platformRole
      );


    if (
      isPlatformUser &&
      (
        body.role !== undefined ||
        body.companyId !== undefined ||
        body.isActive !== undefined
      )
    ) {

      throw new ForbiddenException(
        'SYSTEM_USER_PROTECTED'
      );

    }


    const allowedFunctionalRoles =
      new Set([
        'ADMIN',
        'ENGENHEIRO',
        'ANALISTA',
        'SUPERVISOR',
        'TECNICO',
        'AJUDANTE',
        'PROJETISTA',
        'RH',
        'FINANCEIRO',
        'COMERCIAL',
        'ATENDENTE',
        'USER'
      ]);


    let normalizedRole:
      string |
      null =
      null;


    if (
      !isPlatformUser &&
      body.role !== undefined
    ) {

      normalizedRole =
        String(
          body.role
        )
          .trim()
          .toUpperCase();


      if (
        !allowedFunctionalRoles.has(
          normalizedRole
        )
      ) {

        throw new ForbiddenException(
          'ROLE_NOT_ALLOWED'
        );

      }

    }


    const requestedCompanyId =
      !isPlatformUser &&
      body.companyId
        ? String(
            body.companyId
          ).trim()
        : target.companyId;


    const companyChanged =
      Boolean(
        !isPlatformUser &&
        requestedCompanyId &&
        requestedCompanyId !==
          target.companyId
      );


    if (
      companyChanged &&
      !normalizedRole
    ) {

      throw new ForbiddenException(
        'ROLE_REQUIRED_FOR_COMPANY_CHANGE'
      );

    }


    if (
      !isPlatformUser &&
      requestedCompanyId
    ) {

      const requestedCompany =
        await this.prisma.company.findUnique({

          where: {
            id: requestedCompanyId
          }

        });


      if (
        !requestedCompany ||
        requestedCompany.kind !==
          'CLIENT'
      ) {

        throw new ForbiddenException(
          'CLIENT_COMPANY_REQUIRED'
        );

      }

    }


    const data: any = {};


    if (body.name) {
      data.name = body.name;
    }


    if (body.email) {
      data.email = body.email;
    }


    if (body.password) {

      data.passwordHash =
        await bcrypt.hash(
          body.password,
          10
        );

    }


    if (
      !isPlatformUser &&
      body.isActive !== undefined
    ) {

      data.isActive =
        body.isActive;

    }


    if (
      !isPlatformUser &&
      body.companyId
    ) {

      data.companyId =
        requestedCompanyId;

    }


    const user =
      await this.prisma.user.update({

        where: {
          id
        },

        data

      });


    /*
     * WhatsApp.
     *
     * Funciona também para ROOT / MASTER.
     * Caso o perfil ainda não exista,
     * ele é criado.
     */
    if (
      (
        body.whatsapp !== undefined ||
        companyChanged
      ) &&
      user.companyId
    ) {

      const profile =
        await this.prisma
          .fieldTechnicianProfile
          .findUnique({

            where: {
              userId: id
            }

          });


      if (profile) {

        await this.prisma
          .fieldTechnicianProfile
          .update({

            where: {
              userId: id
            },

            data: {

              ...(body.whatsapp !== undefined
                ? {
                    whatsapp:
                      body.whatsapp ||
                      null
                  }
                : {}),

              ...(companyChanged
                ? {
                    companyId:
                      user.companyId
                  }
                : {}),

              updatedAt:
                new Date()

            }

          });

      } else if (
        body.whatsapp !== undefined
      ) {

        await this.prisma
          .fieldTechnicianProfile
          .create({

            data: {

              id:
                generateId(),

              companyId:
                user.companyId,

              userId:
                id,

              whatsapp:
                body.whatsapp ||
                null,

              updatedAt:
                new Date()

            }

          });

      }

    }


    /*
     * Cargo funcional.
     *
     * Nunca ROOT / MASTER.
     *
     * Roles __DELEGATED_USER__ são preservados
     * quando o usuário permanece na mesma empresa.
     *
     * Em mudança de empresa, todos os vínculos
     * antigos são removidos porque pertencem
     * ao tenant anterior.
     */
    if (
      !isPlatformUser &&
      normalizedRole &&
      user.companyId
    ) {

      let role =
        await this.prisma.role.findFirst({

          where: {

            companyId:
              user.companyId,

            name:
              normalizedRole

          }

        });


      /*
       * ANALISTA é o único cargo funcional
       * oficialmente provisionável sob demanda
       * na arquitetura atual.
       */
      if (
        !role &&
        normalizedRole ===
          'ANALISTA'
      ) {

        role =
          await this.prisma.role.create({

            data: {

              id:
                generateId(),

              companyId:
                user.companyId,

              name:
                normalizedRole

            }

          });

      }


      if (!role) {

        throw new ForbiddenException(
          'ROLE_NOT_FOUND'
        );

      }


      const currentRoleLinks =
        await this.prisma.userRole.findMany({

          where: {
            userId: id
          },

          include: {
            Role: true
          }

        });


      const linksToDelete =
        companyChanged
          ? currentRoleLinks
              .map(
                link =>
                  link.id
              )
          : currentRoleLinks
              .filter(
                link =>
                  !String(
                    link.Role?.name ||
                    ''
                  ).startsWith(
                    '__DELEGATED_USER__:'
                  )
              )
              .map(
                link =>
                  link.id
              );


      if (
        linksToDelete.length >
        0
      ) {

        await this.prisma.userRole.deleteMany({

          where: {

            id: {
              in:
                linksToDelete
            }

          }

        });

      }


      await this.prisma.userRole.create({

        data: {

          id:
            generateId(),

          userId:
            id,

          roleId:
            role.id

        }

      });

    }


    return user;

  }


  @Delete('users/:id')
  async deleteUser(
    @Param('id') id: string,
    @Req() req: any
  ) {
    const companyId = req.user?.companyId;

    if (!companyId) {
      throw new ForbiddenException(
        'COMPANY_CONTEXT_REQUIRED'
      );
    }

    return this.usersService.delete(
      id,
      companyId
    );
  }

  @Patch('company/:id/activate')
  async activateCompany(@Param('id') id: string) {
    return this.companies.activate(id);
  }

  @Patch('company/:id/deactivate')
  async deactivateCompany(@Param('id') id: string) {
    return this.companies.deactivate(id);
  }

  @Delete('company/:id')
  async deleteCompany(
    @Param('id') id: string
  ) {
    return this.companies.remove(id);
  }
}
