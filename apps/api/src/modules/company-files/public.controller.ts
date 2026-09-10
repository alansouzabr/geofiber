import { Controller } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('public/company-files')
export class PublicCompanyFilesController {
  constructor(private prisma: PrismaService) {}

  // Funcionalidade temporariamente desabilitada - tabela CompanyFile não existe no banco
}
