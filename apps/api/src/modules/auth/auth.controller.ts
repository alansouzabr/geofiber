import type { Response } from 'express';
import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('login')
  async login(@Res({ passthrough: true }) res: Response, @Body() body: any) {
    const email = String(body?.email || '');
    const password = String(body?.password || '');

    const r: any = await this.auth.login(email, password);

    // r.accessToken vem do service (seu curl já mostra isso)
    const token = String(r?.accessToken || '');

    if (token) {
      res.cookie('gf_token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        domain: '.geofibers.com.br',
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
      });
    }

    return r;
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.cookie('gf_token', '', {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      domain: '.geofibers.com.br',
      path: '/',
      maxAge: 0,
    });
    return { ok: true };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  me(@Req() req: any) {
    return this.auth.me(req.user.userId);
  }
}
