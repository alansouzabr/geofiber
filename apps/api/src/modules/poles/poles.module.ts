import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { PolesController } from './poles.controller';
import { PolesService } from './poles.service';

@Module({
  imports: [PrismaModule],
  controllers: [PolesController],
  providers: [PolesService],
})
export class PolesModule {}
