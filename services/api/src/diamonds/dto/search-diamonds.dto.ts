import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsNumber,
  IsString,
  IsBoolean,
  IsArray,
  IsEnum,
  Min,
  Max,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export enum DiamondSortBy {
  PRICE_ASC = 'price_asc',
  PRICE_DESC = 'price_desc',
  CARAT_ASC = 'carat_asc',
  CARAT_DESC = 'carat_desc',
  CUT_BEST = 'cut_best',
  NEWEST = 'newest',
  POPULARITY = 'popularity',
}

export class SearchDiamondsDto {
  @ApiPropertyOptional({ description: 'Page number', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Items per page', default: 24 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 24;

  @ApiPropertyOptional({ enum: DiamondSortBy })
  @IsOptional()
  @IsEnum(DiamondSortBy)
  sort?: DiamondSortBy = DiamondSortBy.PRICE_ASC;

  // Shape filter
  @ApiPropertyOptional({
    description: 'Diamond shapes',
    example: 'ROUND,PRINCESS',
  })
  @IsOptional()
  @Transform(({ value }: { value: string }) =>
    typeof value === 'string' ? value.split(',').map((s: string) => s.trim()) : value
  )
  @IsArray()
  shapes?: string[];

  // Price range
  @ApiPropertyOptional({ description: 'Minimum price in INR' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @ApiPropertyOptional({ description: 'Maximum price in INR' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxPrice?: number;

  // Carat range
  @ApiPropertyOptional({ description: 'Minimum carat weight' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0.01)
  minCarat?: number;

  @ApiPropertyOptional({ description: 'Maximum carat weight' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxCarat?: number;

  // Color range (D=best, M=worst)
  @ApiPropertyOptional({ description: 'Best color grade (D is best)', example: 'D' })
  @IsOptional()
  @IsString()
  colorFrom?: string;

  @ApiPropertyOptional({ description: 'Worst acceptable color grade', example: 'J' })
  @IsOptional()
  @IsString()
  colorTo?: string;

  // Clarity range
  @ApiPropertyOptional({ description: 'Best clarity grade (FL is best)', example: 'FL' })
  @IsOptional()
  @IsString()
  clarityFrom?: string;

  @ApiPropertyOptional({ description: 'Worst acceptable clarity grade', example: 'SI2' })
  @IsOptional()
  @IsString()
  clarityTo?: string;

  // Cut grades
  @ApiPropertyOptional({ description: 'Cut grades', example: 'IDEAL,EXCELLENT' })
  @IsOptional()
  @Transform(({ value }: { value: string }) =>
    typeof value === 'string' ? value.split(',').map((s: string) => s.trim()) : value
  )
  @IsArray()
  cuts?: string[];

  // Certificate labs
  @ApiPropertyOptional({ description: 'Certificate labs', example: 'GIA,IGI' })
  @IsOptional()
  @Transform(({ value }: { value: string }) =>
    typeof value === 'string' ? value.split(',').map((s: string) => s.trim()) : value
  )
  @IsArray()
  labs?: string[];

  // Fluorescence
  @ApiPropertyOptional({ description: 'Fluorescence grades', example: 'NONE,FAINT' })
  @IsOptional()
  @Transform(({ value }: { value: string }) =>
    typeof value === 'string' ? value.split(',').map((s: string) => s.trim()) : value
  )
  @IsArray()
  fluorescence?: string[];

  // Lab grown filter
  @ApiPropertyOptional({ description: 'Filter by lab grown status' })
  @IsOptional()
  @Transform(({ value }: { value: unknown }) => value === 'true' || value === true)
  @IsBoolean()
  isLabGrown?: boolean;

  // Eye clean
  @ApiPropertyOptional({ description: 'Only show eye-clean diamonds' })
  @IsOptional()
  @Transform(({ value }: { value: unknown }) => value === 'true' || value === true)
  @IsBoolean()
  eyeClean?: boolean;

  // Full text search
  @ApiPropertyOptional({ description: 'Search by certificate number or stock ID' })
  @IsOptional()
  @IsString()
  q?: string;
}
