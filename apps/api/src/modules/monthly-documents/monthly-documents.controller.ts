import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Query,
  UseGuards
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/jwt.guard';

import { CurrentUser } from '../../common/decorators/current-user.decorator';

import { MonthlyDocumentsService }
from './monthly-documents.service';

@Controller('monthly-documents')
export class MonthlyDocumentsController {

  constructor(
    private readonly service:
      MonthlyDocumentsService
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  save(
    @Body() body: any,
    @CurrentUser() user: any
  ) {

    return this.service.save({
      ...body,

      companyId:
        body.companyId ||
        user.companyId,

      uploadedBy:
        user.id
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  list(
    @Query('companyId')
    companyId: string,

    @CurrentUser()
    user: any
  ) {

    return this.service.list(
      companyId ||
      user.companyId
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  remove(
    @Body() body: any
  ) {

    return this.service.remove(body);
  }
}
