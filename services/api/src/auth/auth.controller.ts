import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  Res,
  UseGuards,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { IsEmail, MinLength, MaxLength, Matches } from 'class-validator';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Public } from './decorators/public.decorator';
import { CurrentUser, JwtPayload } from './decorators/current-user.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GoogleUser } from './strategies/google.strategy';
import { RefreshTokenPayload } from './strategies/jwt-refresh.strategy';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

class ForgotPasswordDto {
  @ApiProperty({ example: 'priya@example.com' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.toLowerCase().trim() : value
  )
  email!: string;
}

class ResetPasswordDto {
  @ApiProperty()
  token!: string;

  @ApiProperty({ example: 'NewSecurePass@123', minLength: 8 })
  @MinLength(8)
  @MaxLength(72)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'Password must contain uppercase, lowercase and number',
  })
  password!: string;
}

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new customer account' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.register(dto);
    this.authService.setTokenCookies(res, result.tokens);
    return {
      message: 'Registration successful',
      user: result.user,
      accessToken: result.tokens.accessToken,
    };
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(
    @Body() dto: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const ipAddress = (req.ip ?? req.socket?.remoteAddress) as string | undefined;
    const userAgent = req.headers['user-agent'];
    const result = await this.authService.login(dto, ipAddress, userAgent);
    this.authService.setTokenCookies(res, result.tokens);
    return {
      message: 'Login successful',
      user: result.user,
      accessToken: result.tokens.accessToken,
    };
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt-refresh'))
  @ApiOperation({ summary: 'Refresh access token using refresh token cookie' })
  async refresh(
    @CurrentUser() user: RefreshTokenPayload,
    @Res({ passthrough: true }) res: Response
  ) {
    const tokens = await this.authService.refreshTokens(
      user.sub,
      user.sessionId,
      user.refreshToken
    );
    this.authService.setTokenCookies(res, tokens);
    return {
      message: 'Token refreshed',
      accessToken: tokens.accessToken,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout and invalidate session' })
  async logout(@CurrentUser() user: JwtPayload, @Res({ passthrough: true }) res: Response) {
    await this.authService.logout(user.sub, user.sessionId);
    this.authService.clearTokenCookies(res);
    return { message: 'Logged out successfully' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  async getMe(@CurrentUser() user: JwtPayload) {
    return this.authService.getProfile(user.sub);
  }

  @Public()
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request password reset email' })
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto.email);
  }

  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset password with token' })
  async resetPassword(@Body() dto: ResetPasswordDto) {
    if (!dto.token) {
      throw new BadRequestException('Reset token is required');
    }
    return this.authService.resetPassword(dto.token, dto.password);
  }

  // Google OAuth
  @Public()
  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Initiate Google OAuth login' })
  googleAuth() {
    // Passport redirects to Google
  }

  @Public()
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Google OAuth callback' })
  async googleCallback(@Req() req: Request & { user: GoogleUser }, @Res() res: Response) {
    const ipAddress = (req.ip ?? req.socket?.remoteAddress) as string | undefined;
    const userAgent = req.headers['user-agent'];
    const result = await this.authService.googleLogin(req.user, ipAddress, userAgent);
    this.authService.setTokenCookies(res, result.tokens);

    const frontendUrl = process.env.APP_URL ?? 'http://localhost:3000';
    res.redirect(`${frontendUrl}/auth/callback?success=true`);
  }
}
