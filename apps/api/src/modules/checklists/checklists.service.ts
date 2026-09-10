import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common';

import {
  ChecklistExecutionStatus,
  ChecklistItemType,
  Prisma
} from '@prisma/client';

import {
  PrismaService
} from '../prisma/prisma.service';

import {
  CreateChecklistTemplateDto,
  ChecklistTemplateItemInputDto
} from './dto/create-checklist-template.dto';

import {
  UpdateChecklistTemplateDto
} from './dto/update-checklist-template.dto';

import {
  CreateChecklistExecutionDto
} from './dto/create-checklist-execution.dto';

import {
  UpdateChecklistExecutionItemDto
} from './dto/update-checklist-execution-item.dto';


type NormalizedTemplateItem = {
  sortOrder: number;
  label: string;
  description: string | null;
  type: ChecklistItemType;
  required: boolean;
  options?: string[];
};


@Injectable()
export class ChecklistsService {

  constructor(
    private readonly prisma: PrismaService
  ) {}


  private requiredText(
    value: unknown,
    field: string
  ): string {

    if (
      typeof value !== 'string' ||
      !value.trim()
    ) {

      throw new BadRequestException(
        `${field} é obrigatório`
      );

    }


    return value.trim();
  }


  private optionalText(
    value: unknown
  ): string | null {

    if (
      value === undefined ||
      value === null
    ) {

      return null;

    }


    if (typeof value !== 'string') {

      throw new BadRequestException(
        'Valor textual inválido'
      );

    }


    const normalized =
      value.trim();


    return normalized || null;
  }


  private normalizeOptions(
    type: ChecklistItemType,
    options: unknown
  ): string[] | undefined {

    if (
      type !== ChecklistItemType.SELECT &&
      type !== ChecklistItemType.MULTISELECT
    ) {

      return undefined;

    }


    if (
      !Array.isArray(options) ||
      options.length === 0
    ) {

      throw new BadRequestException(
        'Itens SELECT/MULTISELECT precisam de options'
      );

    }


    const normalized =
      options.map(
        option => {

          if (
            typeof option !== 'string' ||
            !option.trim()
          ) {

            throw new BadRequestException(
              'Option inválida no Checklist'
            );

          }


          return option.trim();

        }
      );


    return Array.from(
      new Set(normalized)
    );
  }


  private normalizeItems(
    items: ChecklistTemplateItemInputDto[]
  ): NormalizedTemplateItem[] {

    if (
      !Array.isArray(items) ||
      items.length === 0
    ) {

      throw new BadRequestException(
        'Checklist precisa possuir pelo menos um item'
      );

    }


    return items.map(
      (
        item: ChecklistTemplateItemInputDto,
        index: number
      ) => {

        if (
          !item ||
          typeof item !== 'object'
        ) {

          throw new BadRequestException(
            `Item ${index + 1} inválido`
          );

        }


        const type =
          item.type as ChecklistItemType;


        if (
          !Object
            .values(ChecklistItemType)
            .includes(type)
        ) {

          throw new BadRequestException(
            `Tipo inválido no item ${index + 1}`
          );

        }


        return {
          sortOrder: index,

          label:
            this.requiredText(
              item.label,
              `Item ${index + 1}: label`
            ),

          description:
            this.optionalText(
              item.description
            ),

          type,

          required:
            item.required === true,

          options:
            this.normalizeOptions(
              type,
              item.options
            )
        };

      }
    );
  }


  private async ensureCompany(
    companyId: string
  ) {

    if (!companyId) {

      throw new BadRequestException(
        'Empresa inválida'
      );

    }


    const company =
      await this.prisma.company.findUnique({
        where: {
          id: companyId
        },

        select: {
          id: true
        }
      });


    if (!company) {

      throw new NotFoundException(
        'Empresa não encontrada'
      );

    }


    return company;
  }


  async listTemplates(
    companyId: string
  ) {

    await this.ensureCompany(
      companyId
    );


    return this.prisma.checklistTemplate.findMany({

      where: {
        companyId
      },

      include: {

        Items: {
          orderBy: [
            {
              sortOrder: 'asc'
            },
            {
              createdAt: 'asc'
            }
          ]
        }

      },

      orderBy: [
        {
          isActive: 'desc'
        },
        {
          updatedAt: 'desc'
        }
      ]

    });
  }


