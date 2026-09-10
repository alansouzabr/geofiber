import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards
} from '@nestjs/common';

import {
  RolesGuard
} from '../../common/guards/roles.guard';

import {
  Roles
} from '../../common/decorators/roles.decorator';

import {
  Permissions
} from '../../common/decorators/permissions.decorator';

import {
  ChecklistsService
} from './checklists.service';

import {
  CreateChecklistTemplateDto
} from './dto/create-checklist-template.dto';

import {
  UpdateChecklistTemplateDto
} from './dto/update-checklist-template.dto';

import {
  CreateChecklistExecutionDto
} from './dto/create-checklist-execution.dto';

import {
  UpdateChecklistExecutionItemDto
} from './dto/update-checklist-execution-item.dto';


@Controller('checklists')
@Permissions('module.execution')
export class ChecklistsController {

  constructor(
    private readonly service: ChecklistsService
  ) {}


  private tenantCompanyId(
    req: any
  ): string {

    const companyId =
      req?.user?.companyId;


    if (!companyId) {

      throw new ForbiddenException(
        'Usuário sem empresa'
      );

    }


    return companyId;
  }


  /*
   * ==========================================================
   * TENANT — TEMPLATES
   * ==========================================================
   */


  @Get('templates')
  tenantTemplates(
    @Req()
    req: any
  ) {

    return this.service.listTemplates(
      this.tenantCompanyId(req)
    );
  }


  @Get('templates/:id')
  tenantTemplate(
    @Req()
    req: any,

    @Param('id')
    id: string
  ) {

    return this.service.getTemplate(
      this.tenantCompanyId(req),
      id
    );
  }


  @Post('templates')
  tenantCreateTemplate(
    @Req()
    req: any,

    @Body()
    body: CreateChecklistTemplateDto
  ) {

    return this.service.createTemplate(
      this.tenantCompanyId(req),
      req.user.id,
      body
    );
  }


  @Patch('templates/:id')
  tenantUpdateTemplate(
    @Req()
    req: any,

    @Param('id')
    id: string,

    @Body()
    body: UpdateChecklistTemplateDto
  ) {

    return this.service.updateTemplate(
      this.tenantCompanyId(req),
      id,
      body
    );
  }


  @Patch('templates/:id/archive')
  tenantArchiveTemplate(
    @Req()
    req: any,

    @Param('id')
    id: string
  ) {

    return this.service.archiveTemplate(
      this.tenantCompanyId(req),
      id
    );
  }


  /*
   * ==========================================================
   * TENANT — EXECUTIONS
   * ==========================================================
   */


  @Get('executions')
  tenantExecutions(
    @Req()
    req: any
  ) {

    return this.service.listExecutions(
      this.tenantCompanyId(req)
    );
  }


  @Get('executions/:id')
  tenantExecution(
    @Req()
    req: any,

    @Param('id')
    id: string
  ) {

    return this.service.getExecution(
      this.tenantCompanyId(req),
      id
    );
  }


  @Post('executions')
  tenantCreateExecution(
    @Req()
    req: any,

    @Body()
    body: CreateChecklistExecutionDto
  ) {

    return this.service.createExecution(
      this.tenantCompanyId(req),
      req.user.id,
      body
    );
  }


  @Patch(
    'executions/:executionId/items/:itemId'
  )
  tenantUpdateExecutionItem(
    @Req()
    req: any,

    @Param('executionId')
    executionId: string,

    @Param('itemId')
    itemId: string,

    @Body()
    body: UpdateChecklistExecutionItemDto
  ) {

    return this.service.updateExecutionItem(
      this.tenantCompanyId(req),
      executionId,
      itemId,
      body
    );
  }


  @Patch('executions/:id/complete')
  tenantCompleteExecution(
    @Req()
    req: any,

    @Param('id')
    id: string
  ) {

    return this.service.completeExecution(
      this.tenantCompanyId(req),
      id
    );
  }


  @Patch('executions/:id/cancel')
  tenantCancelExecution(
    @Req()
    req: any,

    @Param('id')
    id: string
  ) {

    return this.service.cancelExecution(
      this.tenantCompanyId(req),
      id
    );
  }


  /*
   * ==========================================================
   * PLATFORM — ROOT / MASTER
   * ==========================================================
   */


  @UseGuards(
    RolesGuard
  )
  @Roles(
    'ROOT',
    'MASTER'
  )
  @Get(
    'platform/company/:companyId/templates'
  )
  platformTemplates(
    @Param('companyId')
    companyId: string
  ) {

    return this.service.listTemplates(
      companyId
    );
  }


  @UseGuards(
    RolesGuard
  )
  @Roles(
    'ROOT',
    'MASTER'
  )
  @Get(
    'platform/company/:companyId/templates/:id'
  )
  platformTemplate(
    @Param('companyId')
    companyId: string,

    @Param('id')
    id: string
  ) {

    return this.service.getTemplate(
      companyId,
      id
    );
  }


  @UseGuards(
    RolesGuard
  )
  @Roles(
    'ROOT',
    'MASTER'
  )
  @Post(
    'platform/company/:companyId/templates'
  )
  platformCreateTemplate(
    @Req()
    req: any,

    @Param('companyId')
    companyId: string,

    @Body()
    body: CreateChecklistTemplateDto
  ) {

    return this.service.createTemplate(
      companyId,
      req.user.id,
      body
    );
  }


  @UseGuards(
    RolesGuard
  )
  @Roles(
    'ROOT',
    'MASTER'
  )
  @Patch(
    'platform/company/:companyId/templates/:id'
  )
  platformUpdateTemplate(
    @Param('companyId')
    companyId: string,

    @Param('id')
    id: string,

    @Body()
    body: UpdateChecklistTemplateDto
  ) {

    return this.service.updateTemplate(
      companyId,
      id,
      body
    );
  }


  @UseGuards(
    RolesGuard
  )
  @Roles(
    'ROOT',
    'MASTER'
  )
  @Patch(
    'platform/company/:companyId/templates/:id/archive'
  )
  platformArchiveTemplate(
    @Param('companyId')
    companyId: string,

    @Param('id')
    id: string
  ) {

    return this.service.archiveTemplate(
      companyId,
      id
    );
  }


  @UseGuards(
    RolesGuard
  )
  @Roles(
    'ROOT',
    'MASTER'
  )
  @Get(
    'platform/company/:companyId/executions'
  )
  platformExecutions(
    @Param('companyId')
    companyId: string
  ) {

    return this.service.listExecutions(
      companyId
    );
  }


  @UseGuards(
    RolesGuard
  )
  @Roles(
    'ROOT',
    'MASTER'
  )
  @Get(
    'platform/company/:companyId/executions/:id'
  )
  platformExecution(
    @Param('companyId')
    companyId: string,

    @Param('id')
    id: string
  ) {

    return this.service.getExecution(
      companyId,
      id
    );
  }

}
