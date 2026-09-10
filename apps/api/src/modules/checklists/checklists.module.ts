import {
  Module
} from '@nestjs/common';

import {
  PrismaModule
} from '../prisma/prisma.module';

import {
  ChecklistsController
} from './checklists.controller';

import {
  ChecklistsService
} from './checklists.service';


/*
 * ETAPA32I2B1_CHECKLIST_API
 */

@Module({

  imports: [
    PrismaModule
  ],

  controllers: [
    ChecklistsController
  ],

  providers: [
    ChecklistsService
  ],

  exports: [
    ChecklistsService
  ]

})
export class ChecklistsModule {}
