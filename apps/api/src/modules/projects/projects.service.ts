import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  list(companyId: string) {
    return this.prisma.project.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' },
    });
  }

  create(companyId: string, name: string) {
    return this.prisma.project.create({
      data: { companyId, name },
    });
  }
}
