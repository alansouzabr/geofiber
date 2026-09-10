import {
  Body,
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Param,
  Req,
  UseGuards
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/jwt.guard';

import { ProjectFoldersService } from './project-folders.service';

@UseGuards(JwtAuthGuard)
@Controller('project-folders')
export class ProjectFoldersController {

  constructor(
    private readonly service: ProjectFoldersService
  ) {}

  @Get()
  list(@Req() req:any) {

    return this.service.list(
      req.user.companyId
    );
  }

  @Post()
  
create(

    @Req() req:any,
    @Body() dto:any
  ) {

    return this.service.
create(

      req.user.companyId,
      dto
    );

  }

  @Patch(':id')
  update(

    @Req() req:any,

    @Param('id')
    id:string,

    @Body() dto:any
  ) {

    return this.service.update(
      req.user.companyId,
      id,
      dto
    );
  }



  @Delete(':id')
  delete(

    @Req() req:any,

    @Param('id')
    id:string
  ) {

    return this.service.delete(
      req.user.companyId,
      id
    );
  }
}

