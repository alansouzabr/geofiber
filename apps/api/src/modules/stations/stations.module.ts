import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StationsController } from './stations.controller';
import { StationsService } from './stations.service';

@Module({
  controllers: [StationsController],
  providers: [PrismaService, StationsService],
  exports: [StationsService],
})
export class StationsModule {}
