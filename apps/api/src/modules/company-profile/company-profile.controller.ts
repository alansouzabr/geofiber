import {
  Body,
  Controller,
  Get,
  Patch,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/jwt.guard';
import { CompanyProfileService } from './company-profile.service';

@Controller('company-profile')
@UseGuards(JwtAuthGuard)
export class CompanyProfileController {
  constructor(
    private readonly service: CompanyProfileService,
  ) {}

  /*
   * Perfil canônico da empresa da sessão.
   *
   * ROOT / MASTER:
   * empresa MASTER da plataforma.
   *
   * ADMIN / usuário corporativo:
   * própria empresa.
   */
  @Get()
  getCurrent(
    @Req()
    req: any,
  ) {
    return this.service.getCurrent(
      req.user,
    );
  }

  @Patch()
  updateCurrent(
    @Body()
    body: any,

    @Req()
    req: any,
  ) {
    return this.service.updateCurrent(
      body,
      req.user,
    );
  }

  /*
   * Endpoint por ID.
   *
   * Usado pelo /dashboard/[company].
   * A autorização tenant permanece no service.
   */
  @Get(':companyId')
  get(
    @Param('companyId')
    companyId: string,

    @Req()
    req: any,
  ) {
    return this.service.get(
      companyId,
      req.user,
    );
  }

  @Patch(':companyId')
  update(
    @Param('companyId')
    companyId: string,

    @Body()
    body: any,

    @Req()
    req: any,
  ) {
    return this.service.update(
      companyId,
      body,
      req.user,
    );
  }
}
