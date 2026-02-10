import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { StationsService } from './stations.service';

@UseGuards(JwtAuthGuard)
@Controller('stations')
export class StationsController {
  constructor(private readonly service: StationsService) {}

  @Get()
  async list(@Req() req: any, @Query('projectId') projectId: string) {
    const data = await this.service.list(req.user.companyId, projectId);
    return { data };
  }

  @Post()
  async create(@Req() req: any, @Body() dto: any) {
    const data = await this.service.create(req.user.companyId, dto);
    return { data };
  }
}
