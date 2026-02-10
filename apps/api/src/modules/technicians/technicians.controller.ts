import { Controller, Get, Param, Post, Body, Req, UseGuards, Res, Query } from '@nestjs/common';
import type { Response } from 'express';

import { TechniciansService } from './technicians.service';
import { UpsertTechnicianProfileDto, CreateTechnicianUserDto } from './dto';
import { ListTechniciansQueryDto } from './list-technicians.query';

import { JwtAuthGuard } from '../auth/jwt.guard';
import { RequirePermissions } from '../../common/auth/permissions.decorator';
import { PermissionsGuard } from '../../common/auth/permissions.guard';

import { CurrentUser } from '../auth/current-user.decorator';
import type { JwtUserPayload } from '../auth/current-user.decorator';

import { ok } from '../../common/http/api-response';

@Controller('technicians')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class TechniciansController {
  constructor(private service: TechniciansService) {}

  @Get()
  @RequirePermissions('TECH:PROFILE:LIST')
  async list(@Req() req: any, @Query() q: ListTechniciansQueryDto) {
    const data = await this.service.listPaged(req.user.companyId, {
      search: q.search?.trim() || undefined,
      isActive: q.isActive,
      page: q.page,
      pageSize: q.pageSize,
    });

    return ok(data.items, data.meta);
  }

  @Post()
  @RequirePermissions('TECH:PROFILE:WRITE')
  async create(@Req() req: any, @Body() dto: CreateTechnicianUserDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.service.createTechnician(req.user.companyId, dto);
    res.status(result.created ? 201 : 200);
    return ok(result.user, { created: result.created });
  }

  @Get('me')
  @RequirePermissions('TECH:PROFILE:READ')
  async me(@CurrentUser() u: JwtUserPayload) {
    const data = await this.service.myProfile(u.companyId, u.userId);
    return ok(data);
  }

  @Post('me')
  @RequirePermissions('TECH:PROFILE:WRITE')
  async upsertMe(@CurrentUser() u: JwtUserPayload, @Body() dto: UpsertTechnicianProfileDto) {
    const data = await this.service.upsertMyProfile(u.companyId, u.userId, dto);
    return ok(data);
  }

  @Get(':userId')
  @RequirePermissions('TECH:PROFILE:READ')
  async get(@Req() req: any, @Param('userId') userId: string) {
    const data = await this.service.getProfile(req.user.companyId, userId);
    return ok(data);
  }

  @Post(':userId')
  @RequirePermissions('TECH:PROFILE:WRITE')
  async upsert(@Req() req: any, @Param('userId') userId: string, @Body() dto: UpsertTechnicianProfileDto) {
    const data = await this.service.upsertProfile(req.user.companyId, userId, dto);
    return ok(data);
  }
}
