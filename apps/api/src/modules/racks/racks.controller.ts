import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RacksService } from './racks.service';

@UseGuards(JwtAuthGuard)
@Controller('racks')
export class RacksController {
  constructor(private readonly service: RacksService) {}

  @Get()
  async list(@Req() req: any, @Query('stationId') stationId: string) {
    const data = await this.service.list(req.user.companyId, stationId);
    return { data };
  }

  @Post()
  async create(@Req() req: any, @Body() dto: any) {
    const data = await this.service.create(req.user.companyId, dto);
    return { data };
  }
}
