import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RacksController } from './racks.controller';
import { RacksService } from './racks.service';

@Module({
  controllers: [RacksController],
  providers: [PrismaService, RacksService],
  exports: [RacksService],
})
export class RacksModule {}
