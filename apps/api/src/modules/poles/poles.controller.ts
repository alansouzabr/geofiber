import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { PolesService } from './poles.service';
import { CreatePoleDto, UpdatePoleDto } from './dto';

@UseGuards(JwtAuthGuard)
@Controller('poles')
export class PolesController {
  constructor(private readonly poles: PolesService) {}

  @Post()
  async create(@Req() req: any, @Body() dto: CreatePoleDto) {
    return this.poles.create(req.user.companyId, req.user.userId, dto);
  }

  @Get()
  async list(@Req() req: any) {
    return this.poles.list(req.user.companyId);
  }

  @Patch(':id')
  async update(@Req() req: any, @Param('id') id: string, @Body() dto: UpdatePoleDto) {
    return this.poles.update(req.user.companyId, id, dto);
  }

  @Delete(':id')
  async remove(@Req() req: any, @Param('id') id: string) {
    return this.poles.remove(req.user.companyId, id);
  }
}
