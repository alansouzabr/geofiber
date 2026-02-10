import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FiberSignalsController } from './fiber-signals.controller';
import { FiberSignalsService } from './fiber-signals.service';

@Module({
  controllers: [FiberSignalsController],
  providers: [PrismaService, FiberSignalsService],
})
export class FiberSignalsModule {}
