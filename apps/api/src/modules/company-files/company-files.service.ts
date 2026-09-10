import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CompanyFilesService {

  constructor(
    private readonly prisma: PrismaService
  ) {}

  async findById(id: string) {
    return this.prisma.companyFile.findUnique({
      where: { id }
    });
  }

  async delete(id: string) {
    return this.prisma.companyFile.delete({
      where: { id }
    });
  }

  async createAudit(data: any) {
    return this.prisma.auditLog.create({
      data
    });
  }

  async list(where: any) {
    return this.prisma.companyFile.findMany({
      where,
      orderBy: {
        createdAt: 'desc'
      }
    });
  }


  resolveLocalPath(file: { fileUrl: string }) {
    return file.fileUrl.replace(
      'https://api.geofibers.com.br/',
      process.cwd() + '/'
    );
  }


}
