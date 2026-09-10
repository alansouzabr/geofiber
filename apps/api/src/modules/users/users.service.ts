import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PlanLimitService } from '../../common/limits/plan-limit.service';
import * as bcrypt from 'bcrypt';
import { generateId } from '../../common/utils/id';

const DELEGATED_ROLE_PREFIX = '__DELEGATED_USER__:';


/*
 * ETAPA35A3D_DELEGABLE_PERMISSION_CATALOG
 *
 * Usuários comuns podem receber somente
 * os cinco módulos definidos pela plataforma.
 *
 * Empresa / Configurações / Financeiro
 * permanecem fora da delegação.
 */
const DELEGABLE_PERMISSION_KEYS = [
  'module.dashboard',

  'module.training',
  'training.view',

  'module.files',
  'files.view',
  'files.download',
  'kmz.view',
  'kmz.edit',
  'trt.view',
  'trt.approve',

  'module.projects',
  'projects.view',
  'projects.edit',

  'module.execution'
];


const DELEGABLE_PERMISSION_KEY_SET =
  new Set(
    DELEGABLE_PERMISSION_KEYS
  );



/*
 * ETAPA35A4_FUNCTIONAL_ROLES
 *
 * Cargo funcional e permissões são conceitos separados.
 *
 * ROOT / MASTER não podem ser atribuídos pelo fluxo
 * normal /users.
 *
 * ANALISTA pode ser criado sob demanda por empresa.
 */
const FUNCTIONAL_ROLE_NAMES = [
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
] as const;


