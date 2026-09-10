import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { join } from 'path';

import { RolesGuard }
from './common/guards/roles.guard';

import { PermissionGuard }
from './common/guards/permission.guard';

import { PrismaModule } from './modules/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { BillingModule } from './modules/billing/billing.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { AdminModule } from './modules/admin/admin.module';
import { MapsModule }
from "./modules/maps/maps.module";

import { UsersModule } from './modules/users/users.module';
import { PolesModule } from './modules/poles/poles.module';
import { ProjectFoldersModule } from './modules/project-folders/project-folders.module';
import { TrtModule } from './modules/trt/trt.module';
import { MonthlyDocumentsModule } from './modules/monthly-documents/monthly-documents.module';
import { UploadModule } from './modules/upload/upload.module';
import { CompanyProfileModule } from './modules/company-profile/company-profile.module';

import { CompanyManagementModule }
from './modules/company-management/company-management.module';

import { CompaniesModule }
from './modules/companies/companies.module';

import { JwtAuthGuard } from './modules/auth/jwt.guard';
import { CompanyGuard } from './modules/auth/guards/company.guard';
import { CompanyFilesModule } from './modules/company-files/company-files.module';
import { PoleAccessoriesModule }
from "./modules/pole-accessories/pole-accessories.module";

import { FieldTechniciansModule }
from './modules/field-technicians/field-technicians.module';
import { ChecklistsModule }
from './modules/checklists/checklists.module';



import { RolesModule } from './modules/roles/roles.module';

import { AuditModule } from './modules/audit/audit.module';

import { AuditInterceptor }
from './common/interceptors/audit.interceptor';

import { GlobalLibraryModule }
from './modules/global-library/global-library.module';

@Module({
  imports: [
      ServeStaticModule.forRoot({
        rootPath: join(__dirname, '..', 'uploads'),
        serveRoot: '/uploads',
      }),

    PrismaModule,
      RolesModule,
    AuthModule,
    BillingModule,
    ProjectsModule,
    AdminModule,
    UsersModule,
    PolesModule,
    PoleAccessoriesModule,
    ProjectFoldersModule,

    MapsModule,
    TrtModule,
    MonthlyDocumentsModule,
    UploadModule,
    CompanyProfileModule,

    CompanyManagementModule,
    CompaniesModule,
    FieldTechniciansModule,
    ChecklistsModule,
    AuditModule,
    CompanyFilesModule,
      GlobalLibraryModule,
  ],
  controllers: [],

  providers: [

    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },

    {
      provide: APP_GUARD,
      useClass: CompanyGuard,
    },

    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },

    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },

    {
      provide: APP_INTERCEPTOR,
      useClass: AuditInterceptor,
    },
  ],
})
export class AppModule {}
