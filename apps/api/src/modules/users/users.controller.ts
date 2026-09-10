import {
  Controller,
  Post,
  Body,
  Get,
  Req,
  UseGuards,
  Patch,
  Put,
  Delete,
  Param
} from '@nestjs/common';

import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { SubscriptionGuard } from '../../common/guards/subscription.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';

@Controller('users')
export class UsersController {

  constructor(
    private service: UsersService
  ) {}

  @UseGuards(
    JwtAuthGuard,
    SubscriptionGuard
  )
  @Permissions('company.users')
  @Post()
  create(
    @Body() body: any,
    @Req() req: any
  ) {

    console.log("USERS_CONTROLLER_POST")
    console.log(body)
    console.log(req.user)

    return this.service.create(
      body,
      req.user
    );
  }

  @UseGuards(
    JwtAuthGuard,
    SubscriptionGuard
  )
  @Permissions('company.users')
  @Get()
  list(
    @Req() req: any
  ) {
    return this.service.list(
      req.user.companyId
    );
  }

  @UseGuards(
    JwtAuthGuard,
    SubscriptionGuard
  )
  @Permissions('company.users')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() body: any,
    @Req() req: any
  ) {
    return this.service.update(
      id,
      body,
      req.user.companyId
    );
  }

  @UseGuards(
    JwtAuthGuard,
    SubscriptionGuard
  )
  @Permissions('company.users')
  @Patch(':id/reset-password')
  resetPassword(
    @Param('id') id: string,
    @Body() body: any,
    @Req() req: any
  ) {
    return this.service.resetPassword(
      id,
      body.password,
      req.user.companyId
    );
  }

  @UseGuards(
    JwtAuthGuard,
    SubscriptionGuard
  )
  @Permissions('company.users')
  @Patch(':id/toggle')
  toggle(
    @Param('id') id: string,
    @Req() req: any
  ) {
    return this.service.toggle(
      id,
      req.user.companyId
    );
  }

  /*
   * ETAPA35A3B_ADMIN_DELEGATED_PERMISSIONS
   *
   * ADMIN só opera sobre usuários
   * da própria empresa.
   *
   * O teto e a proteção de roles
   * são validados pelo UsersService.
   */
  @UseGuards(
    JwtAuthGuard,
    SubscriptionGuard
  )
  @Permissions('company.users')
  @Get(':id/role-permissions')
  getRolePermissions(
    @Param('id') id: string,
    @Req() req: any
  ) {

    return this.service
      .getDelegatedRolePermissions(
        id,
        req.user
      );

  }


  @UseGuards(
    JwtAuthGuard,
    SubscriptionGuard
  )
  @Permissions('company.users')
  @Put(':id/role-permissions')
  setRolePermissions(
    @Param('id') id: string,
    @Body() body: any,
    @Req() req: any
  ) {

    const permissions =
      Array.isArray(
        body?.permissions
      )
        ? body.permissions
        : [];


    return this.service
      .setDelegatedRolePermissions(
        id,
        permissions,
        req.user
      );

  }


  @UseGuards(
    JwtAuthGuard,
    SubscriptionGuard
  )
  @Permissions('company.users')
  @Delete(':id')
  delete(
    @Param('id') id: string,
    @Req() req: any
  ) {
    return this.service.delete(
      id,
      req.user.companyId
    );
  }
}
