import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  UseGuards
} from '@nestjs/common';

import { Roles }
from '../../common/decorators/roles.decorator';

import { RolesGuard }
from '../../common/guards/roles.guard';

import { JwtAuthGuard }
from '../auth/jwt.guard';

import { CompanyManagementService }
from './company-management.service';

@Controller('company-management')

@UseGuards(
  JwtAuthGuard,
  RolesGuard
)


export class CompanyManagementController {

  constructor(
    private service:
      CompanyManagementService
  ) {}

  @Roles('ROOT')

  @Get()

  async list() {

    return this.service.list();
  }

  @Roles('ROOT', 'MASTER')
  @Get(':id')

  async findOne(

    @Param('id')
    id: string

  ) {

    return this.service.findOne(id);
  }

  @Roles('ROOT', 'MASTER')

  @Patch(':id')

  async update(

    @Param('id')
    id: string,

    @Body()
    body: any

  ) {

    return this.service.update(
      id,
      body
    );
  }
}
