import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminFileSyncController } from './admin-filesync.controller';

import { PrismaService } from '../prisma/prisma.service';

import { CompaniesModule }
from '../companies/companies.module';
import { UsersModule }
from '../users/users.module';

@Module({
  imports: [
      CompaniesModule,
      UsersModule
    ],

  controllers: [
    AdminController,
    AdminFileSyncController
  ],

  providers: [
    PrismaService
  ]
})
export class AdminModule {}
