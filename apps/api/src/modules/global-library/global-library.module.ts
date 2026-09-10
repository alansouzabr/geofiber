import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';

import { GlobalLibraryController } from './global-library.controller';

import { GlobalLibraryService } from './global-library.service';

@Module({

  imports:[
    PrismaModule
  ],

  controllers:[
    GlobalLibraryController
  ],

  providers:[
    GlobalLibraryService
  ]

})

export class GlobalLibraryModule{}
