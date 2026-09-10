import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaModule } from '../prisma/prisma.module';
import { PlanLimitService } from '../../common/limits/plan-limit.service';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [UsersService, PlanLimitService],
  exports: [UsersService],
})
export class UsersModule {}
