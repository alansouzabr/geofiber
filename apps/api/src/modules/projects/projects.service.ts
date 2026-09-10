import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { diffObjects } from '../../common/utils/diff';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  list(companyId: string) {
    return this.prisma.project.findMany({
      where: { companyId },
    });
  }

  async create(companyId: string, data: any) {
    return this.prisma.project.create({
      data: {
        id: Math.random().toString(36).substring(7),
          companyId,
          name: data.name,
          updatedAt: new Date(),
        // description: data.description,
      },
    });
  }

  async update(user: any, id: string, data: any) {
    const project = await this.prisma.project.findUnique({
      where: { id },
    });

    if (!project || project.companyId !== user.companyId) {
      throw new ForbiddenException("Acesso negado");
    }

    const updated = await this.prisma.project.update({
      where: { id },
      data,
    });

    const changes = diffObjects(project, updated);

    return {
      ...updated,
      changes,
    };
  }
}
