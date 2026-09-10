import {
  Controller,
  Get,
  Put,
  Param,
  Body,
  UseGuards,
  Req,
  ForbiddenException,
} from '@nestjs/common';

import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { AuthenticatedUser } from '../../common/interfaces/authenticated-user.interface';
import { RolesService } from './roles.service';

@Controller('roles')
@UseGuards(RolesGuard)
@Roles('ROOT', 'MASTER')
export class RolesController {
  constructor(
    private readonly service: RolesService
  ) {}

  private ensureCompanyScope(
    user: AuthenticatedUser,
    companyId: string
  ) {

    if (
      user.role === 'ROOT' ||
      user.role === 'MASTER'
    ) {
      return;
    }

    throw new ForbiddenException(
      'Usuário sem permissão para administrar esta empresa.'
    );
  }

  @Get('permissions')
  async permissions() {
    return this.service.listPermissions();
  }

  @Get('company/:companyId/admin')
  async adminPermissions(
    @Param('companyId') companyId: string,
    @Req() req: { user: AuthenticatedUser }
  ) {

    this.ensureCompanyScope(
      req.user,
      companyId
    );

    return this.service.getAdminPermissions(
      companyId
    );
  }

  @Put('company/:companyId/admin')
  async updateAdminPermissions(
    @Param('companyId') companyId: string,
    @Body() body: {
      permissions?: string[];
    },
    @Req() req: { user: AuthenticatedUser }
  ) {

    this.ensureCompanyScope(
      req.user,
      companyId
    );

    return this.service.setAdminPermissions(
      companyId,
      Array.isArray(body.permissions)
        ? body.permissions
        : []
    );
  }
}
