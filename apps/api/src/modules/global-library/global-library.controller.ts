import {
  BadRequestException,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  Request,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';

import {
  FilesInterceptor
} from '@nestjs/platform-express';

import {
  memoryStorage
} from 'multer';

import * as fs from 'fs';

import {
  Response
} from 'express';

import {
  JwtAuthGuard
} from '../auth/jwt.guard';

import {
  RolesGuard
} from '../../common/guards/roles.guard';

import {
  Roles
} from '../../common/decorators/roles.decorator';

import {
  ROLE
} from '../roles/roles.constants';

import {
  GlobalLibraryService
} from './global-library.service';


const ALVARA_AVCB_CATEGORY =
  'ALVARA_AVCB';


const configuredUploadLimit =
  Number(
    process.env.UPLOAD_MAX_SIZE_GED
  );


const globalUploadLimit =
  Number.isFinite(
    configuredUploadLimit
  ) &&
  configuredUploadLimit > 0
    ? configuredUploadLimit
    : 25 * 1024 * 1024;


@Controller('global-library')
@UseGuards(JwtAuthGuard)
export class GlobalLibraryController {

  constructor(
    private readonly service:
      GlobalLibraryService
  ){}


  /*
   * ETAPA35A15B_ALVARA_AVCB
   *
   * ROOT e MASTER mantêm bypass de plataforma.
   *
   * ADMIN não recebe bypass:
   *
   * visualizar:
   *   module.files + files.view
   *
   * download:
   *   module.files + files.download
   *
   * O controle especial é aplicado somente
   * à categoria ALVARA_AVCB para não quebrar
   * a biblioteca global de Treinamentos.
   */
  private isPlatformRole(
    req: any
  ) {

    return (
      req?.user?.role ===
        ROLE.ROOT
      ||
      req?.user?.role ===
        ROLE.MASTER
    );

  }


  private hasAllPermissions(
    req: any,
    permissions:
      string[]
  ) {

    if (
      this.isPlatformRole(
        req
      )
    ) {
      return true;
    }


    const userPermissions =
      Array.isArray(
        req?.user?.permissions
      )
        ? req.user.permissions
        : [];


    return permissions.every(
      permission =>
        userPermissions.includes(
          permission
        )
    );

  }


  private canViewAlvara(
    req: any
  ) {

    return this
      .hasAllPermissions(
        req,
        [
          'module.files',
          'files.view'
        ]
      );

  }


  private canDownloadAlvara(
    req: any
  ) {

    return this
      .hasAllPermissions(
        req,
        [
          'module.files',
          'files.download'
        ]
      );

  }


  private assertAlvaraView(
    req: any
  ) {

    if (
      !this.canViewAlvara(
        req
      )
    ) {

      throw new ForbiddenException(
        'Sem permissão para visualizar Alvará / AVCB.'
      );

    }

  }


  private assertAlvaraDownload(
    req: any
  ) {

    if (
      !this.canDownloadAlvara(
        req
      )
    ) {

      throw new ForbiddenException(
        'Sem permissão para baixar Alvará / AVCB.'
      );

    }

  }


  private sanitizeFile(
    file: any
  ) {

    if (
      !file ||
      file.category !==
        ALVARA_AVCB_CATEGORY
    ) {
      return file;
    }


    /*
     * Não enviar fileUrl físico ao navegador.
     *
     * Alvará / AVCB deve ser consumido
     * por view/:id ou download/:id.
     */
    const {
      fileUrl,
      ...safe
    } = file;

    void fileUrl;

    return safe;

  }


  @UseGuards(
    JwtAuthGuard,
    RolesGuard
  )
  @Roles(
    ROLE.ROOT,
    ROLE.MASTER
  )
  @Post('alvara-avcb/upload')
  @UseInterceptors(
    FilesInterceptor(
      'files',
      10,
      {
        storage:
          memoryStorage(),

        limits: {
          fileSize:
            globalUploadLimit
        }
      }
    )
  )
  async uploadAlvaraAvcb(
    @UploadedFiles()
    files:
      Express.Multer.File[],

    @Request()
    req: any
  ) {

    if (
      !Array.isArray(files) ||
      files.length === 0
    ) {

      throw new BadRequestException(
        'Nenhum arquivo enviado.'
      );

    }


    const result =
      await this.service
        .saveAlvaraAvcb(
          files,
          req.user
        );


    return {
      ...result,
      files:
        result.files.map(
          file =>
            this.sanitizeFile(
              file
            )
        )
    };

  }


  @Get()
  async list(
    @Request()
    req: any,

    @Query('category')
    category?:string
  ){

    const normalizedCategory =
      String(
        category || ''
      )
        .trim()
        .toUpperCase();


    if (
      normalizedCategory ===
      ALVARA_AVCB_CATEGORY
    ) {

      this.assertAlvaraView(
        req
      );

    }


    const files =
      await this.service
        .list(
          category
        );


    /*
     * Uma listagem global sem filtro
     * não pode vazar Alvará / AVCB
     * para usuário sem permissão.
     */
    const visibleFiles =
      (
        !category &&
        !this.canViewAlvara(req)
      )
        ? files.filter(
            file =>
              file.category !==
              ALVARA_AVCB_CATEGORY
          )
        : files;


    return visibleFiles.map(
      file =>
        this.sanitizeFile(
          file
        )
    );

  }


  // ETAPA34A1A_GLOBAL_LIBRARY_SECURE_DELIVERY
  @Get('view/:id')
  async view(
    @Param('id')
    id:string,

    @Request()
    req:any,

    @Res()
    res:Response
  ){

    const file =
      await this.service
        .findById(id);


    if(!file){

      throw new NotFoundException(
        'Arquivo não encontrado.'
      );

    }


    if (
      file.category ===
      ALVARA_AVCB_CATEGORY
    ) {

      this.assertAlvaraView(
        req
      );

    }


    let localPath:string;


    try {

      localPath =
        this.service
          .resolveLocalPath(
            file
          );

    } catch {

      throw new NotFoundException(
        'Arquivo inválido.'
      );

    }


    if(
      !fs.existsSync(
        localPath
      )
      ||
      !fs.statSync(
        localPath
      ).isFile()
    ){

      throw new NotFoundException(
        'Arquivo físico não encontrado.'
      );

    }


    res.setHeader(
      'Cache-Control',
      'private, no-store'
    );


    res.setHeader(
      'X-Content-Type-Options',
      'nosniff'
    );


    return res.sendFile(
      localPath
    );

  }


  @Get('download/:id')
  async download(
    @Param('id')
    id:string,

    @Request()
    req:any,

    @Res()
    res:Response
  ){

    const file =
      await this.service
        .findById(id);


    if(!file){

      throw new NotFoundException(
        'Arquivo não encontrado.'
      );

    }


    if (
      file.category ===
      ALVARA_AVCB_CATEGORY
    ) {

      this.assertAlvaraDownload(
        req
      );

    }


    let localPath:string;


    try {

      localPath =
        this.service
          .resolveLocalPath(
            file
          );

    } catch {

      throw new NotFoundException(
        'Arquivo inválido.'
      );

    }


    if(
      !fs.existsSync(
        localPath
      )
      ||
      !fs.statSync(
        localPath
      ).isFile()
    ){

      throw new NotFoundException(
        'Arquivo físico não encontrado.'
      );

    }


    res.setHeader(
      'Cache-Control',
      'private, no-store'
    );


    res.setHeader(
      'X-Content-Type-Options',
      'nosniff'
    );


    return res.download(
      localPath,
      file.name ||
      file.fileName
    );

  }


  /*
   * ETAPA35A16B_GLOBAL_LIBRARY_DELETE
   *
   * Exclusão da Biblioteca Global:
   * somente ROOT / MASTER.
   *
   * O frontend de Treinamentos já utiliza:
   * DELETE /global-library/:id
   */
  @UseGuards(
    JwtAuthGuard,
    RolesGuard
  )
  @Roles(
    ROLE.ROOT,
    ROLE.MASTER
  )
  @Delete(':id')
  async remove(
    @Param('id')
    id:string
  ){

    const removed =
      await this.service
        .remove(
          id
        );

    if(!removed){

      throw new NotFoundException(
        'Arquivo não encontrado.'
      );

    }

    return {
      success:true,
      id:removed.id
    };

  }


  @Get(':id')
  async find(
    @Param('id')
    id:string,

    @Request()
    req:any
  ){

    const file =
      await this.service
        .findById(id);


    if(!file){

      throw new NotFoundException(
        'Arquivo não encontrado.'
      );

    }


    if (
      file.category ===
      ALVARA_AVCB_CATEGORY
    ) {

      this.assertAlvaraView(
        req
      );

    }


    return this.sanitizeFile(
      file
    );

  }

}
