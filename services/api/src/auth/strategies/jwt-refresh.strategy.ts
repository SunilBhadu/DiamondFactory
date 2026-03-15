import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { JwtPayload } from '../decorators/current-user.decorator';

export interface RefreshTokenPayload extends JwtPayload {
  refreshToken: string;
}

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return (request?.cookies as Record<string, string>)?.refresh_token ?? null;
        },
        ExtractJwt.fromBodyField('refreshToken'),
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.refreshSecret') ?? 'fallback-refresh-secret',
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: JwtPayload): RefreshTokenPayload {
    const refreshToken =
      (req?.cookies as Record<string, string>)?.refresh_token ??
      (req?.body as Record<string, string>)?.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    return {
      ...payload,
      refreshToken,
    };
  }
}
