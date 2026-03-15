import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback, Profile } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';

export interface GoogleUser {
  googleId: string;
  email: string;
  firstName: string;
  lastName: string;
  picture?: string;
  accessToken: string;
}

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get<string>('google.clientId') ?? '',
      clientSecret: configService.get<string>('google.clientSecret') ?? '',
      callbackURL:
        configService.get<string>('google.callbackUrl') ??
        'http://localhost:3001/api/v1/auth/google/callback',
      scope: ['email', 'profile'],
    });
  }

  validate(
    accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: VerifyCallback
  ): void {
    const { id, name, emails, photos } = profile;

    const user: GoogleUser = {
      googleId: id,
      email: emails?.[0]?.value ?? '',
      firstName: name?.givenName ?? '',
      lastName: name?.familyName ?? '',
      picture: photos?.[0]?.value,
      accessToken,
    };

    done(null, user);
  }
}
