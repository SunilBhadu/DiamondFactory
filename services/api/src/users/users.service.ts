import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  MinLength,
  MaxLength,
  IsBoolean,
  IsEnum,
  IsPostalCode,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'Priya' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @Transform(({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value))
  firstName?: string;

  @ApiPropertyOptional({ example: 'Sharma' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @Transform(({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value))
  lastName?: string;

  @ApiPropertyOptional({ example: '+91 98765 43210' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  avatar?: string;
}

export class CreateAddressDto {
  @ApiProperty()
  @IsString()
  @MinLength(2)
  label!: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  firstName!: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  lastName!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty()
  @IsString()
  @MinLength(5)
  addressLine1!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  addressLine2?: string;

  @ApiProperty()
  @IsString()
  city!: string;

  @ApiProperty()
  @IsString()
  state!: string;

  @ApiProperty()
  @IsString()
  @MaxLength(10)
  postalCode!: string;

  @ApiProperty({ default: 'India' })
  @IsString()
  country!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
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
        updatedAt: true,
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone,
        avatar: dto.avatar,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatar: true,
        role: true,
      },
    });
  }

  async getAddresses(userId: string) {
    return this.prisma.userAddress.findMany({
      where: { userId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'asc' }],
    });
  }

  async addAddress(userId: string, dto: CreateAddressDto) {
    if (dto.isDefault) {
      // Unset existing default
      await this.prisma.userAddress.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    const count = await this.prisma.userAddress.count({ where: { userId } });
    const isFirstAddress = count === 0;

    return this.prisma.userAddress.create({
      data: {
        userId,
        label: dto.label,
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone,
        addressLine1: dto.addressLine1,
        addressLine2: dto.addressLine2,
        city: dto.city,
        state: dto.state,
        postalCode: dto.postalCode,
        country: dto.country,
        isDefault: dto.isDefault ?? isFirstAddress,
      },
    });
  }

  async updateAddress(userId: string, addressId: string, dto: Partial<CreateAddressDto>) {
    const address = await this.prisma.userAddress.findFirst({
      where: { id: addressId, userId },
    });
    if (!address) throw new NotFoundException('Address not found');

    if (dto.isDefault) {
      await this.prisma.userAddress.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    return this.prisma.userAddress.update({
      where: { id: addressId },
      data: dto,
    });
  }

  async deleteAddress(userId: string, addressId: string) {
    const address = await this.prisma.userAddress.findFirst({
      where: { id: addressId, userId },
    });
    if (!address) throw new NotFoundException('Address not found');

    await this.prisma.userAddress.delete({ where: { id: addressId } });
    return { message: 'Address deleted successfully' };
  }

  // Admin: list all users with pagination
  async findAll(page = 1, limit = 20, search?: string) {
    const skip = (page - 1) * limit;
    const where = search
      ? {
          OR: [
            { email: { contains: search, mode: 'insensitive' as const } },
            { firstName: { contains: search, mode: 'insensitive' as const } },
            { lastName: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          isActive: true,
          createdAt: true,
          lastLoginAt: true,
          _count: { select: { orders: true } },
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return { users, total, page, limit, pages: Math.ceil(total / limit) };
  }

  async setActive(userId: string, isActive: boolean) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { isActive },
      select: { id: true, email: true, isActive: true },
    });
  }
}
