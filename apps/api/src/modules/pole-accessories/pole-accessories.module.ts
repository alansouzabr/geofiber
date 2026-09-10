import { Module } from "@nestjs/common";

import { PrismaModule }
from "../prisma/prisma.module";

import { PoleAccessoriesController }
from "./pole-accessories.controller";

import { PoleAccessoriesService }
from "./pole-accessories.service";

@Module({

  imports: [
    PrismaModule
  ],

  controllers: [
    PoleAccessoriesController
  ],

  providers: [
    PoleAccessoriesService
  ]

})

export class PoleAccessoriesModule {}
