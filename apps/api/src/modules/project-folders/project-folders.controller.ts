import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { CreateProjectFolderDto, UpdateProjectFolderDto } from './dto';
import { ProjectFoldersService } from './project-folders.service';

@UseGuards(JwtAuthGuard)
@Controller('project-folders')
export class ProjectFoldersController {
  constructor(private readonly service: ProjectFoldersService) {}

  @Get()
  async list(@Req() req: any) {
    return this.service.list(req.user.companyId);
  }

  @Post()
  async create(@Req() req: any, @Body() dto: CreateProjectFolderDto) {
    return this.service.create(req.user.companyId, dto);
  }

  @Patch(':id')
  async update(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateProjectFolderDto) {
    return this.service.update(req.user.companyId, id, dto);
  }

  @Delete(':id')
  async remove(@Req() req: any, @Param('id') id: string) {
    return this.service.remove(req.user.companyId, id);
  }
}
