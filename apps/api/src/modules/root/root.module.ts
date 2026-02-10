import { Module } from '@nestjs/common';
import { RootController } from './root.controller';
import { RootService } from './root.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [RootController],
  providers: [RootService],
})
export class RootModule {}
