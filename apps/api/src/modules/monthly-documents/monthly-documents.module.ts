import { Module } from '@nestjs/common';

import { PrismaModule }
from '../prisma/prisma.module';

import { MonthlyDocumentsController }
from './monthly-documents.controller';

import { MonthlyDocumentsService }
from './monthly-documents.service';

@Module({
  imports: [
    PrismaModule
  ],
  controllers: [
    MonthlyDocumentsController
  ],
  providers: [
    MonthlyDocumentsService
  ]
})
export class MonthlyDocumentsModule {}