  async getTemplate(
    companyId: string,
    id: string
  ) {

    const template =
      await this.prisma.checklistTemplate.findFirst({

        where: {
          id,
          companyId
        },

        include: {

          Items: {
            orderBy: [
              {
                sortOrder: 'asc'
              },
              {
                createdAt: 'asc'
              }
            ]
          }

        }

      });


    if (!template) {

      throw new NotFoundException(
        'Checklist não encontrado'
      );

    }


    return template;
  }


  async createTemplate(
    companyId: string,
    createdByUserId: string,
    dto: CreateChecklistTemplateDto
  ) {

    await this.ensureCompany(
      companyId
    );


    const items =
      this.normalizeItems(
        dto.items
      );


    const name =
      this.requiredText(
        dto.name,
        'Nome'
      );


    const templateId =
      await this.prisma.$transaction(
        async tx => {

          const template =
            await tx.checklistTemplate.create({

              data: {
                companyId,

                name,

                description:
                  this.optionalText(
                    dto.description
                  ),

                category:
                  this.optionalText(
                    dto.category
                  ),

                createdByUserId
              }

            });


          for (const item of items) {

            await tx.checklistTemplateItem.create({

              data: {
                templateId:
                  template.id,

                sortOrder:
                  item.sortOrder,

                label:
                  item.label,

                description:
                  item.description,

                type:
                  item.type,

                required:
                  item.required,

                options:
                  item.options
              }

            });

          }


          return template.id;

        }
      );


    return this.getTemplate(
      companyId,
      templateId
    );
  }


  async updateTemplate(
    companyId: string,
    id: string,
    dto: UpdateChecklistTemplateDto
  ) {

    await this.getTemplate(
      companyId,
      id
    );


    const normalizedItems =
      dto.items === undefined
        ? undefined
        : this.normalizeItems(
            dto.items
          );


    const data: Prisma.ChecklistTemplateUpdateInput =
      {};


    if (dto.name !== undefined) {

      data.name =
        this.requiredText(
          dto.name,
          'Nome'
        );

    }


    if (dto.description !== undefined) {

      data.description =
        this.optionalText(
          dto.description
        );

    }


    if (dto.category !== undefined) {

      data.category =
        this.optionalText(
          dto.category
        );

    }


    if (dto.isActive !== undefined) {

      data.isActive =
        dto.isActive;

    }


    await this.prisma.$transaction(
      async tx => {

        if (
          Object.keys(data).length > 0
        ) {

          await tx.checklistTemplate.update({

            where: {
              id
            },

            data

          });

        }


        if (
          normalizedItems !== undefined
        ) {

          await tx.checklistTemplateItem.deleteMany({

            where: {
              templateId: id
            }

          });


          for (
            const item
            of normalizedItems
          ) {

            await tx.checklistTemplateItem.create({

              data: {
                templateId: id,

                sortOrder:
                  item.sortOrder,

                label:
                  item.label,

                description:
                  item.description,

                type:
                  item.type,

                required:
                  item.required,

                options:
                  item.options
              }

            });

          }

        }

      }
    );


    return this.getTemplate(
      companyId,
      id
    );
  }


  async archiveTemplate(
    companyId: string,
    id: string
  ) {

    await this.getTemplate(
      companyId,
      id
    );


    await this.prisma.checklistTemplate.update({

      where: {
        id
      },

      data: {
        isActive: false
      }

    });


    return this.getTemplate(
      companyId,
      id
    );
  }


