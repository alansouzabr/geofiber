import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { ProjectsService } from './projects.service';

@UseGuards(JwtAuthGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private readonly service: ProjectsService) {}

  @Get()
  async list(@Req() req: any) {
    const data = await this.service.list(req.user.companyId);
    return { data };
  }

  @Post()
  async create(@Req() req: any, @Body() body: { name: string }) {
    const data = await this.service.create(req.user.companyId, body.name);
    return { data };
  }
}
