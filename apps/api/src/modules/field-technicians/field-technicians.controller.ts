import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Req,
  UseGuards
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/jwt.guard';
import { SubscriptionGuard } from '../../common/guards/subscription.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

import { FieldTechniciansService } from './field-technicians.service';

import { CreateFieldTechnicianDto } from './dto/create-field-technician.dto';
import { UpdateFieldTechnicianDto } from './dto/update-field-technician.dto';
import { UpdateFieldTechnicianToolsDto } from './dto/update-field-technician-tools.dto';
import { UpdateFieldTechnicianVehicleDto } from './dto/update-field-technician-vehicle.dto';

@Controller('field-technicians')
export class FieldTechniciansController {

  constructor(
    private service: FieldTechniciansService
  ) {}

    /*
     * ETAPA32F_PLATFORM_TECHNICIANS
     *
     * Endpoints cross-company exclusivos
     * para ROOT / MASTER.
     *
     * O service existente continua sendo
     * a única implementação das regras
     * de FieldTechnicianProfile.
     */

    @UseGuards(
      RolesGuard
    )
    @Roles(
      'ROOT',
      'MASTER'
    )
    @Get(
      'platform/company/:companyId'
    )
    platformList(
      @Param('companyId')
      companyId: string
    ) {
      return this.service.list(
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
    @Post(
      'platform/company/:companyId'
    )
    platformCreate(
      @Param('companyId')
      companyId: string,

      @Body()
      body: CreateFieldTechnicianDto
    ) {
      return this.service.create(
        body,
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
    @Delete(
      'platform/company/:companyId/:id'
    )
    platformRemove(
      @Param('companyId')
      companyId: string,

      @Param('id')
      id: string
    ) {
      return this.service.remove(
        id,
        companyId
      );
    }



    /*
     * ETAPA32G_PLATFORM_TECHNICIAN_TOOLS
     *
     * Gestão cross-company das ferramentas
     * operacionais do técnico.
     *
     * Somente ROOT / MASTER.
     */

    @UseGuards(
      RolesGuard
    )
    @Roles(
      'ROOT',
      'MASTER'
    )
    @Patch(
      'platform/company/:companyId/:id/tools'
    )
    platformUpdateTools(
      @Param('companyId')
      companyId: string,

      @Param('id')
      id: string,

      @Body()
      body: UpdateFieldTechnicianToolsDto
    ) {

      return this.service.updateTools(
        id,
        body.tools,
        companyId
      );

    }



    /*
     * ETAPA32H_PLATFORM_TECHNICIAN_VEHICLE
     *
     * Gestão cross-company do veículo
     * operacional do técnico.
     *
     * Somente ROOT / MASTER.
     */

    @UseGuards(
      RolesGuard
    )
    @Roles(
      'ROOT',
      'MASTER'
    )
    @Patch(
      'platform/company/:companyId/:id/vehicle'
    )
    platformUpdateVehicle(
      @Param('companyId')
      companyId: string,

      @Param('id')
      id: string,

      @Body()
      body: UpdateFieldTechnicianVehicleDto
    ) {

      return this.service.updateVehicle(
        id,
        body.vehicle,
        companyId
      );

    }


  @UseGuards(
    JwtAuthGuard,
    SubscriptionGuard
  )
  @Get()
  list(
    @Req() req: any
  ) {
    return this.service.list(
      req.user.companyId
    );
  }

  @UseGuards(
    JwtAuthGuard,
    SubscriptionGuard
  )
  @Post()
  create(
    @Body() body: CreateFieldTechnicianDto,
    @Req() req: any
  ) {
    return this.service.create(
      body,
      req.user.companyId
    );
  }

  @UseGuards(
    JwtAuthGuard,
    SubscriptionGuard
  )
  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Req() req: any
  ) {
    return this.service.findOne(
      id,
      req.user.companyId
    );
  }

  @UseGuards(
    JwtAuthGuard,
    SubscriptionGuard
  )
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() body: UpdateFieldTechnicianDto,
    @Req() req: any
  ) {
    return this.service.update(
      id,
      body,
      req.user.companyId
    );
  }

  /*
   * ETAPA35E2_TENANT_TECHNICIAN_TOOLS
   *
   * Gestão de ferramentas limitada
   * à empresa da sessão autenticada.
   */
  @UseGuards(
    JwtAuthGuard,
    SubscriptionGuard
  )
  @Patch(':id/tools')
  updateTools(
    @Param('id') id: string,
    @Body() body: UpdateFieldTechnicianToolsDto,
    @Req() req: any
  ) {
    return this.service.updateTools(
      id,
      body.tools,
      req.user.companyId
    );
  }

  /*
   * ETAPA35A11C2D_R1B_TENANT_VEHICLE
   *
   * Veículo limitado à empresa
   * autenticada no JWT.
   */
  @UseGuards(
    JwtAuthGuard,
    SubscriptionGuard
  )
  @Patch(':id/vehicle')
  updateVehicle(
    @Param('id') id: string,
    @Body()
    body: UpdateFieldTechnicianVehicleDto,
    @Req() req: any
  ) {
    return this.service.updateVehicle(
      id,
      body.vehicle,
      req.user.companyId
    );
  }


  @UseGuards(
    JwtAuthGuard,
    SubscriptionGuard
  )
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Req() req: any
  ) {
    return this.service.remove(
      id,
      req.user.companyId
    );
  }

}
