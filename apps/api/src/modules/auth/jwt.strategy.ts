import type { Request } from 'express';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

function cookieExtractor(req: Request): string | null {
  return (req as any)?.cookies?.gf_token || null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        cookieExtractor,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      // IGUAL ao AuthModule (registerAsync)
      secretOrKey: config.get<string>('JWT_SECRET') || 'CHANGE_ME',
    });
  }

  async validate(payload: any) {
    return {
      userId: payload?.sub,
      companyId: payload?.companyId ?? null,
      ...payload,
    };
  }
}
