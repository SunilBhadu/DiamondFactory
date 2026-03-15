import { IsEmail, IsString, MinLength, MaxLength, IsOptional, Matches } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'priya@example.com' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @Transform(({ value }) => (typeof value === 'string' ? value.toLowerCase().trim() : value))
  email!: string;

  @ApiProperty({ example: 'SecurePass@123', minLength: 8 })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @MaxLength(72, { message: 'Password must not exceed 72 characters' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, and one number',
  })
  password!: string;

  @ApiProperty({ example: 'Priya' })
  @IsString()
  @MinLength(2, { message: 'First name must be at least 2 characters' })
  @MaxLength(50)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  firstName!: string;

  @ApiProperty({ example: 'Sharma' })
  @IsString()
  @MinLength(2, { message: 'Last name must be at least 2 characters' })
  @MaxLength(50)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  lastName!: string;

  @ApiPropertyOptional({ example: '+91 98765 43210' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;
}
