import {
  Injectable
} from '@nestjs/common';

import * as fs from 'fs';

import {
  extname,
  join,
  resolve,
  sep
} from 'path';

import {
  PrismaService
} from '../prisma/prisma.service';


const ALVARA_AVCB_CATEGORY =
  'ALVARA_AVCB';


@Injectable()
export class GlobalLibraryService {

  constructor(
    private readonly prisma:
      PrismaService
  ) {}


  /*
   * ETAPA34A1A_GLOBAL_LIBRARY_SECURE_PATH
   */
  resolveLocalPath(
    file: {
      fileUrl:string;
    }
  ){

    const rawUrl =
      String(
        file?.fileUrl ??
        ''
      );

    let pathname =
      rawUrl;

    try {

      pathname =
        new URL(
          rawUrl
        ).pathname;

    } catch {

      pathname =
        rawUrl;

    }

    try {

      pathname =
        decodeURIComponent(
          pathname
        );

    } catch {

      throw new Error(
        'GLOBAL_LIBRARY_INVALID_URL_ENCODING'
      );

    }

    const uploadsPrefix =
      '/uploads/';

    if(
      !pathname.startsWith(
        uploadsPrefix
      )
    ){

      throw new Error(
        'GLOBAL_LIBRARY_INVALID_FILE_URL'
      );

    }

    const relativePath =
      pathname.slice(
        uploadsPrefix.length
      );

    if(!relativePath){

      throw new Error(
        'GLOBAL_LIBRARY_EMPTY_FILE_PATH'
      );

    }

    const uploadRoot =
      resolve(
        process.cwd(),
        'uploads'
      );

    const localPath =
      resolve(
        uploadRoot,
        relativePath
      );

    if(
      localPath !== uploadRoot &&
      !localPath.startsWith(
        uploadRoot + sep
      )
    ){

      throw new Error(
        'GLOBAL_LIBRARY_PATH_ESCAPE'
      );

    }

    return localPath;

  }


  /*
   * ETAPA35A15B_ALVARA_AVCB
   *
   * Upload global especializado.
   *
   * Não utiliza companyId.
   * Não cria CompanyFile.
   * Não altera o fluxo de treinamento.
   */
  async saveAlvaraAvcb(
    files: Express.Multer.File[],
    user: any
  ) {

    if (
      !Array.isArray(files) ||
      files.length === 0
    ) {

      throw new Error(
        'Nenhum arquivo enviado'
      );

    }


    const configuredLimit =
      Number(
        process.env.UPLOAD_MAX_SIZE_GED
      );

    const maxSize =
      Number.isFinite(
        configuredLimit
      ) &&
      configuredLimit > 0
        ? configuredLimit
        : 25 * 1024 * 1024;


    const allowedExtensions =
      new Set([
        '.pdf',
        '.png',
        '.jpg',
        '.jpeg'
      ]);


    const now =
      new Date();

    const year =
      String(
        now.getFullYear()
      );

    const month =
      String(
        now.getMonth() + 1
      ).padStart(
        2,
        '0'
      );


    const baseDir =
      join(
        process.cwd(),
        'uploads',
        'global',
        'alvara-avcb',
        year,
        month
      );


    fs.mkdirSync(
      baseDir,
      {
        recursive: true
      }
    );


    const saved = [];


    for (
      let index = 0;
      index < files.length;
      index += 1
    ) {

      const file =
        files[index];


      if (
        !file ||
        !file.buffer
      ) {

        throw new Error(
          'Arquivo inválido'
        );

      }


      if (
        Number(
          file.size || 0
        ) > maxSize
      ) {

        throw new Error(
          `Arquivo excede o limite de ${
            Math.round(
              maxSize /
              1024 /
              1024
            )
          } MB`
        );

      }


      const originalName =
        String(
          file.originalname ||
          'documento'
        );


      const safeName =
        originalName
          .normalize('NFD')
          .replace(
            /[\u0300-\u036f]/g,
            ''
          )
          .replace(
            /[^a-zA-Z0-9.\-_]/g,
            '_'
          );


      const extension =
        extname(
          safeName
        ).toLowerCase();


      if (
        !allowedExtensions.has(
          extension
        )
      ) {

        throw new Error(
          'Tipo de arquivo não permitido. Utilize PDF, PNG, JPG ou JPEG.'
        );

      }


      const fileName =
        `${
          Date.now()
        }-${
          index
        }-${
          Math.random()
            .toString(36)
            .slice(2, 9)
        }-${
          safeName
        }`;


      const fullPath =
        join(
          baseDir,
          fileName
        );


      fs.writeFileSync(
        fullPath,
        file.buffer
      );


      const fileUrl =
        `https://api.geofibers.com.br/uploads/global/alvara-avcb/${
          year
        }/${
          month
        }/${
          fileName
        }`;


      try {

        const record =
          await this.prisma
            .globalLibraryFile
            .create({
              data: {
                category:
                  ALVARA_AVCB_CATEGORY,

                name:
                  safeName,

                fileName,

                fileUrl,

                month,

                year,

                type:
                  file.mimetype ||
                  null,

                size:
                  Number(
                    file.size || 0
                  ),

                uploadedBy:
                  user?.id ||
                  null
              }
            });


        saved.push(
          record
        );

      } catch (error) {

        try {

          if (
            fs.existsSync(
              fullPath
            )
          ) {

            fs.unlinkSync(
              fullPath
            );

          }

        } catch {

          // rollback físico best-effort

        }

        throw error;

      }

    }


    return {
      success: true,
      category:
        ALVARA_AVCB_CATEGORY,
      total:
        saved.length,
      files:
        saved
    };

  }


  async list(
    category?: string
  ) {

    return this.prisma
      .globalLibraryFile
      .findMany({
        where:
          category
            ? {
                category
              }
            : {},

        orderBy: [
          {
            category: 'asc'
          },
          {
            name: 'asc'
          }
        ]
      });

  }


  async findById(
    id: string
  ) {

    return this.prisma
      .globalLibraryFile
      .findUnique({
        where: {
          id
        }
      });

  }


  /*
   * ETAPA35A16B_GLOBAL_LIBRARY_DELETE
   */
  async remove(
    id: string
  ) {

    const file =
      await this.findById(
        id
      );

    if (!file) {

      return null;

    }

    const localPath =
      this.resolveLocalPath(
        file
      );

    if (
      fs.existsSync(
        localPath
      ) &&
      fs.statSync(
        localPath
      ).isFile()
    ) {

      fs.unlinkSync(
        localPath
      );

    }

    return this.prisma
      .globalLibraryFile
      .delete({
        where: {
          id
        }
      });

  }


}
