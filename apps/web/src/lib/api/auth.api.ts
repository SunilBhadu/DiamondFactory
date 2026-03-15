import { get, post, patch } from '@/lib/api-client';
import type { User, AuthTokens, LoginDto, RegisterDto } from '@diamond-factory/types';

export interface LoginResponse extends AuthTokens {
  user: User;
}

export interface RegisterResponse extends AuthTokens {
  user: User;
}

export const authApi = {
  /**
   * Login with email and password
   */
  async login(dto: LoginDto): Promise<LoginResponse> {
    return post<LoginResponse>('/auth/login', dto);
  },

  /**
   * Register a new account
   */
  async register(dto: RegisterDto): Promise<RegisterResponse> {
    return post<RegisterResponse>('/auth/register', dto);
  },

  /**
   * Logout (invalidates refresh token)
   */
  async logout(): Promise<void> {
    return post<void>('/auth/logout');
  },

  /**
   * Refresh the access token using the refresh token cookie
   */
  async refreshToken(token?: string): Promise<AuthTokens> {
    return post<AuthTokens>('/auth/refresh', token ? { refreshToken: token } : {});
  },

  /**
   * Redirect to Google OAuth
   */
  googleAuth(): void {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    window.location.href = `${apiUrl}/auth/google`;
  },

  /**
   * Get current user profile
   */
  async getProfile(): Promise<User> {
    return get<User>('/auth/me');
  },

  /**
   * Update user profile
   */
  async updateProfile(dto: Partial<User>): Promise<User> {
    return patch<User>('/users/me', dto);
  },

  /**
   * Request a password reset email
   */
  async forgotPassword(email: string): Promise<{ message: string }> {
    return post<{ message: string }>('/auth/forgot-password', { email });
  },

  /**
   * Reset password using the token from email
   */
  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    return post<{ message: string }>('/auth/reset-password', { token, newPassword });
  },
};
