import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  Body
} from '@nestjs/common';

import { FilesInterceptor }
from '@nestjs/platform-express';

import { memoryStorage }
from 'multer';

import { UploadService }
from './upload.service';

import { JwtAuthGuard }
from '../auth/jwt.guard';

import { RolesGuard }
from '../../common/guards/roles.guard';

import { Roles }
from '../../common/decorators/roles.decorator';

import { ROLE }
from '../roles/roles.constants';

import { CurrentUser }
from '../../common/decorators/current-user.decorator';

@Controller('upload')
export class UploadController {

  constructor(
    private readonly uploadService:
      UploadService
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)

  @Roles(
    ROLE.ROOT,
    ROLE.MASTER
  )

  @Post()

  @UseInterceptors(
    FilesInterceptor('files', 30, {

      storage: memoryStorage(),

      limits: {
        fileSize:
          Math.max(
            Number(process.env.UPLOAD_MAX_SIZE_GED ?? 0),
            Number(process.env.UPLOAD_MAX_SIZE_TRAINING ?? 0)
          )
      }
    })
  )

  upload(

    @UploadedFiles()
    files: Express.Multer.File[],

    @CurrentUser()
    user: any,

    @Body()
    body: any

  ) {

    return this.uploadService.saveMany(
      files,
      user,
      body.category,
      body
    );
  }
}
