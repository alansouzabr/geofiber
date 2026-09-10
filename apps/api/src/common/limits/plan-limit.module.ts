import { Module } from '@nestjs/common';
import { PlanLimitService } from './plan-limit.service';

@Module({
  providers: [PlanLimitService],
  exports: [PlanLimitService], // 🔥 importante
})
export class PlanLimitModule {}
