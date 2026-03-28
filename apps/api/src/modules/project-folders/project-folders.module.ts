import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ProjectFoldersController } from './project-folders.controller';
import { ProjectFoldersService } from './project-folders.service';

@Module({
  imports: [PrismaModule],
  controllers: [ProjectFoldersController],
  providers: [ProjectFoldersService],
})
export class ProjectFoldersModule {}
