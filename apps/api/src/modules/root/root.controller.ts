import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { PermissionsGuard } from '../../common/auth/permissions.guard';
import { RootGuard } from './root.guard';
import { RootService } from './root.service';
import { ok } from '../../common/http/api-response';

@Controller('root')
@UseGuards(JwtAuthGuard, PermissionsGuard, RootGuard)
export class RootController {
  constructor(private root: RootService) {}

  @Post('companies')
  async createCompanyWithAdmin(
    @Body()
    body: {
      company: { name: string; cnpj?: string | null };
      admin: { email: string; name: string; password: string };
    },
  ) {
    const result = await this.root.createCompanyWithAdmin(body);
    return ok(result);
  }
}
