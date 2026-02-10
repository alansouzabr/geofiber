import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { FiberSignalsService } from './fiber-signals.service';
import { TickDto, UpdateFiberSignalConfigDto } from './dto';

@UseGuards(JwtAuthGuard)
@Controller('fiber-signals')
export class FiberSignalsController {
  constructor(private readonly service: FiberSignalsService) {}

  @Get('equipment/:rackEquipmentId')
  async get(@Req() req: any, @Param('rackEquipmentId') rackEquipmentId: string) {
    const data = await this.service.getOrCreate(req.user.companyId, rackEquipmentId);
    return { data };
  }

  @Post('equipment/:rackEquipmentId/config')
  async config(
    @Req() req: any,
    @Param('rackEquipmentId') rackEquipmentId: string,
    @Body() dto: UpdateFiberSignalConfigDto,
  ) {
    const data = await this.service.updateConfig(req.user.companyId, rackEquipmentId, dto);
    return { data };
  }

  @Post('equipment/:rackEquipmentId/tick')
  async tick(
    @Req() req: any,
    @Param('rackEquipmentId') rackEquipmentId: string,
    @Body() dto: TickDto,
  ) {
    const data = await this.service.tick(req.user.companyId, rackEquipmentId, dto);
    return { data };
  }
}
