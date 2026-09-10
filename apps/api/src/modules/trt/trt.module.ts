import { Module } from '@nestjs/common';
import { TrtService } from './trt.service';
import { TrtController } from './trt.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { PlanLimitModule } from '../../common/limits/plan-limit.module';

@Module({
  imports: [PrismaModule, PlanLimitModule], // 🔥 AQUI
  providers: [TrtService],
  controllers: [TrtController],
})
export class TrtModule {}
