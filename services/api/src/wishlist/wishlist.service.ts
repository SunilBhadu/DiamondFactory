import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { randomBytes } from 'crypto';

export type WishlistItemType = 'diamond' | 'ring_setting' | 'jewelry';

@Injectable()
export class WishlistService {
  constructor(private readonly prisma: PrismaService) {}

  private async getOrCreateWishlist(userId: string) {
    let wishlist = await this.prisma.wishlist.findFirst({
      where: { userId },
    });
    if (!wishlist) {
      wishlist = await this.prisma.wishlist.create({
        data: { userId, name: 'My Wishlist' },
      });
    }
    return wishlist;
  }

  async getWishlist(userId: string) {
    const wishlist = await this.getOrCreateWishlist(userId);

    const items = await this.prisma.wishlistItem.findMany({
      where: { wishlistId: wishlist.id },
      include: {
        diamond: {
          select: {
            id: true,
            stockId: true,
            shape: true,
            caratWeight: true,
            color: true,
            clarity: true,
            cut: true,
            priceInr: true,
            isAvailable: true,
            isLabGrown: true,
            certificateLab: true,
          },
        },
        setting: {
          select: {
            id: true,
            name: true,
            slug: true,
            style: true,
            basePrice: true,
            isAvailable: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return { ...wishlist, items, itemCount: items.length };
  }

  async addItem(userId: string, itemType: WishlistItemType, itemId: string) {
    const wishlist = await this.getOrCreateWishlist(userId);

    // Validate item exists
    if (itemType === 'diamond') {
      const exists = await this.prisma.diamond.findUnique({
        where: { id: itemId },
        select: { id: true },
      });
      if (!exists) throw new NotFoundException('Diamond not found');
    } else if (itemType === 'ring_setting') {
      const exists = await this.prisma.ringSetting.findUnique({
        where: { id: itemId },
        select: { id: true },
      });
      if (!exists) throw new NotFoundException('Ring setting not found');
    }

    // Check if already in wishlist
    const existing = await this.prisma.wishlistItem.findFirst({
      where: {
        wishlistId: wishlist.id,
        ...(itemType === 'diamond' ? { diamondId: itemId } : { settingId: itemId }),
      },
    });
    if (existing) return this.getWishlist(userId); // idempotent

    await this.prisma.wishlistItem.create({
      data: {
        wishlistId: wishlist.id,
        itemType,
        ...(itemType === 'diamond' ? { diamondId: itemId } : { settingId: itemId }),
      },
    });

    // Increment inWishlistCount on diamond
    if (itemType === 'diamond') {
      await this.prisma.diamond.update({
        where: { id: itemId },
        data: { inWishlistCount: { increment: 1 } },
      });
    }

    return this.getWishlist(userId);
  }

  async removeItem(userId: string, wishlistItemId: string) {
    const wishlist = await this.getOrCreateWishlist(userId);

    const item = await this.prisma.wishlistItem.findUnique({
      where: { id: wishlistItemId },
    });
    if (!item || item.wishlistId !== wishlist.id) {
      throw new NotFoundException('Wishlist item not found');
    }

    await this.prisma.wishlistItem.delete({ where: { id: wishlistItemId } });

    if (item.diamondId) {
      await this.prisma.diamond.update({
        where: { id: item.diamondId },
        data: { inWishlistCount: { decrement: 1 } },
      });
    }

    return this.getWishlist(userId);
  }

  async toggleItem(userId: string, itemType: WishlistItemType, itemId: string) {
    const inList = await this.isInWishlist(userId, itemType, itemId);
    if (inList.inWishlist && inList.wishlistItemId) {
      return this.removeItem(userId, inList.wishlistItemId);
    }
    return this.addItem(userId, itemType, itemId);
  }

  async isInWishlist(
    userId: string,
    itemType: WishlistItemType,
    itemId: string
  ): Promise<{ inWishlist: boolean; wishlistItemId?: string }> {
    const wishlist = await this.prisma.wishlist.findFirst({ where: { userId } });
    if (!wishlist) return { inWishlist: false };

    const item = await this.prisma.wishlistItem.findFirst({
      where: {
        wishlistId: wishlist.id,
        ...(itemType === 'diamond' ? { diamondId: itemId } : { settingId: itemId }),
      },
      select: { id: true },
    });

    return { inWishlist: !!item, wishlistItemId: item?.id };
  }

  async shareWishlist(userId: string): Promise<{ shareToken: string; shareUrl: string }> {
    const wishlist = await this.getOrCreateWishlist(userId);

    let { shareToken } = wishlist;
    if (!shareToken) {
      shareToken = randomBytes(16).toString('hex');
      await this.prisma.wishlist.update({
        where: { id: wishlist.id },
        data: { shareToken, isPublic: true },
      });
    }

    return {
      shareToken,
      shareUrl: `${process.env.APP_URL}/wishlist/shared/${shareToken}`,
    };
  }

  async getSharedWishlist(shareToken: string) {
    const wishlist = await this.prisma.wishlist.findUnique({
      where: { shareToken },
      include: {
        items: {
          include: {
            diamond: {
              select: {
                id: true,
                stockId: true,
                shape: true,
                caratWeight: true,
                color: true,
                clarity: true,
                cut: true,
                priceInr: true,
                isAvailable: true,
                isLabGrown: true,
                certificateLab: true,
              },
            },
            setting: {
              select: {
                id: true,
                name: true,
                slug: true,
                style: true,
                basePrice: true,
                isAvailable: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!wishlist || !wishlist.isPublic) {
      throw new NotFoundException('Shared wishlist not found or is private');
    }

    return wishlist;
  }
}
