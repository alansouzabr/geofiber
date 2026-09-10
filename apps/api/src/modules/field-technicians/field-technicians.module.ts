import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';

import { FieldTechniciansController } from './field-technicians.controller';
import { FieldTechniciansService } from './field-technicians.service';

@Module({

  imports: [
    PrismaModule
  ],

  controllers: [
    FieldTechniciansController
  ],

  providers: [
    FieldTechniciansService
  ]

})

export class FieldTechniciansModule {}
