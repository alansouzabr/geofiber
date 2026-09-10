import {
  Controller,
  Post,
  Body,
  Get,
  Req
} from '@nestjs/common';

import { AuthService } from './auth.service';

import { Public }
from '../../common/decorators/public.decorator';

@Controller('auth')
export class AuthController {

  constructor(
    private authService: AuthService
  ) {}

  @Public()
  @Post('login')
  async login(
    @Body() body: {
      email: string;
      password: string;
    }
  ) {
    return this.authService.login(
      body.email,
      body.password
    );
  }

  @Public()
  @Post('register')
  async register(
    @Body() body: any
  ) {
    return this.authService.register(body);
  }

  @Get('me')
  async me(
    @Req() req: any
  ) {
    return req.user;
  }
}
