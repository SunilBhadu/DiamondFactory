export type UserRole = 'customer' | 'admin' | 'staff' | 'supplier';

export interface UserAddress {
  id: string;
  userId: string;
  label?: string;
  firstName: string;
  lastName: string;
  phone?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  email: string;
  phone?: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  role: UserRole;
  emailVerified: boolean;
  phoneVerified: boolean;
  oauthProvider?: string;
  oauthId?: string;
  isActive: boolean;
  addresses?: UserAddress[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role?: UserRole;
}

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatarUrl?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}
