import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RackEquipmentsService } from './rack-equipments.service';

@UseGuards(JwtAuthGuard)
@Controller('rack-equipments')
export class RackEquipmentsController {
  constructor(private readonly service: RackEquipmentsService) {}

  @Get()
  async list(@Req() req: any, @Query('rackId') rackId: string) {
    const data = await this.service.list(req.user.companyId, rackId);
    return { data };
  }

  @Post()
  async create(@Req() req: any, @Body() dto: any) {
    const data = await this.service.create(req.user.companyId, dto);
    return { data };
  }
}
