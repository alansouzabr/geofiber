import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RackEquipmentsController } from './rack-equipments.controller';
import { RackEquipmentsService } from './rack-equipments.service';

@Module({
  controllers: [RackEquipmentsController],
  providers: [PrismaService, RackEquipmentsService],
  exports: [RackEquipmentsService],
})
export class RackEquipmentsModule {}
