import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Req
} from '@nestjs/common';

import { ProjectsService } from './projects.service';

import { Roles } from '../../common/decorators/roles.decorator';

import { Permissions }
from '../../common/decorators/permissions.decorator';

@Controller('projects')
export class ProjectsController {

  constructor(
    private readonly service: ProjectsService
  ) {}
  @Roles('MASTER', 'ADMIN')
  @Permissions('projects.view')
  @Get()
  async list(@Req() req: any) {
    return this.service.list(
      req.user.companyId
    );
  }
  @Roles('MASTER', 'ADMIN')
  @Permissions('projects.edit')
  @Post()
  async create(
    @Req() req: any,
    @Body() body: any
  ) {
    return this.service.create(
      req.user.companyId,
      body
    );
  }
  @Roles('MASTER')
  @Permissions('projects.edit')
  @Patch(':id')
  async update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: any
  ) {
    return this.service.update(
      req.user,
      id,
      body
    );
  }
}
