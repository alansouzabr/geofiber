import { Module }
from '@nestjs/common';

import { PrismaModule }
from '../prisma/prisma.module';

import { CompanyManagementController }
from './company-management.controller';

import { CompanyManagementService }
from './company-management.service';

@Module({

  imports: [
    PrismaModule
  ],

  controllers: [
    CompanyManagementController
  ],

  providers: [
    CompanyManagementService
  ]
})

export class CompanyManagementModule {}
