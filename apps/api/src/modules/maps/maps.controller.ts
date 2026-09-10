import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post
} from '@nestjs/common';

import {
  MapsService
} from './maps.service';

import { Permissions }
from '../../common/decorators/permissions.decorator';

@Controller('maps')

export class MapsController {

  constructor(

    private readonly service:
      MapsService

  ) {}

  @Permissions('kmz.edit')
  @Post()

  create(
    @Body() body: any
  ) {

    return this.service.create(body);
  }

  @Permissions('kmz.view')
  @Get(':companyId')

  findByCompany(

    @Param('companyId')
    companyId: string

  ) {

    return this.service.findByCompany(
      companyId
    );
  }

  @Permissions('kmz.edit')
  @Delete(':id')

  remove(

    @Param('id')
    id: string

  ) {

    return this.service.remove(id);
  }
}
