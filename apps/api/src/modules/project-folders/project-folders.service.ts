import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProjectFoldersService {

  constructor(
    private prisma: PrismaService
  ) {}

  async list(companyId: string) {

    return this.prisma.projectFolder.findMany({
      where: {
        companyId
      },
      orderBy: {
        createdAt: 'asc'
      }
    });
  }

  async create(
    companyId: string,
    dto: any
  ) {

    return this.prisma.projectFolder.create({

      data: {

        id: crypto.randomUUID(),

        companyId,

        projectId: dto.projectId,

        parentId:
          dto.parentId ?? null,

        name: dto.name,

        nodeType:
          dto.nodeType
      }
    });
  }


  

    async update(
      companyId: string,
      id: string,
      dto: any
    ) {


      const folder =
        await this.prisma.projectFolder.findFirst({
          where: {
            id,
            companyId
          }
        });

      if (!folder) {
        throw new Error("Folder not found");
      }

      return this.prisma.projectFolder.update({
        where: {
          id
        },
        data: {
          parentId: dto.parentId ?? null
        }
      });
    }

async delete(
    companyId: string,
    id: string
  ) {

    const children =
      await this.prisma.projectFolder.findMany({
        where: {
          companyId,
          parentId: id
        }
      });

    for (const child of children) {
      await this.delete(
        companyId,
        child.id
      );
    }

    await this.prisma.projectFolder.deleteMany({
      where: {
        companyId,
        id
      }
    });

    return {
      success: true
    };
  }

}
