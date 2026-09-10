import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  Patch,
  Param,
  UseGuards
} from '@nestjs/common';

import { TrtService } from './trt.service';

import { JwtAuthGuard } from '../auth/jwt.guard';

import { CurrentUser } from '../../common/decorators/current-user.decorator';

import { Permissions }
from '../../common/decorators/permissions.decorator';

@Controller('trt')
export class TrtController {

  constructor(
    private readonly service: TrtService
  ) {}

  @UseGuards(JwtAuthGuard)
  @Permissions('trt.view')
  @Post()
  create(
    @Body() body: any,
    @CurrentUser() user: any
  ) {

    return this.service.create({
      ...body,

      companyId: user.companyId,

      createdBy: user.id,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Permissions('trt.view')
  @Get()
  list(
    @CurrentUser() user: any
  ) {

    return this.service.list(user);
  }

  @UseGuards(JwtAuthGuard)
  @Permissions('trt.approve')
  @Patch(':id/approve')
  approve(
    @Param('id') id: string,
    @CurrentUser() user: any
  ) {

    return this.service.approve(id, user);
  }

  @UseGuards(JwtAuthGuard)
  @Permissions('trt.approve')
  @Delete(':id')
  delete(
    @Param('id') id: string,
    @CurrentUser() user: any
  ) {

    return this.service.delete(id, user);
  }
}
