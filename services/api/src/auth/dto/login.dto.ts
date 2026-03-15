import { IsEmail, IsString, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'priya@example.com' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @Transform(({ value }) => (typeof value === 'string' ? value.toLowerCase().trim() : value))
  email!: string;

  @ApiProperty({ example: 'SecurePass@123' })
  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  password!: string;
}
