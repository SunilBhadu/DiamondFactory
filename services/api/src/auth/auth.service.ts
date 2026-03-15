import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { PrismaService } from '../database/prisma.service';
import { RedisService } from '../redis/redis.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './decorators/current-user.decorator';
import { GoogleUser } from './strategies/google.strategy';
import { Response } from 'express';

const SALT_ROUNDS = 12;
const ACCESS_TOKEN_EXPIRY = 15 * 60; // 15 minutes in seconds
const REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60; // 7 days in seconds
const PASSWORD_RESET_EXPIRY = 60 * 60; // 1 hour

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    avatar?: string | null;
  };
  tokens: TokenPair;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private redis: RedisService
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponse> {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existing) {
      throw new ConflictException('An account with this email already exists');
    }

    const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone,
        role: 'CUSTOMER',
        isActive: true,
        isEmailVerified: false,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        avatar: true,
      },
    });

    const sessionId = crypto.randomUUID();
    const tokens = await this.issueTokenPair(user.id, user.email, user.role, sessionId);

    await this.prisma.userSession.create({
      data: {
        userId: user.id,
        sessionToken: sessionId,
        refreshTokenHash: await bcrypt.hash(tokens.refreshToken, 10),
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY * 1000),
        ipAddress: null,
        userAgent: null,
      },
    });

    this.logger.log(`New user registered: ${user.email}`);

    return { user, tokens };
  }

  async login(dto: LoginDto, ipAddress?: string, userAgent?: string): Promise<AuthResponse> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        avatar: true,
        passwordHash: true,
        isActive: true,
      },
    });

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account has been deactivated. Please contact support.');
    }

    const passwordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const sessionId = crypto.randomUUID();
    const tokens = await this.issueTokenPair(user.id, user.email, user.role, sessionId);

    await this.prisma.userSession.create({
      data: {
        userId: user.id,
        sessionToken: sessionId,
        refreshTokenHash: await bcrypt.hash(tokens.refreshToken, 10),
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY * 1000),
        ipAddress: ipAddress ?? null,
        userAgent: userAgent ?? null,
      },
    });

    // Update lastLoginAt
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    this.logger.log(`User logged in: ${user.email}`);

    const { passwordHash: _, ...safeUser } = user;
    return { user: safeUser, tokens };
  }

  async googleLogin(
    googleUser: GoogleUser,
    ipAddress?: string,
    userAgent?: string
  ): Promise<AuthResponse> {
    let user = await this.prisma.user.findFirst({
      where: {
        OR: [{ googleId: googleUser.googleId }, { email: googleUser.email }],
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        avatar: true,
        isActive: true,
        googleId: true,
      },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: googleUser.email,
          googleId: googleUser.googleId,
          firstName: googleUser.firstName,
          lastName: googleUser.lastName,
          avatar: googleUser.picture,
          role: 'CUSTOMER',
          isActive: true,
          isEmailVerified: true,
          passwordHash: null,
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          avatar: true,
          isActive: true,
          googleId: true,
        },
      });
      this.logger.log(`New Google user registered: ${user.email}`);
    } else if (!user.googleId) {
      // Link Google account to existing email account
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          googleId: googleUser.googleId,
          isEmailVerified: true,
          avatar: user.avatar ?? googleUser.picture,
        },
      });
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account has been deactivated');
    }

    const sessionId = crypto.randomUUID();
    const tokens = await this.issueTokenPair(user.id, user.email, user.role, sessionId);

    await this.prisma.userSession.create({
      data: {
        userId: user.id,
        sessionToken: sessionId,
        refreshTokenHash: await bcrypt.hash(tokens.refreshToken, 10),
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY * 1000),
        ipAddress: ipAddress ?? null,
        userAgent: userAgent ?? null,
      },
    });

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        avatar: user.avatar,
      },
      tokens,
    };
  }

  async refreshTokens(
    userId: string,
    sessionId: string,
    oldRefreshToken: string
  ): Promise<TokenPair> {
    const session = await this.prisma.userSession.findFirst({
      where: {
        userId,
        sessionToken: sessionId,
        expiresAt: { gt: new Date() },
      },
    });

    if (!session) {
      throw new UnauthorizedException('Session not found or expired');
    }

    const refreshTokenValid = await bcrypt.compare(oldRefreshToken, session.refreshTokenHash);
    if (!refreshTokenValid) {
      // Potential token theft — invalidate all sessions
      await this.prisma.userSession.deleteMany({ where: { userId } });
      throw new UnauthorizedException('Invalid refresh token. All sessions invalidated.');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, role: true, isActive: true },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('User not found or inactive');
    }

    const tokens = await this.issueTokenPair(user.id, user.email, user.role, sessionId);

    await this.prisma.userSession.update({
      where: { id: session.id },
      data: {
        refreshTokenHash: await bcrypt.hash(tokens.refreshToken, 10),
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY * 1000),
        lastUsedAt: new Date(),
      },
    });

    return tokens;
  }

  async logout(userId: string, sessionId: string): Promise<void> {
    await this.prisma.userSession.deleteMany({
      where: { userId, sessionToken: sessionId },
    });

    // Blacklist the access token in Redis (TTL = access token expiry)
    await this.redis.setEx(`blacklist:session:${sessionId}`, ACCESS_TOKEN_EXPIRY, '1');

    this.logger.log(`User ${userId} logged out from session ${sessionId}`);
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    // Always return success to prevent email enumeration
    if (!user) {
      return {
        message: 'If an account with that email exists, a password reset link has been sent.',
      };
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

    await this.redis.setEx(`password_reset:${resetTokenHash}`, PASSWORD_RESET_EXPIRY, user.id);

    // In production, send email via SES/SendGrid
    // For now, log the token (development only)
    this.logger.log(`Password reset token for ${email}: ${resetToken}`);

    return {
      message: 'If an account with that email exists, a password reset link has been sent.',
    };
  }

  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const userId = await this.redis.get<string>(`password_reset:${tokenHash}`);

    if (!userId) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);

    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });

    // Invalidate the reset token
    await this.redis.del(`password_reset:${tokenHash}`);

    // Invalidate all existing sessions for security
    await this.prisma.userSession.deleteMany({ where: { userId } });

    return { message: 'Password reset successfully. Please log in with your new password.' };
  }

  async issueTokenPair(
    userId: string,
    email: string,
    role: string,
    sessionId: string
  ): Promise<TokenPair> {
    const payload: JwtPayload = { sub: userId, email, role, sessionId };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('jwt.accessSecret'),
        expiresIn: this.configService.get<string>('jwt.accessExpiresIn') ?? '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('jwt.refreshSecret'),
        expiresIn: this.configService.get<string>('jwt.refreshExpiresIn') ?? '7d',
      }),
    ]);

    return { accessToken, refreshToken };
  }

  setTokenCookies(res: Response, tokens: TokenPair): void {
    const isProduction = this.configService.get<string>('nodeEnv') === 'production';

    res.cookie('access_token', tokens.accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: ACCESS_TOKEN_EXPIRY * 1000,
      path: '/',
    });

    res.cookie('refresh_token', tokens.refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: REFRESH_TOKEN_EXPIRY * 1000,
      path: '/api/v1/auth/refresh',
    });
  }

  clearTokenCookies(res: Response): void {
    res.clearCookie('access_token', { path: '/' });
    res.clearCookie('refresh_token', { path: '/api/v1/auth/refresh' });
  }

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, passwordHash: true, isActive: true, role: true },
    });
    if (!user || !user.passwordHash || !user.isActive) return null;
    const valid = await bcrypt.compare(password, user.passwordHash);
    return valid ? user : null;
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatar: true,
        role: true,
        isEmailVerified: true,
        createdAt: true,
        addresses: {
          where: { isDefault: true },
          take: 1,
        },
      },
    });

    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}
