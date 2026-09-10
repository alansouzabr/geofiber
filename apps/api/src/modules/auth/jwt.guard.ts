import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';

import * as jwt from 'jsonwebtoken';

import { PrismaService } from '../prisma/prisma.service';

import { Reflector } from '@nestjs/core';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private prisma: PrismaService,
    private reflector: Reflector,
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const isPublic =
      this.reflector.get<boolean>(
        'isPublic',
        context.getHandler(),
      );

    if (isPublic) {
      return true;
    }

    const req =
      context
        .switchToHttp()
        .getRequest();

    const auth =
      req.headers.authorization;

    if (!auth) {
      throw new UnauthorizedException(
        'Token não fornecido',
      );
    }

    const token =
      auth.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException(
        'Token inválido',
      );
    }

    let decoded: any;

    try {
      decoded =
        jwt.verify(
          token,
          process.env.JWT_SECRET || 'secret',
        );
    } catch {
      throw new UnauthorizedException(
        'Token inválido',
      );
    }

    const user =
      await this.prisma.user.findFirst({
        where: {
          id: decoded.sub,
        },

        include: {
          Company: true,

          UserRole: {
            include: {
              Role: {
                include: {
                  RolePermission: {
                    include: {
                      Permission: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

    if (!user) {
      throw new UnauthorizedException(
        'Usuário não encontrado',
      );
    }

    /*
     * ETAPA35A3B_FUNCTIONAL_ROLE
     *
     * Roles __DELEGATED_USER__: acrescentam
     * permissões, mas nunca substituem o cargo
     * funcional ATENDENTE/TECNICO/etc.
     */
    const functionalRole =
      user.UserRole.find(
        userRole => {

          const roleName =
            userRole.Role?.name;


          return (
            !!roleName &&
            !roleName.startsWith(
              '__DELEGATED_USER__:'
            )
          );

        }
      )?.Role?.name;


    const role =
      functionalRole ||
      (user as any).role ||
      decoded.role ||
      'TECNICO';

    const permissions = Array.from(
      new Set(
        user.UserRole.flatMap(
          userRole =>
            userRole.Role?.RolePermission?.map(
              rolePermission =>
                rolePermission.Permission.key
            ) || []
        )
      )
    );

    const isPlatformRole =
      role === 'ROOT' ||
      role === 'MASTER';

    /*
     * ROOT / MASTER pertencem à plataforma.
     * Portanto não precisam obrigatoriamente
     * estar vinculados a um tenant para autenticar.
     */
    if (!user.Company && !isPlatformRole) {
      throw new ForbiddenException(
        'Usuário sem empresa',
      );
    }

    const company =
      user.Company
        ? {
            id: user.Company.id,
            name: user.Company.name,
            isActive: user.Company.isActive,
          }
        : null;

    req.companyInactive =
      company
        ? !company.isActive
        : false;

    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,

      role,

      permissions,

      companyId:
        user.companyId ?? null,

      company,

      companyName:
        company?.name ?? null,

      isActive:
        company
          ? company.isActive
          : true,
    };

    return true;
  }
}