  async listExecutions(
    companyId: string
  ) {

    await this.ensureCompany(
      companyId
    );


    return this.prisma.checklistExecution.findMany({

      where: {
        companyId
      },

      include: {

        Template: {
          select: {
            id: true,
            name: true,
            category: true,
            isActive: true
          }
        },

        TechnicianProfile: {

          include: {

            User: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }

          }

        },

        _count: {
          select: {
            Items: true
          }
        }

      },

      orderBy: {
        startedAt: 'desc'
      }

    });
  }


  async getExecution(
    companyId: string,
    id: string
  ) {

    const execution =
      await this.prisma.checklistExecution.findFirst({

        where: {
          id,
          companyId
        },

        include: {

          Template: {
            select: {
              id: true,
              name: true,
              category: true,
              isActive: true
            }
          },

          TechnicianProfile: {

            include: {

              User: {
                select: {
                  id: true,
                  name: true,
                  email: true
                }
              }

            }

          },

          Items: {
            orderBy: [
              {
                sortOrderSnapshot: 'asc'
              },
              {
                createdAt: 'asc'
              }
            ]
          }

        }

      });


    if (!execution) {

      throw new NotFoundException(
        'Execução de Checklist não encontrada'
      );

    }


    return execution;
  }


  async createExecution(
    companyId: string,
    startedByUserId: string,
    dto: CreateChecklistExecutionDto
  ) {

    await this.ensureCompany(
      companyId
    );


    const template =
      await this.prisma.checklistTemplate.findFirst({

        where: {
          id: dto.templateId,
          companyId,
          isActive: true
        },

        include: {

          Items: {
            orderBy: [
              {
                sortOrder: 'asc'
              },
              {
                createdAt: 'asc'
              }
            ]
          }

        }

      });


    if (!template) {

      throw new NotFoundException(
        'Checklist ativo não encontrado'
      );

    }


    if (
      template.Items.length === 0
    ) {

      throw new BadRequestException(
        'Checklist não possui itens'
      );

    }


    if (dto.technicianProfileId) {

      const technician =
        await this.prisma.fieldTechnicianProfile.findFirst({

          where: {
            id:
              dto.technicianProfileId,

            companyId,

            isActive: true
          },

          select: {
            id: true
          }

        });


      if (!technician) {

        throw new BadRequestException(
          'Técnico não pertence à empresa ou está inativo'
        );

      }

    }


    const executionId =
      await this.prisma.$transaction(
        async tx => {

          const execution =
            await tx.checklistExecution.create({

              data: {
                companyId,

                templateId:
                  template.id,

                technicianProfileId:
                  dto.technicianProfileId ??
                  null,

                startedByUserId,

                status:
                  ChecklistExecutionStatus
                    .IN_PROGRESS,

                notes:
                  this.optionalText(
                    dto.notes
                  )
              }

            });


          for (
            const item
            of template.Items
          ) {

            const itemData: Prisma.ChecklistExecutionItemUncheckedCreateInput = {

              executionId:
                execution.id,

              templateItemId:
                item.id,

              sortOrderSnapshot:
                item.sortOrder,

              labelSnapshot:
                item.label,

              typeSnapshot:
                item.type,

              requiredSnapshot:
                item.required

            };


            if (item.options !== null) {

              itemData.optionsSnapshot =
                item.options as
                  Prisma.InputJsonValue;

            }


            await tx.checklistExecutionItem.create({

              data:
                itemData

            });

          }


          return execution.id;

        }
      );


    return this.getExecution(
      companyId,
      executionId
    );
  }


  private allowedOptions(
    options: unknown
  ): string[] {

    if (!Array.isArray(options)) {

      return [];

    }


    return options.filter(
      option =>
        typeof option === 'string'
    ) as string[];
  }


  private responseIsValid(
    type: ChecklistItemType,
    response: unknown,
    options: unknown,
    required: boolean
  ): boolean {

    if (
      response === undefined ||
      response === null
    ) {

      return !required;

    }


    switch (type) {

      case ChecklistItemType.BOOLEAN:

        return (
          typeof response ===
          'boolean'
        );


      case ChecklistItemType.TEXT:

        return (
          typeof response ===
            'string' &&
          (
            !required ||
            response.trim().length > 0
          )
        );


      case ChecklistItemType.NUMBER:

        return (
          typeof response ===
            'number' &&
          Number.isFinite(
            response
          )
        );


      case ChecklistItemType.SELECT: {

        const allowed =
          this.allowedOptions(
            options
          );


        return (
          typeof response ===
            'string' &&
          allowed.includes(
            response
          )
        );

      }


      case ChecklistItemType.MULTISELECT: {

        if (!Array.isArray(response)) {

          return false;

        }


        if (
          required &&
          response.length === 0
        ) {

          return false;

        }


        const allowed =
          this.allowedOptions(
            options
          );


        return response.every(
          value =>
            typeof value ===
              'string' &&
            allowed.includes(
              value
            )
        );

      }


      default:

        return false;

    }
  }


  async updateExecutionItem(
    companyId: string,
    executionId: string,
    itemId: string,
    dto: UpdateChecklistExecutionItemDto
  ) {

    const execution =
      await this.prisma.checklistExecution.findFirst({

        where: {
          id: executionId,
          companyId
        },

        select: {
          id: true,
          status: true
        }

      });


    if (!execution) {

      throw new NotFoundException(
        'Execução de Checklist não encontrada'
      );

    }


    if (
      execution.status ===
        ChecklistExecutionStatus.COMPLETED ||
      execution.status ===
        ChecklistExecutionStatus.CANCELLED
    ) {

      throw new BadRequestException(
        'Execução finalizada não pode ser alterada'
      );

    }


    const item =
      await this.prisma.checklistExecutionItem.findFirst({

        where: {
          id: itemId,
          executionId
        }

      });


    if (!item) {

      throw new NotFoundException(
        'Item da execução não encontrado'
      );

    }


    const hasResponse =
      Object.prototype.hasOwnProperty.call(
        dto,
        'response'
      );


    const hasObservation =
      Object.prototype.hasOwnProperty.call(
        dto,
        'observation'
      );


    if (
      !hasResponse &&
      !hasObservation
    ) {

      throw new BadRequestException(
        'Nenhuma alteração informada'
      );

    }


    const data: Prisma.ChecklistExecutionItemUpdateInput =
      {};


    if (hasResponse) {

      if (
        dto.response !== null &&
        !this.responseIsValid(
          item.typeSnapshot,
          dto.response,
          item.optionsSnapshot,
          false
        )
      ) {

        throw new BadRequestException(
          'Resposta incompatível com o tipo do item'
        );

      }


      if (dto.response === null) {

        data.response =
          Prisma.DbNull;

        data.completedAt =
          null;

      } else {

        data.response =
          dto.response as
            Prisma.InputJsonValue;

        data.completedAt =
          new Date();

      }

    }


    if (hasObservation) {

      data.observation =
        this.optionalText(
          dto.observation
        );

    }


    return this.prisma
      .checklistExecutionItem
      .update({

        where: {
          id: itemId
        },

        data

      });
  }


  async completeExecution(
    companyId: string,
    id: string
  ) {

    const execution =
      await this.getExecution(
        companyId,
        id
      );


    if (
      execution.status ===
      ChecklistExecutionStatus.CANCELLED
    ) {

      throw new BadRequestException(
        'Execução cancelada não pode ser concluída'
      );

    }


    if (
      execution.status ===
      ChecklistExecutionStatus.COMPLETED
    ) {

      return execution;

    }


    const missing =
      execution.Items.filter(
        item =>
          item.requiredSnapshot &&
          !this.responseIsValid(
            item.typeSnapshot,
            item.response,
            item.optionsSnapshot,
            true
          )
      );


    if (missing.length > 0) {

      throw new BadRequestException(
        'Itens obrigatórios pendentes: ' +
        missing
          .map(
            item =>
              item.labelSnapshot
          )
          .join(', ')
      );

    }


    await this.prisma.checklistExecution.update({

      where: {
        id
      },

      data: {
        status:
          ChecklistExecutionStatus
            .COMPLETED,

        completedAt:
          new Date()
      }

    });


    return this.getExecution(
      companyId,
      id
    );
  }


  async cancelExecution(
    companyId: string,
    id: string
  ) {

    const execution =
      await this.getExecution(
        companyId,
        id
      );


    if (
      execution.status ===
      ChecklistExecutionStatus.COMPLETED
    ) {

      throw new BadRequestException(
        'Execução concluída não pode ser cancelada'
      );

    }


    if (
      execution.status ===
      ChecklistExecutionStatus.CANCELLED
    ) {

      return execution;

    }


    await this.prisma.checklistExecution.update({

      where: {
        id
      },

      data: {
        status:
          ChecklistExecutionStatus
            .CANCELLED
      }

    });


    return this.getExecution(
      companyId,
      id
    );
  }

}
