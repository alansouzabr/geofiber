import { Module } from '@nestjs/common';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';
import { PrismaModule } from '../prisma/prisma.module';
import { RolesModule } from '../roles/roles.module';

@Module({
  imports: [
    PrismaModule,
    RolesModule
  ],

  controllers: [
    CompaniesController
  ],

  providers: [
    CompaniesService
  ],

  exports: [
    CompaniesService
  ]
})
export class CompaniesModule {}