const FUNCTIONAL_ROLE_NAME_SET =
  new Set<string>(
    FUNCTIONAL_ROLE_NAMES
  );

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private limit: PlanLimitService
  ) {}


  /*
   * ETAPA35A3B_ADMIN_DELEGATED_PERMISSIONS
   */
  /*
   * ETAPA35A4_FUNCTIONAL_ROLE_RESOLVER
   */
  private normalizeFunctionalRoleName(
    value: unknown,
    fallback = 'TECNICO'
  ) {

    const raw =
      typeof value === 'string'
        ? value
        : fallback;


    const name =
      raw
        .trim()
        .toUpperCase();


    if (
      !FUNCTIONAL_ROLE_NAME_SET.has(
        name
      )
    ) {

      throw new ForbiddenException(
        'ROLE_NOT_ALLOWED'
      );

    }


    return name;

  }


  private async resolveFunctionalRole(
    companyId: string,
    value: unknown,
    fallback = 'TECNICO'
  ) {

    const name =
      this.normalizeFunctionalRoleName(
        value,
        fallback
      );


    const existing =
      await this.prisma.role.findFirst({

        where: {
          companyId,
          name
        }

      });


    if (existing) {
      return existing;
    }


    /*
     * Somente ANALISTA é criado sob demanda nesta etapa.
     *
     * Os demais cargos já fazem parte da estrutura
     * previamente provisionada da empresa.
     */
    if (name !== 'ANALISTA') {

      throw new ForbiddenException(
        'ROLE_NOT_FOUND'
      );

    }


    try {

      return await this.prisma.role.create({

        data: {
          id: generateId(),
          companyId,
          name
        }

      });

    } catch (error: any) {

      /*
       * Proteção contra duas requisições concorrentes
       * tentando criar ANALISTA na mesma empresa.
       */
      if (
        error?.code === 'P2002'
      ) {

        const raced =
          await this.prisma.role.findFirst({

            where: {
              companyId,
              name
            }

          });


        if (raced) {
          return raced;
        }

      }


      throw error;

    }

  }


  private isDelegatedRoleName(
    name?: string | null
  ) {

    return (
      typeof name === 'string' &&
      name.startsWith(
        DELEGATED_ROLE_PREFIX
      )
    );

  }


  private delegatedRoleName(
    userId: string
  ) {

    return (
      DELEGATED_ROLE_PREFIX
      + userId
    );

  }


  private functionalRoleFromLinks(
    links: any[]
  ) {

    return (
      links.find(
        link =>
          link?.Role &&
          !this.isDelegatedRoleName(
            link.Role.name
          )
      )?.Role ||
      null
    );

  }

  async create(dto: any, user: any) {

    console.log("================================");
    console.log("DTO RECEBIDO:");
    console.log(dto);
    console.log("ROLE:", dto.role);
    console.log("================================");

    const requestedRoleName =
      this.normalizeFunctionalRoleName(
        dto.role,
        'TECNICO'
      );

    const hash =
      await bcrypt.hash(
        dto.password,
        10
      );

    const newUser =
      await this.prisma.user.create({

        data: {
          name: dto.name,
          email: dto.email,
          passwordHash: hash,
          companyId: user.companyId,
          isActive: true,
          id: generateId(),
          updatedAt: new Date(),
        }
      });

    console.log('ROLE_RECEBIDA', dto.role)


    const role =
      await this.resolveFunctionalRole(
        user.companyId,
        requestedRoleName,
        'TECNICO'
      );

    console.log('ROLE_ENCONTRADA', role)

    if (role) {

      await this.prisma.userRole.create({

        data: {
          id: generateId(),
          userId: newUser.id,
          roleId: role.id
        }
      });
    }

    return newUser;
  }


  private async assertProtectedUser(
    id: string,
    companyId: string
  ) {

    const user =
      await this.prisma.user.findFirst({

        where: {
          id,
          companyId
        },

        include: {
          UserRole: {
            include: {
              Role: true
            }
          },


          FieldTechnicianProfile: {

            select: {

              phone: true,

              whatsapp: true

            }

          }
        }
      });

    if (!user) {
      throw new Error('USER_NOT_FOUND');
    }

    const protectedUser =
      user.UserRole?.some(
        x =>
          x.Role?.name === 'ROOT' ||
          x.Role?.name === 'MASTER'
      );

    if (protectedUser) {
      throw new ForbiddenException(
        'SYSTEM_USER_PROTECTED'
      );
    }

    return user;
  }

    async list(companyId: string) {

      const users =
        await this.prisma.user.findMany({

          where: {
            companyId
          },

          include: {

            UserRole: {
              include: {
                Role: true
              }
            },

            FieldTechnicianProfile: {
              select: {
                phone: true,
                whatsapp: true
              }
            }

          },

          orderBy: {
            name: 'asc'
          }

        });

      return users.map(user => ({

        id: user.id,

        name: user.name,

        email: user.email,

        phone:
          user.FieldTechnicianProfile?.phone ||
          null,

        whatsapp:
          user.FieldTechnicianProfile?.whatsapp ||
          null,

        isActive:
          user.isActive,

        role:
          this.functionalRoleFromLinks(
            user.UserRole
          )?.name ||
          'TECNICO'

      }));

    }

    async update(
      id: string,
      dto: any,
      companyId: string
    ) {

      const user =
        await this.prisma.user.findFirst({

          where: {
            id,
            companyId
          }

        });

      if (!user) {
        throw new Error('USER_NOT_FOUND');
      }

      await this.assertProtectedUser(
        id,
        companyId
      );

      const data: any = {};

      if (dto.name) {
        data.name = dto.name;
      }

      if (dto.email) {
        data.email = dto.email;
      }

      if (dto.isActive !== undefined) {
        data.isActive = dto.isActive;
      }

      if (dto.role) {


        const role =
          await this.resolveFunctionalRole(
            companyId,
            dto.role,
            'TECNICO'
          );

        if (role) {

          /*
           * Troca SOMENTE o cargo funcional.
           *
           * Roles internos __DELEGATED_USER__:
           * precisam sobreviver à edição do usuário.
           */
          const currentRoleLinks =
            await this.prisma.userRole.findMany({
              where: {
                userId: id
              },
              include: {
                Role: true
              }
            });


          const functionalRoleLinkIds =
            currentRoleLinks
              .filter(
                link =>
                  !this.isDelegatedRoleName(
                    link.Role?.name
                  )
              )
              .map(
                link =>
                  link.id
              );


          if (
            functionalRoleLinkIds.length > 0
          ) {

            await this.prisma.userRole.deleteMany({
              where: {
                id: {
                  in:
                    functionalRoleLinkIds
                }
              }
            });

          }

          await this.prisma.userRole.create({

            data: {
              id: generateId(),
              userId: id,
              roleId: role.id
            }

          });

        }

      }

      const updatedUser =
        await this.prisma.user.update({

          where: {
            id
          },

          data

        });


      if (
        dto.whatsapp !== undefined ||
        dto.phone !== undefined
      ) {

        await this.prisma.fieldTechnicianProfile.upsert({

          where: {
            userId: id
          },

          create: {

            id: generateId(),

            companyId,

            userId: id,

            updatedAt: new Date(),

            whatsapp:
              dto.whatsapp !== undefined
                ? (dto.whatsapp || null)
                : null,

            phone:
              dto.phone !== undefined
                ? (dto.phone || null)
                : null

          },

          update: {

            ...(dto.whatsapp !== undefined
              ? {
                  whatsapp:
                    dto.whatsapp || null
                }
              : {}),

            ...(dto.phone !== undefined
              ? {
                  phone:
                    dto.phone || null
                }
              : {}),

            updatedAt:
              new Date()

          }

        });

      }

      return updatedUser;

    }


  async resetPassword(
    id: string,
    password: string,
    companyId: string
  ) {

    const user = await this.prisma.user.findFirst({
      where: {
        id,
        companyId
      }
    });

    if (!user) {
      throw new Error('USER_NOT_FOUND');
    }

    
    await this.assertProtectedUser(
      id,
      companyId
    );

const hash =
      await bcrypt.hash(password, 10);

    return this.prisma.user.update({
      where: { id },
      data: {
        passwordHash: hash
      }
    });
  }

  async toggle(
    id: string,
    companyId: string
  ) {

    const user =
      await this.prisma.user.findFirst({

        where: {
          id,
          companyId
        },

        include: {
          UserRole: {
            include: {
              Role: true
            }
          }
        }
      });

    if (!user) {
      throw new Error('USER_NOT_FOUND');
    }

    await this.assertProtectedUser(
        id,
        companyId
      );

      return this.prisma.user.update({
      where: { id },
      data: {
        isActive: !user.isActive
      }
    });
  }

  async delete(
    id: string,
    companyId: string
  ) {

    const user =
      await this.prisma.user.findFirst({
        where: {
          id,
          companyId
        },
        include: {
          UserRole: {
            include: {
              Role: true
            }
          }
        }
      });

    if (!user) {
      throw new Error('USER_NOT_FOUND');
    }

    await this.assertProtectedUser(
      id,
      companyId
    );

    return this.prisma.$transaction(async tx => {

      /*
       * PRESERVAR AUDITORIA.
       *
       * O usuário será removido, mas seus eventos
       * históricos continuam existindo.
       *
       * Somente removemos a referência ao ator.
       */
      await tx.auditLog.updateMany({
        where: {
          actorUserId: id
        },
        data: {
          actorUserId: null
        }
      });

      /*
       * PERFIL DO TÉCNICO.
       */
      await tx.fieldTechnicianProfile.deleteMany({
        where: {
          userId: id
        }
      });

      /*
       * VÍNCULOS RBAC.
       */
      await tx.userRole.deleteMany({
        where: {
          userId: id
        }
      });

      /*
       * GED — COMPANY FILE.
       *
       * O arquivo pertence à empresa e deve permanecer.
       * Somente removemos a referência pessoal ao usuário
       * que está sendo excluído.
       */
      await tx.companyFile.updateMany({
        where: {
          uploadedBy: id
        },
        data: {
          uploadedBy: null
        }
      });

      /*
       * GED — GLOBAL LIBRARY.
       *
       * A biblioteca global deve permanecer intacta.
       * Somente removemos a referência pessoal ao usuário.
       */
      await tx.globalLibraryFile.updateMany({
        where: {
          uploadedBy: id
        },
        data: {
          uploadedBy: null
        }
      });

      /*
       * USUÁRIO.
       */
      return tx.user.delete({
        where: {
          id
        }
      });
    });
  }

  private async resolveDelegationContext(
    targetUserId: string,
    actor: any
  ) {

    if (
      !actor ||
      actor.role !== 'ADMIN' ||
      !actor.id ||
      !actor.companyId
    ) {

      throw new ForbiddenException(
        'ADMIN_DELEGATION_REQUIRED'
      );

    }


    const target =
      await this.prisma.user.findFirst({

        where: {
          id: targetUserId,
          companyId:
            actor.companyId
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

      throw new ForbiddenException(
        'TARGET_USER_OUTSIDE_COMPANY'
      );

    }


    const functionalLinks =
      target.UserRole.filter(
        link =>
          link.Role &&
          !this.isDelegatedRoleName(
            link.Role.name
          )
      );


    if (
      functionalLinks.length !== 1 ||
      !functionalLinks[0]?.Role
    ) {

      throw new ForbiddenException(
        'TARGET_FUNCTIONAL_ROLE_INVALID'
      );

    }


    const functionalRole =
      functionalLinks[0].Role;


    if (
      functionalRole.companyId !==
        actor.companyId
    ) {

      throw new ForbiddenException(
        'TARGET_ROLE_OUTSIDE_COMPANY'
      );

    }


    if (
      [
        'ROOT',
        'MASTER',
        'ADMIN'
      ].includes(
        functionalRole.name
      )
    ) {

      throw new ForbiddenException(
        'TARGET_ROLE_PROTECTED'
      );

    }


    const actorUser =
      await this.prisma.user.findFirst({

        where: {
          id: actor.id,
          companyId:
            actor.companyId
        },

        include: {

          UserRole: {

            include: {

              Role: {

                include: {

                  RolePermission: {

                    include: {
                      Permission: true
                    }

                  }

                }

              }

            }

          }

        }

      });


    if (!actorUser) {

      throw new ForbiddenException(
        'ADMIN_USER_NOT_FOUND'
      );

    }


    const adminRole =
      actorUser.UserRole.find(
        link =>
          link.Role?.name ===
            'ADMIN' &&
          link.Role?.companyId ===
            actor.companyId
      )?.Role;


    if (!adminRole) {

      throw new ForbiddenException(
        'ADMIN_ROLE_NOT_FOUND'
      );

    }


    /*
     * Primeiro calculamos todo o teto real
     * do ADMIN, inclusive permissões que
     * NÃO são delegáveis.
     */
    const adminPermissions =
      adminRole.RolePermission
        .map(
          item =>
            item.Permission
        )
        .filter(
          permission =>
            permission.companyId ===
              actor.companyId
        );


    const adminPermissionKeys =
      new Set(
        adminPermissions.map(
          permission =>
            permission.key
        )
      );


    /*
     * O ADMIN precisa continuar tendo
     * autorização para administrar usuários
     * e acessar Configurações.
     *
     * Essas duas permissões NÃO são
     * repassadas ao usuário comum.
     */
    if (
      !adminPermissionKeys.has(
        'company.users'
      ) ||
      !adminPermissionKeys.has(
        'module.settings'
      )
    ) {

      throw new ForbiddenException(
        'ADMIN_DELEGATION_NOT_ALLOWED'
      );

    }


    /*
     * Teto delegável =
     * interseção entre:
     *
     * 1. permissões reais do ADMIN;
     * 2. catálogo fixo dos cinco módulos.
     */
    const ceilingPermissions =
      adminPermissions.filter(
        permission =>
          DELEGABLE_PERMISSION_KEY_SET
            .has(
              permission.key
            )
      );


    const ceilingKeys =
      new Set(
        ceilingPermissions.map(
          permission =>
            permission.key
        )
      );


    const delegatedName =
      this.delegatedRoleName(
        targetUserId
      );


    const delegatedRole =
      await this.prisma.role.findFirst({

        where: {
          companyId:
            actor.companyId,
          name:
            delegatedName
        },

        include: {

          RolePermission: {
            include: {
              Permission: true
            }
          },

          UserRole: true

        }

      });


    if (
      delegatedRole &&
      delegatedRole.UserRole.some(
        link =>
          link.userId !==
            targetUserId
      )
    ) {

      throw new ForbiddenException(
        'DELEGATED_ROLE_OWNERSHIP_INVALID'
      );

    }


    return {
      companyId:
        actor.companyId,

      target,

      functionalRole,

      delegatedName,

      delegatedRole,

      ceilingPermissions,

      ceilingKeys
    };

  }


  async getDelegatedRolePermissions(
    targetUserId: string,
    actor: any
  ) {

    const context =
      await this.resolveDelegationContext(
        targetUserId,
        actor
      );


    const currentKeys =
      context.delegatedRole
        ?.RolePermission
        ?.map(
          item =>
            item.Permission.key
        ) ||
      [];


    const permissions =
      currentKeys.filter(
        key =>
          context.ceilingKeys.has(
            key
          )
      );


    const outsideCeilingPermissions =
      currentKeys.filter(
        key =>
          !context.ceilingKeys.has(
            key
          )
      );


    const availablePermissions =
      context.ceilingPermissions
        .map(
          permission => ({
            key:
              permission.key,
            description:
              permission.description
          })
        )
        .sort(
          (a, b) =>
            a.key.localeCompare(
              b.key
            )
        );


    return {

      companyId:
        context.companyId,

      user: {
        id:
          context.target.id,
        name:
          context.target.name,
        email:
          context.target.email,
        isActive:
          context.target.isActive
      },

      role: {
        id:
          context.functionalRole.id,
        name:
          context.functionalRole.name
      },

      availablePermissions,

      permissions,

      outsideCeilingPermissions,

      delegatedRoleId:
        context.delegatedRole?.id ||
        null

    };

  }


  async setDelegatedRolePermissions(
    targetUserId: string,
    permissionKeys: string[],
    actor: any
  ) {

    const context =
      await this.resolveDelegationContext(
        targetUserId,
        actor
      );


    const requestedKeys =
      Array.from(
        new Set(
          permissionKeys
            .filter(
              key =>
                typeof key ===
                  'string'
            )
            .map(
              key =>
                key.trim()
            )
            .filter(Boolean)
        )
      );


    /*
     * Segurança server-side:
     *
     * mesmo que alguém ignore o frontend
     * e chame a API manualmente,
     * somente as permissões dos cinco
     * módulos podem ser delegadas.
     */
    const notDelegableKeys =
      requestedKeys.filter(
        key =>
          !DELEGABLE_PERMISSION_KEY_SET
            .has(
              key
            )
      );


    if (
      notDelegableKeys.length > 0
    ) {

      throw new ForbiddenException(
        'PERMISSION_NOT_DELEGABLE'
      );

    }


    const forbiddenKeys =
      requestedKeys.filter(
        key =>
          !context.ceilingKeys.has(
            key
          )
      );


    if (
      forbiddenKeys.length > 0
    ) {

      throw new ForbiddenException(
        'PERMISSION_ABOVE_ADMIN_CEILING'
      );

    }


    const requestedPermissions =
      requestedKeys.length > 0

        ? await this.prisma.permission.findMany({

            where: {
              companyId:
                context.companyId,

              key: {
                in:
                  requestedKeys
              }
            }

          })

        : [];


    if (
      requestedPermissions.length !==
        requestedKeys.length
    ) {

      throw new ForbiddenException(
        'PERMISSION_NOT_AVAILABLE'
      );

    }


    await this.prisma.$transaction(
      async tx => {

        /*
         * ETAPA35A3B2_DELEGATED_ROLE_ID
         *
         * Não mantemos o objeto Prisma
         * Role carregado com includes.
         *
         * O create() retorna o Role simples,
         * portanto usamos apenas o ID,
         * que é tudo o que esta transação
         * realmente precisa.
         */
        let delegatedRoleId:
          string | null =
            context.delegatedRole?.id ||
            null;


        if (
          requestedKeys.length === 0
        ) {

          if (delegatedRoleId) {

            await tx.rolePermission.deleteMany({
              where: {
                roleId:
                  delegatedRoleId
              }
            });


            await tx.userRole.deleteMany({
              where: {
                roleId:
                  delegatedRoleId,
                userId:
                  targetUserId
              }
            });


            const remainingLinks =
              await tx.userRole.count({
                where: {
                  roleId:
                    delegatedRoleId
                }
              });


            if (
              remainingLinks === 0
            ) {

              await tx.role.delete({
                where: {
                  id:
                    delegatedRoleId
                }
              });

            }

          }


          return;

        }


        if (!delegatedRoleId) {

          const createdDelegatedRole =
            await tx.role.create({

              data: {
                id:
                  generateId(),

                companyId:
                  context.companyId,

                name:
                  context.delegatedName
              }

            });


          delegatedRoleId =
            createdDelegatedRole.id;

        }


        /*
         * Narrowing explícito para o TypeScript
         * e proteção contra qualquer estado
         * impossível/inconsistente.
         */
        if (!delegatedRoleId) {

          throw new ForbiddenException(
            'DELEGATED_ROLE_CREATE_FAILED'
          );

        }


        const userRoleExists =
          await tx.userRole.findFirst({

            where: {
              userId:
                targetUserId,
              roleId:
                delegatedRoleId
            }

          });


        if (!userRoleExists) {

          await tx.userRole.create({

            data: {
              id:
                generateId(),

              userId:
                targetUserId,

              roleId:
                delegatedRoleId
            }

          });

        }


        /*
         * Role delegado é exclusivo do usuário.
         *
         * Substituímos integralmente sua lista
         * para garantir que ela nunca fique acima
         * do teto atual do ADMIN que está salvando.
         */
        await tx.rolePermission.deleteMany({
          where: {
            roleId:
              delegatedRoleId
          }
        });


        for (
          const permission
          of requestedPermissions
        ) {

          await tx.rolePermission.create({

            data: {
              id:
                generateId(),

              roleId:
                delegatedRoleId,

              permissionId:
                permission.id
            }

          });

        }

      }
    );


    return this
      .getDelegatedRolePermissions(
        targetUserId,
        actor
      );

  }

}