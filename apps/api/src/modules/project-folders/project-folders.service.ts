import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectFolderDto, UpdateProjectFolderDto } from './dto';

@Injectable()
export class ProjectFoldersService {
  constructor(private readonly prisma: PrismaService) {}

  async list(companyId: string) {
    return this.prisma.projectFolder.findMany({
      where: { companyId },
      orderBy: [
        { parentId: 'asc' },
        { sortOrder: 'asc' },
        { name: 'asc' },
      ],
    });
  }

  async create(companyId: string, dto: CreateProjectFolderDto) {
    const name = String(dto.name || '').trim();
    const parentId = dto.parentId ?? null;

    if (!name) {
      throw new BadRequestException('Nome da pasta é obrigatório');
    }

    if (parentId) {
      const parent = await this.prisma.projectFolder.findFirst({
        where: { id: parentId, companyId },
        select: { id: true },
      });

      if (!parent) {
        throw new NotFoundException('Pasta pai não encontrada');
      }
    }

    const exists = await this.prisma.projectFolder.findFirst({
      where: { companyId, parentId, name },
      select: { id: true },
    });

    if (exists) {
      throw new BadRequestException('Já existe uma pasta com esse nome neste nível');
    }

    return this.prisma.projectFolder.create({
      data: {
        companyId,
        name,
        parentId,
      },
    });
  }

  async update(companyId: string, id: string, dto: UpdateProjectFolderDto) {
    const current = await this.prisma.projectFolder.findFirst({
      where: { id, companyId },
    });

    if (!current) {
      throw new NotFoundException('Pasta não encontrada');
    }

    const name = String(dto.name || '').trim();

    if (!name) {
      throw new BadRequestException('Nome da pasta é obrigatório');
    }

    const duplicate = await this.prisma.projectFolder.findFirst({
      where: {
        companyId,
        parentId: current.parentId,
        name,
        NOT: { id },
      },
      select: { id: true },
    });

    if (duplicate) {
      throw new BadRequestException('Já existe uma pasta com esse nome neste nível');
    }

    return this.prisma.projectFolder.update({
      where: { id },
      data: { name },
    });
  }

  async remove(companyId: string, id: string) {
    const current = await this.prisma.projectFolder.findFirst({
      where: { id, companyId },
    });

    if (!current) {
      throw new NotFoundException('Pasta não encontrada');
    }

    const child = await this.prisma.projectFolder.findFirst({
      where: { companyId, parentId: id },
      select: { id: true },
    });

    if (child) {
      throw new BadRequestException('A pasta possui subpastas e não pode ser excluída');
    }

    await this.prisma.projectFolder.delete({
      where: { id },
    });

    return { ok: true };
  }
}
