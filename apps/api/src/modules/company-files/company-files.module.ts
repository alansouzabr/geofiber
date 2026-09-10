import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CompanyFilesController } from './company-files.controller';
import { PublicCompanyFilesController } from './public.controller';
import { CompanyFilesService } from './company-files.service';

@Module({
  controllers: [CompanyFilesController, PublicCompanyFilesController],
  providers: [PrismaService, CompanyFilesService]
})
export class CompanyFilesModule {}
