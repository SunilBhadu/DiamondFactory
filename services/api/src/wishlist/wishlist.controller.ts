import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { WishlistService, WishlistItemType } from './wishlist.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser, JwtPayload } from '../auth/decorators/current-user.decorator';

class AddWishlistItemDto {
  @ApiProperty({ enum: ['diamond', 'ring_setting', 'jewelry'] })
  @IsEnum(['diamond', 'ring_setting', 'jewelry'])
  itemType!: WishlistItemType;

  @ApiProperty()
  @IsString()
  itemId!: string;
}

@ApiTags('Wishlist')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get()
  @ApiOperation({ summary: 'Get current user wishlist' })
  getWishlist(@CurrentUser() user: JwtPayload) {
    return this.wishlistService.getWishlist(user.sub);
  }

  @Post('items')
  @ApiOperation({ summary: 'Add item to wishlist' })
  addItem(@CurrentUser() user: JwtPayload, @Body() dto: AddWishlistItemDto) {
    return this.wishlistService.addItem(user.sub, dto.itemType, dto.itemId);
  }

  @Post('items/toggle')
  @ApiOperation({ summary: 'Toggle item in wishlist (add if absent, remove if present)' })
  toggleItem(@CurrentUser() user: JwtPayload, @Body() dto: AddWishlistItemDto) {
    return this.wishlistService.toggleItem(user.sub, dto.itemType, dto.itemId);
  }

  @Delete('items/:itemId')
  @ApiOperation({ summary: 'Remove item from wishlist' })
  removeItem(@CurrentUser() user: JwtPayload, @Param('itemId') itemId: string) {
    return this.wishlistService.removeItem(user.sub, itemId);
  }

  @Get('check')
  @ApiOperation({ summary: 'Check if an item is in the wishlist' })
  @ApiQuery({ name: 'itemType', enum: ['diamond', 'ring_setting', 'jewelry'] })
  @ApiQuery({ name: 'itemId', type: String })
  isInWishlist(
    @CurrentUser() user: JwtPayload,
    @Query('itemType') itemType: WishlistItemType,
    @Query('itemId') itemId: string
  ) {
    return this.wishlistService.isInWishlist(user.sub, itemType, itemId);
  }

  @Post('share')
  @ApiOperation({ summary: 'Generate a public share link for the wishlist' })
  shareWishlist(@CurrentUser() user: JwtPayload) {
    return this.wishlistService.shareWishlist(user.sub);
  }
}

// ── Public endpoint (no auth guard) ──────────────────────────────────────────
@ApiTags('Wishlist')
@Controller('wishlist/shared')
export class WishlistPublicController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get(':shareToken')
  @ApiOperation({ summary: 'View a shared wishlist by token (public)' })
  getShared(@Param('shareToken') shareToken: string) {
    return this.wishlistService.getSharedWishlist(shareToken);
  }
}
