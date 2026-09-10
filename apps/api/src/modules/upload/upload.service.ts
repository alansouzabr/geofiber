import {
  Injectable
} from '@nestjs/common';

import * as fs from 'fs';

import { join }
from 'path';

import { PrismaService }
from '../prisma/prisma.service';

@Injectable()
export class UploadService {

  private getUploadLimit(
    category?: string
  ){

    const trainingCategories=[

      "Treinamento NR",

      "Treinamento TI / Redes / Telecom",
      "SST / PGR / PCMSO"
];

    const isTraining=
      trainingCategories.includes(
        String(category ?? "")
      );

    return Number(

      isTraining
        ? process.env.UPLOAD_MAX_SIZE_TRAINING
        : process.env.UPLOAD_MAX_SIZE_GED

    );

  }

  constructor(
    private prisma: PrismaService
  ) {}

  async save(
    file: any,
    user: any,
    category = 'outros',
    body: any = {}
  ) {

    console.log("===== SAVE INICIO =====");
    console.log("FILE =", file?.originalname);
    console.log("BODY =", body);
    console.log("USER =", user);


    const MAX_SIZE =
      this.getUploadLimit(
        body.category || category
      );

    if (file.size > MAX_SIZE) {

      throw new Error(

        `Arquivo excede o limite de ${
          Math.round(MAX_SIZE/1024/1024)
        } MB`

      );

    }

    const now =
      new Date();

    const companyId =
      body.companyId ||
      user.companyId;

    const year =
      String(
        body.year ||
        now.getFullYear()
      );

    const month =
      String(
        body.month ||
        now.getMonth() + 1
      ).padStart(2, '0');

    const monthsMap = {

      "01": "01-janeiro",
      "02": "02-fevereiro",
      "03": "03-marco",
      "04": "04-abril",
      "05": "05-maio",
      "06": "06-junho",
      "07": "07-julho",
      "08": "08-agosto",
      "09": "09-setembro",
      "10": "10-outubro",
      "11": "11-novembro",
      "12": "12-dezembro"
    };

    const formattedMonth =
      monthsMap[month as keyof typeof monthsMap] || month;

    const folderCategory =
      body.category ||
      category ||
      'outros';

    const baseDir =
      join(
        process.cwd(),
        'uploads',
        'companies',
        companyId,
        year,
        formattedMonth,
        folderCategory
      );

    fs.mkdirSync(baseDir, {
      recursive: true
    });

    const safeName =
      file.originalname
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9.\-_]/g, '_');

    const allowedExtensions = [
      '.pdf',
      '.dwg',
      '.kmz',
      '.kml',
      '.doc',
      '.docx',
      '.xls',
      '.xlsx',
      '.png',
      '.jpg',
      '.jpeg',
      '.zip'
    ];

    const ext =
      safeName
        .substring(
          safeName.lastIndexOf('.')
        )
        .toLowerCase();

    if (!allowedExtensions.includes(ext)) {
      throw new Error(
        'Tipo de arquivo não permitido'
      );
    }

    const fileName =
      `${Date.now()}-${safeName}`;

    const fullPath =
      join(baseDir, fileName);

    fs.writeFileSync(
      fullPath,
      file.buffer
    );

    const fileUrl =
      `https://api.geofibers.com.br/uploads/companies/${companyId}/${year}/${formattedMonth}/${folderCategory}/${fileName}`;

    const trainingCategories=[

      "Treinamento NR",

      "Treinamento TI / Redes / Telecom",
];

    const targetTable=
      trainingCategories.includes(folderCategory)
        ? "global"
        : "company";

    const savedFile =

      targetTable==="global"

      ?

      await this.prisma.globalLibraryFile.create({

        data:{

          id:
            Math.random()
              .toString(36)
              .substring(2),

          category:
            folderCategory,

          name:
            safeName,

          fileName,

          fileUrl,

          month:
            formattedMonth,

          year,

          type:
            file.mimetype,

          size:
            file.size,

          uploadedBy:
            user?.id || "master"

        }

      })

      :

      await this.prisma.companyFile.create({

        data:{

          id:
            Math.random()
              .toString(36)
              .substring(2),

          companyId,

          name:
            safeName,

          fileName,

          fileUrl,

          category:
            folderCategory,

          month:
            formattedMonth,

          year,

          type:
            file.mimetype,

          size:
            file.size,

          uploadedBy:
            user?.id || "master"

        }

      });

    const auditCompanyId =
      targetTable === "global"
        ? user?.companyId
        : companyId;

    if (
      !auditCompanyId ||
      auditCompanyId === "global"
    ) {

      throw new Error(
        "AUDIT_COMPANY_ID_INVALID"
      );

    }

    await this.prisma.auditLog.create({
        data: {
          id: Math.random().toString(36).substring(7),
          companyId:
            auditCompanyId,
          actorUserId: user?.id || null,
          action: "UPLOAD",
          entity:
            targetTable==="global"
              ? "GlobalLibraryFile"
              : "CompanyFile",
          metadata: {
            fileName: safeName,
            category: folderCategory,
            year,
            month: formattedMonth
          }
        }
      });

    
return {

      success: true,

      file: savedFile
    };
  }

  async saveMany
(

    files: any[],

    user: any,

    category = 'outros',

    body: any = {}

  ) {

    if (!files?.length) {

      throw new Error(
        'Nenhum arquivo enviado'
      );
    }

    const uploadedFiles = [];

    for (const file of files) {

      const result =
        await this.save(
          file,
          user,
          category,
          body
        );

      uploadedFiles.push(
        result.file
      );
    }

        console.log("UPLOAD FINALIZADO");

  return {

      success: true,

      total:
        uploadedFiles.length,

      files:
        uploadedFiles
    };
  }


}
