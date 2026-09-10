import {
  Controller,
  Get,
  Delete,
  Param,
  Query,
  Request,
  Res,
  UseGuards
} from '@nestjs/common';

import * as fs from 'fs';
import { Response } from 'express';

import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CompanyFilesService } from './company-files.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { ROLE } from '../roles/roles.constants';
import { generateId } from '../../common/utils/id';

@Controller('company-files')
export class CompanyFilesController {

  constructor(
    private readonly companyFilesService: CompanyFilesService
  ) {}

  /*
   * ETAPA 35A.7A
   *
   * Listagem exige módulo +
   * visualização.
   */
  @UseGuards(JwtAuthGuard)
  @Permissions(
    'module.files',
    'files.view'
  )
  @Get(':companyId')
  async list(

    @Request()
    req: any,

    @Param('companyId')
    companyId: string,

    @Query('month')
    month?: string,

    @Query('category')
    category?: string

  ) {

    const effectiveCompanyId =
      (req.user.role === ROLE.ROOT || req.user.role === ROLE.MASTER)
        ? companyId
        : req.user.companyId;

    const where: any = {
      companyId: effectiveCompanyId
    };

    if (month) {
      where.month = month;
    }

    if (category) {
      where.category = category;
    }

    const files =
      await this.companyFilesService.list(
        where
      );

    return files.map(file => ({

      id: file.id,

      name: file.name,

      category: file.category,

      month: file.month,

      year: file.year,

      type: file.type,

      size: file.size,

      uploadedBy: file.uploadedBy,

      createdAt: file.createdAt

    }));
  }

  @UseGuards(JwtAuthGuard)
  @Permissions(
    'module.files',
    'files.download'
  )
  @Get('download/:id')
  async download(

    @Request()
    req:any,

    @Param('id')
    id:string,

    @Res()
    res:Response

  ){

    const file =
      await this.companyFilesService.findById(
        id
      );

    if(!file){

      return res.status(404).json({
        success:false,
        message:'Arquivo não encontrado'
      });

    }

    if(
      file.category?.startsWith("Treinamento") &&
      req.user.role !== ROLE.ROOT &&
      req.user.role !== ROLE.MASTER
    ){

      return res.status(403).json({
        success:false,
        message:'Download permitido apenas para ROOT e MASTER'
      });

    }

    if(
      req.user.role !== ROLE.ROOT &&
      req.user.role !== ROLE.MASTER &&
      file.companyId!==req.user.companyId
    ){

      return res.status(403).json({
        success:false,
        message:'Sem permissão para acessar este arquivo'
      });

    }

    const localPath =
      this.companyFilesService.resolveLocalPath(
        file
      );

    if(!fs.existsSync(localPath)){

      return res.status(404).json({
        success:false,
        message:'Arquivo físico não encontrado'
      });

    }

    await this.companyFilesService.createAudit(
      {

        id:
          generateId(),

        companyId:
          file.companyId,

        actorUserId:
          req.user.id,

        action:
          'DOWNLOAD',

        entity:
          'CompanyFile',

        metadata:{
          id:file.id,
          fileName:file.fileName
        }

      }
    );

    return res.download(
      localPath,
      file.fileName
    );

  }


  @UseGuards(JwtAuthGuard)
  @Permissions(
    'module.files',
    'files.view'
  )
  @Get('view/:id')
  async view(

    @Request()
    req:any,

    @Param('id')
    id:string,

    @Res()
    res:Response

  ){

    const file =
      await this.companyFilesService.findById(
        id
      );

    if(!file){

      return res.status(404).json({
        success:false,
        message:'Arquivo não encontrado'
      });

    }

    if(
      req.user.role !== ROLE.ROOT &&
        req.user.role !== ROLE.MASTER &&
      file.companyId!==req.user.companyId
    ){

      return res.status(403).json({
        success:false,
        message:'Sem permissão para visualizar este arquivo'
      });

    }

    const localPath =
      this.companyFilesService.resolveLocalPath(
        file
      );

    if(!fs.existsSync(localPath)){

      return res.status(404).json({
        success:false,
        message:'Arquivo físico não encontrado'
      });

    }

    await this.companyFilesService.createAudit({

      id:
        generateId(),

      companyId:
        file.companyId,

      actorUserId:
        req.user.id,

      action:
        'VIEW',

      entity:
        'CompanyFile',

      metadata:{
        id:file.id,
        fileName:file.fileName
      }

    });

    res.setHeader(
      'Content-Disposition',
      'inline; filename="' + file.fileName + '"'
    );

    return res.sendFile(
      localPath
    );

  }


  @UseGuards(JwtAuthGuard, RolesGuard)

  @Roles(
    ROLE.ROOT,
    ROLE.MASTER
  )

  @Delete(':id')
  async remove(

    @Request()
    req: any,

    @Param('id')
    id: string

  ) {

    const file =
      await this.companyFilesService.findById(
        id
      );

    if (!file) {

      return {
        success: false,
        message: 'Arquivo não encontrado'
      };

    }

    if (
      req.user.role !== ROLE.ROOT &&
        req.user.role !== ROLE.MASTER &&
      file.companyId !== req.user.companyId
    ) {

      return {
        success: false,
        message: 'Sem permissão para excluir este arquivo'
      };

    }

    const localPath =
      this.companyFilesService.resolveLocalPath(
        file
      );

    if (fs.existsSync(localPath)) {

      fs.unlinkSync(localPath);

    }

    await this.companyFilesService.delete(
      id
    );

    await this.companyFilesService.createAudit(
      {

        id:
          generateId(),

        companyId:
          file.companyId,

        actorUserId:
          req.user.id,

        action:
          'DELETE',

        entity:
          'CompanyFile',

        metadata: {

          id:
            file.id,

          fileName:
            file.fileName

        }

      }
    );

    return {

      success: true

    };
  }
}
