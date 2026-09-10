import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  Prisma,
} from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CompanyProfileService {

  constructor(
    private readonly prisma: PrismaService,
  ) {}


  private readonly profileSelect = {
    id: true,
    name: true,
    cnpj: true,
    razaoSocial: true,
    isActive: true,
    kind: true,
    status: true,

    responsavelTecnico: true,
    registroProfissional: true,

    personType: true,
    firstName: true,
    lastName: true,
    cpf: true,

    country: true,
    cep: true,
    address: true,
    addressNumber: true,
    complement: true,
    district: true,
    city: true,
    state: true,
    phone: true,
    email: true,

    Plan: {
      select: {
        id: true,
        name: true,
      },
    },
  } as const;


  private roleOf(
    user: any,
  ) {
    return String(
      user?.role || '',
    ).toUpperCase();
  }


  private isPlatformRole(
    user: any,
  ) {
    const role =
      this.roleOf(user);

    return (
      role === 'ROOT' ||
      role === 'MASTER'
    );
  }


  private canEdit(
    user: any,
  ) {
    const role =
      this.roleOf(user);

    return (
      role === 'ROOT' ||
      role === 'MASTER' ||
      role === 'ADMIN'
    );
  }


  private authorizeCompanyAccess(
    companyId: string,
    user: any,
  ) {

    if (!user) {
      throw new ForbiddenException(
        'Usuário não autenticado.',
      );
    }

    /*
     * ROOT / MASTER são papéis da plataforma.
     * Eles podem administrar qualquer tenant.
     */
    if (
      this.isPlatformRole(user)
    ) {
      return;
    }

    /*
     * Usuários corporativos somente
     * enxergam sua própria empresa.
     */
    if (
      !user.companyId ||
      String(user.companyId) !==
        String(companyId)
    ) {
      throw new ForbiddenException(
        'Acesso negado: empresa não pertence ao usuário.',
      );
    }
  }


  private authorizeCompanyWrite(
    companyId: string,
    user: any,
  ) {

    this.authorizeCompanyAccess(
      companyId,
      user,
    );

    if (!this.canEdit(user)) {
      throw new ForbiddenException(
        'Acesso somente leitura aos dados da empresa.',
      );
    }
  }


  private async resolveCurrentCompanyId(
    user: any,
  ): Promise<string> {

    if (!user) {
      throw new ForbiddenException(
        'Usuário não autenticado.',
      );
    }

    /*
     * Para ROOT / MASTER o contexto canônico
     * de /empresa/dados é a empresa MASTER
     * da plataforma.
     *
     * Não usamos ID hardcoded.
     */
    if (
      this.isPlatformRole(user)
    ) {

      const platformCompany =
        await this.prisma.company.findFirst({
          where: {
            kind: 'MASTER',
          },

          orderBy: {
            createdAt: 'asc',
          },

          select: {
            id: true,
          },
        });

      if (!platformCompany) {
        throw new NotFoundException(
          'Empresa MASTER da plataforma não encontrada.',
        );
      }

      return platformCompany.id;
    }

    const companyId =
      String(
        user.companyId || '',
      ).trim();

    if (!companyId) {
      throw new ForbiddenException(
        'Usuário sem empresa vinculada.',
      );
    }

    return companyId;
  }


  private async findProfile(
    companyId: string,
  ) {

    const company =
      await this.prisma.company.findUnique({
        where: {
          id: companyId,
        },

        select:
          this.profileSelect,
      });

    if (!company) {
      throw new NotFoundException(
        'Empresa não encontrada.',
      );
    }

    return company;
  }


  private publicProfile(
    company: any,
  ) {

    const {
      Plan,
      ...rest
    } = company;

    return {
      ...rest,

      /*
       * Mantemos "plan" em minúsculo porque
       * o frontend histórico já usa esse shape.
       */
      plan:
        Plan || null,
    };
  }


  async getCurrent(
    user: any,
  ) {

    const companyId =
      await this.resolveCurrentCompanyId(
        user,
      );

    return this.get(
      companyId,
      user,
    );
  }


  async updateCurrent(
    body: any,
    user: any,
  ) {

    const companyId =
      await this.resolveCurrentCompanyId(
        user,
      );

    return this.update(
      companyId,
      body,
      user,
    );
  }


  async get(
    companyId: string,
    user: any,
  ) {

    this.authorizeCompanyAccess(
      companyId,
      user,
    );

    const company =
      await this.findProfile(
        companyId,
      );

    return {
      company:
        this.publicProfile(company),

      canEdit:
        this.canEdit(user),
    };
  }


  private has(
    body: any,
    key: string,
  ) {
    return (
      body !== null &&
      typeof body === 'object' &&
      Object.prototype.hasOwnProperty.call(
        body,
        key,
      )
    );
  }


  private nullableText(
    value: any,
  ): string | null {

    const normalized =
      String(
        value ?? '',
      ).trim();

    return normalized || null;
  }


  private documentDigits(
    value: any,
  ): string | null {

    const digits =
      String(
        value ?? '',
      ).replace(
        /\D/g,
        '',
      );

    return digits || null;
  }


  async update(
    companyId: string,
    body: any,
    user: any,
  ) {

    this.authorizeCompanyWrite(
      companyId,
      user,
    );

    const current =
      await this.findProfile(
        companyId,
      );

    const data:
      Record<string, any> = {};


    if (
      this.has(
        body,
        'personType',
      )
    ) {

      const raw =
        String(
          body.personType || '',
        )
          .trim()
          .toUpperCase();

      if (
        raw &&
        raw !== 'PF' &&
        raw !== 'PJ'
      ) {
        throw new BadRequestException(
          'Tipo de pessoa inválido.',
        );
      }

      data.personType =
        raw || null;
    }


    if (
      this.has(
        body,
        'name',
      )
    ) {

      const name =
        String(
          body.name || '',
        ).trim();

      if (!name) {
        throw new BadRequestException(
          'Nome da empresa não pode ficar vazio.',
        );
      }

      data.name =
        name;
    }


    const nullableTextFields = [
      'razaoSocial',
      'responsavelTecnico',
      'registroProfissional',
      'firstName',
      'lastName',
      'country',
      'cep',
      'address',
      'addressNumber',
      'complement',
      'district',
      'city',
      'state',
      'phone',
      'email',
    ];

    for (
      const field
      of nullableTextFields
    ) {

      if (
        this.has(
          body,
          field,
        )
      ) {

        let value =
          this.nullableText(
            body[field],
          );

        if (
          field === 'email' &&
          value
        ) {
          value =
            value.toLowerCase();
        }

        data[field] =
          value;
      }
    }


    if (
      this.has(
        body,
        'cnpj',
      )
    ) {
      data.cnpj =
        this.documentDigits(
          body.cnpj,
        );
    }


    if (
      this.has(
        body,
        'cpf',
      )
    ) {
      data.cpf =
        this.documentDigits(
          body.cpf,
        );
    }


    const nextValue = (
      field: string,
    ) => {

      if (
        Object.prototype
          .hasOwnProperty
          .call(
            data,
            field,
          )
      ) {
        return data[field];
      }

      return (
        current as any
      )[field];
    };


    const personType =
      nextValue(
        'personType',
      );


    if (
      personType === 'PF'
    ) {

      const firstName =
        String(
          nextValue(
            'firstName',
          ) || '',
        ).trim();

      const lastName =
        String(
          nextValue(
            'lastName',
          ) || '',
        ).trim();

      const cpf =
        String(
          nextValue(
            'cpf',
          ) || '',
        ).trim();

      if (
        !firstName ||
        !lastName ||
        !cpf
      ) {
        throw new BadRequestException(
          'PF exige nome, sobrenome e CPF.',
        );
      }

      data.name =
        `${firstName} ${lastName}`
          .trim();

      /*
       * Documentos são mutuamente exclusivos.
       */
      data.cnpj = null;
    }


    if (
      personType === 'PJ'
    ) {

      const name =
        String(
          nextValue(
            'name',
          ) || '',
        ).trim();

      const cnpj =
        String(
          nextValue(
            'cnpj',
          ) || '',
        ).trim();

      if (
        !name ||
        !cnpj
      ) {
        throw new BadRequestException(
          'PJ exige nome da empresa e CNPJ.',
        );
      }

      /*
       * Documentos são mutuamente exclusivos.
       */
      data.cpf = null;
      data.firstName = null;
      data.lastName = null;
    }


    try {

      const updated =
        await this.prisma.company.update({
          where: {
            id: companyId,
          },

          data:
            data as Prisma.CompanyUpdateInput,

          select:
            this.profileSelect,
        });

      /*
       * IMPORTANTE:
       *
       * Este fluxo atualiza SOMENTE Company.
       *
       * Nenhum User é atualizado aqui.
       * Gestão de usuários permanece no
       * módulo /users ou /admin/users.
       */
      return {
        success: true,

        company:
          this.publicProfile(
            updated,
          ),

        canEdit:
          this.canEdit(user),
      };

    } catch (error) {

      if (
        error instanceof
          Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new BadRequestException(
          'CPF ou CNPJ já cadastrado.',
        );
      }

      throw error;
    }
  }
}
