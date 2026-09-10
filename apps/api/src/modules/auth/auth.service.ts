import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
  BadRequestException
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { RolesService } from '../roles/roles.service';
import {
  INITIAL_ROLE_MAP,
  ROLE
} from '../roles/roles.constants';

import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { generateId } from '../../common/utils/id';

@Injectable()
export class AuthService {

  constructor(
    private prisma: PrismaService,
    private rolesService: RolesService
  ) {}

  async register(dto: any) {

    try {

      const exists = await this.prisma.user.findFirst({
        where: {
          email: dto.email
        }
      });

      if (exists) {
        throw new BadRequestException(
          'Email já cadastrado'
        );
      }

      const hash = await bcrypt.hash(
        dto.password,
        10
      );

      const company = await this.prisma.company.create({
        data: {

          name: dto.name,

          razaoSocial:
            dto.personType === 'CNPJ'
              ? dto.razaoSocial || dto.name
              : dto.name,

          cnpj:
            dto.personType === 'CNPJ'
              ? dto.cnpj?.replace(/\D/g, '')
              : null,

          isActive: false,
            kind: 'CLIENT',
            status: 'PENDING',
            id: generateId(),
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

      const user = await this.prisma.user.create({
        data: {

          email: dto.email,

          passwordHash: hash,  // mudado de password para passwordHash

          name: dto.name,

          companyId: company.id, id: generateId(), createdAt: new Date(), updatedAt: new Date(),
        },
      });


      /*
       * Cadastro público:
       * o WhatsApp informado em /registrar pertence ao
       * FieldTechnicianProfile do usuário.
       *
       * Não gravar whatsapp diretamente em User.
       */
      if (dto.whatsapp !== undefined || dto.phone !== undefined) {

        await this.prisma.fieldTechnicianProfile.upsert({

          where: {
            userId: user.id
          },

          create: {
            id: generateId(),
            companyId: company.id,
            userId: user.id,
            whatsapp:
              dto.whatsapp
                ? dto.whatsapp.replace(/\D/g, '')
                : null,
            phone:
              dto.phone
                ? dto.phone.replace(/\D/g, '')
                : null,
            updatedAt: new Date()
          },

          update: {
            ...(dto.whatsapp !== undefined
              ? {
                  whatsapp:
                    dto.whatsapp
                      ? dto.whatsapp.replace(/\D/g, '')
                      : null
                }
              : {}),

            ...(dto.phone !== undefined
              ? {
                  phone:
                    dto.phone
                      ? dto.phone.replace(/\D/g, '')
                      : null
                }
              : {}),

            updatedAt: new Date()
          }

        });

      }

      const initialRole =
        INITIAL_ROLE_MAP[
          company.kind as keyof typeof INITIAL_ROLE_MAP
        ] ?? 'ADMIN';

      await this.rolesService.assignRole(
        user.id,
        company.id,
        initialRole
      );

    const token = jwt.sign(
        {
          sub: user.id,
          email: user.email,
          companyId: user.companyId,  // mudado de CompanyId para companyId
        },
        process.env.JWT_SECRET || 'secret',
        {
          expiresIn: '7d'
        }
      );

      return {
          token,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            companyId: user.companyId
          }
      };
    } catch (error) {
      throw error;
    }
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findFirst({
      where: { email },
      include: {
        Company: true,
        UserRole: {
          include: {
            Role: true
          }
        }
      }
    });

    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }




const passwordValid = await bcrypt.compare(
  password,
  user.passwordHash
);


    if (!passwordValid) {
        throw new UnauthorizedException('Senha inválida');
      }
        const role =
      user.UserRole?.[0]?.Role?.name ??
      ROLE.TECNICO;

        if (
            role !== ROLE.ROOT &&
            role !== ROLE.MASTER &&
            user.Company &&
            (
              user.Company.status !== 'ACTIVE' ||
              !user.Company.isActive
            )
          ) {
            throw new ForbiddenException(
              'Empresa aguardando aprovação do administrador.'
            );
          }


    const token = jwt.sign(
        {
          sub: user.id,
          email: user.email,
          companyId: user.companyId,
          companyKind: user.Company?.kind,
          companyStatus: user.Company?.status,
          role,
        },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '7d' }
      );

    return {
        token,
        role,
        companyId: user.companyId,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          companyId: user.companyId,
          isActive: user.isActive
        }
      };
  }
}
