import { Controller } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('admin/filesync')
export class AdminFileSyncController {
  constructor(private prisma: PrismaService) {}

  // Funcionalidade temporariamente desabilitada - tabela CompanyFile não existe no banco
}
