import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards
} from "@nestjs/common";

import { JwtAuthGuard }
from "../auth/jwt.guard";

import {
  CreatePoleAccessoryDto,
  UpdatePoleAccessoryDto
} from "./dto";

import { PoleAccessoriesService }
from "./pole-accessories.service";

@UseGuards(
  JwtAuthGuard
)

@Controller(
  "pole-accessories"
)

export class PoleAccessoriesController {

  constructor(

    private readonly service:
      PoleAccessoriesService

  ) {}

  @Post()

  async create(

    @Req() req: any,

    @Body()
    dto: CreatePoleAccessoryDto

  ) {

    return this.service.create(

      req.user.companyId,

      dto

    );

  }

  @Get()

  async list(

    @Req() req: any

  ) {

    return this.service.list(

      req.user.companyId

    );

  }

  @Patch(":id")

  async update(

    @Req() req: any,

    @Param("id")
    id: string,

    @Body()
    dto: UpdatePoleAccessoryDto

  ) {

    return this.service.update(

      req.user.companyId,

      id,

      dto

    );

  }

  @Delete(":id")

  async remove(

    @Req() req: any,

    @Param("id")
    id: string

  ) {

    return this.service.remove(

      req.user.companyId,

      id

    );

  }

}
