import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { ElasticsearchService } from '../elasticsearch/elasticsearch.service';
import { RedisService } from '../redis/redis.service';
import { SearchDiamondsDto, DiamondSortBy } from './dto/search-diamonds.dto';
import { Prisma } from '@prisma/client';

const CACHE_TTL = 300; // 5 minutes
const RESERVATION_TTL = 1800; // 30 minutes
const VIEW_SYNC_INTERVAL = 60; // 1 minute

// Diamond color order (best to worst)
const COLOR_ORDER = ['D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M'];
// Clarity order (best to worst)
const CLARITY_ORDER = ['FL', 'IF', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1', 'SI2', 'I1', 'I2'];

function buildElasticsearchQuery(dto: SearchDiamondsDto) {
  const must: object[] = [];
  const filter: object[] = [{ term: { isAvailable: true } }];

  if (dto.q) {
    must.push({
      multi_match: {
        query: dto.q,
        fields: ['stockId^3', 'certificateNumber^2', 'shape'],
        type: 'best_fields',
        fuzziness: 'AUTO',
      },
    });
  }

  if (dto.shapes?.length) {
    filter.push({ terms: { shape: dto.shapes } });
  }

  if (dto.minPrice !== undefined || dto.maxPrice !== undefined) {
    const range: Record<string, number> = {};
    if (dto.minPrice !== undefined) range['gte'] = dto.minPrice;
    if (dto.maxPrice !== undefined) range['lte'] = dto.maxPrice;
    filter.push({ range: { priceInr: range } });
  }

  if (dto.minCarat !== undefined || dto.maxCarat !== undefined) {
    const range: Record<string, number> = {};
    if (dto.minCarat !== undefined) range['gte'] = dto.minCarat;
    if (dto.maxCarat !== undefined) range['lte'] = dto.maxCarat;
    filter.push({ range: { caratWeight: range } });
  }

  if (dto.colorFrom || dto.colorTo) {
    const fromIdx = dto.colorFrom ? COLOR_ORDER.indexOf(dto.colorFrom) : 0;
    const toIdx = dto.colorTo ? COLOR_ORDER.indexOf(dto.colorTo) : COLOR_ORDER.length - 1;
    const validColors = COLOR_ORDER.slice(Math.min(fromIdx, toIdx), Math.max(fromIdx, toIdx) + 1);
    if (validColors.length) filter.push({ terms: { color: validColors } });
  }

  if (dto.clarityFrom || dto.clarityTo) {
    const fromIdx = dto.clarityFrom ? CLARITY_ORDER.indexOf(dto.clarityFrom) : 0;
    const toIdx = dto.clarityTo ? CLARITY_ORDER.indexOf(dto.clarityTo) : CLARITY_ORDER.length - 1;
    const validClarities = CLARITY_ORDER.slice(
      Math.min(fromIdx, toIdx),
      Math.max(fromIdx, toIdx) + 1
    );
    if (validClarities.length) filter.push({ terms: { clarity: validClarities } });
  }

  if (dto.cuts?.length) {
    filter.push({ terms: { cut: dto.cuts } });
  }

  if (dto.labs?.length) {
    filter.push({ terms: { certificateLab: dto.labs } });
  }

  if (dto.fluorescence?.length) {
    filter.push({ terms: { fluorescence: dto.fluorescence } });
  }

  if (dto.isLabGrown !== undefined) {
    filter.push({ term: { isLabGrown: dto.isLabGrown } });
  }

  if (dto.eyeClean === true) {
    filter.push({ term: { eyeClean: true } });
  }

  return {
    bool: {
      must: must.length ? must : [{ match_all: {} }],
      filter,
    },
  };
}

function buildSort(sort: DiamondSortBy): object[] {
  switch (sort) {
    case DiamondSortBy.PRICE_ASC:
      return [{ priceInr: { order: 'asc' } }];
    case DiamondSortBy.PRICE_DESC:
      return [{ priceInr: { order: 'desc' } }];
    case DiamondSortBy.CARAT_ASC:
      return [{ caratWeight: { order: 'asc' } }];
    case DiamondSortBy.CARAT_DESC:
      return [{ caratWeight: { order: 'desc' } }];
    case DiamondSortBy.CUT_BEST:
      return [{ cutScore: { order: 'desc' } }, { priceInr: { order: 'asc' } }];
    case DiamondSortBy.NEWEST:
      return [{ createdAt: { order: 'desc' } }];
    case DiamondSortBy.POPULARITY:
      return [{ viewCount: { order: 'desc' } }];
    default:
      return [{ priceInr: { order: 'asc' } }];
  }
}

@Injectable()
export class DiamondsService {
  private readonly logger = new Logger(DiamondsService.name);

  constructor(
    private prisma: PrismaService,
    private elasticsearch: ElasticsearchService,
    private redis: RedisService
  ) {}

  async search(dto: SearchDiamondsDto) {
    const page = dto.page ?? 1;
    const limit = dto.limit ?? 24;
    const from = (page - 1) * limit;

    const cacheKey = `diamond_search:${JSON.stringify(dto)}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) return cached;

    try {
      const esQuery = buildElasticsearchQuery(dto);
      const esSort = buildSort(dto.sort ?? DiamondSortBy.PRICE_ASC);

      const esResult = await this.elasticsearch.search('diamonds', {
        query: esQuery,
        sort: esSort,
        from,
        size: limit,
        aggs: {
          shapes: { terms: { field: 'shape', size: 20 } },
          labs: { terms: { field: 'certificateLab', size: 10 } },
          cuts: { terms: { field: 'cut', size: 10 } },
          fluorescence: { terms: { field: 'fluorescence', size: 10 } },
          colors: { terms: { field: 'color', size: 15 } },
          clarities: { terms: { field: 'clarity', size: 15 } },
          price_stats: { stats: { field: 'priceInr' } },
          carat_stats: { stats: { field: 'caratWeight' } },
          lab_grown: { terms: { field: 'isLabGrown', size: 2 } },
        },
        _source: true,
      });

      const result = {
        diamonds: esResult.hits.map((h: { _source: unknown }) => h._source),
        total: esResult.total,
        page,
        limit,
        pages: Math.ceil(esResult.total / limit),
        aggregations: esResult.aggregations,
      };

      await this.redis.setEx(cacheKey, CACHE_TTL, result);
      return result;
    } catch (error) {
      this.logger.warn('Elasticsearch unavailable, falling back to Prisma', error);
      return this.searchPrisma(dto);
    }
  }

  private async searchPrisma(dto: SearchDiamondsDto) {
    const page = dto.page ?? 1;
    const limit = dto.limit ?? 24;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = { isAvailable: true };

    if (dto.shapes?.length) where['shape'] = { in: dto.shapes };
    if (dto.minPrice !== undefined || dto.maxPrice !== undefined) {
      where['priceInr'] = {};
      if (dto.minPrice !== undefined)
        (where['priceInr'] as Record<string, number>)['gte'] = dto.minPrice;
      if (dto.maxPrice !== undefined)
        (where['priceInr'] as Record<string, number>)['lte'] = dto.maxPrice;
    }
    if (dto.minCarat !== undefined || dto.maxCarat !== undefined) {
      where['caratWeight'] = {};
      if (dto.minCarat !== undefined)
        (where['caratWeight'] as Record<string, number>)['gte'] = dto.minCarat;
      if (dto.maxCarat !== undefined)
        (where['caratWeight'] as Record<string, number>)['lte'] = dto.maxCarat;
    }
    if (dto.cuts?.length) where['cut'] = { in: dto.cuts };
    if (dto.labs?.length) where['certificateLab'] = { in: dto.labs };
    if (dto.fluorescence?.length) where['fluorescence'] = { in: dto.fluorescence };
    if (dto.isLabGrown !== undefined) where['isLabGrown'] = dto.isLabGrown;
    if (dto.eyeClean === true) where['eyeClean'] = true;

    let orderBy: Record<string, string> = { priceInr: 'asc' };
    switch (dto.sort) {
      case DiamondSortBy.PRICE_DESC:
        orderBy = { priceInr: 'desc' };
        break;
      case DiamondSortBy.CARAT_ASC:
        orderBy = { caratWeight: 'asc' };
        break;
      case DiamondSortBy.CARAT_DESC:
        orderBy = { caratWeight: 'desc' };
        break;
      case DiamondSortBy.NEWEST:
        orderBy = { createdAt: 'desc' };
        break;
    }

    const [diamonds, total] = await Promise.all([
      this.prisma.diamond.findMany({
        where: where as Prisma.DiamondWhereInput,
        skip,
        take: limit,
        orderBy,
        include: { images: { take: 1, orderBy: { sortOrder: 'asc' } } },
      }),
      this.prisma.diamond.count({ where: where as Prisma.DiamondWhereInput }),
    ]);

    return {
      diamonds,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
      aggregations: {},
    };
  }

  async findById(id: string, incrementView = true) {
    const cacheKey = `diamond:${id}`;
    const cached = await this.redis.get(cacheKey);

    let diamond = cached;

    if (!diamond) {
      const dbDiamond = await this.prisma.diamond.findUnique({
        where: { id },
        include: {
          images: { orderBy: { sortOrder: 'asc' } },
          supplier: { select: { name: true } },
          inventory: { select: { quantity: true, reserved: true } },
        },
      });

      if (!dbDiamond) throw new NotFoundException('Diamond not found');

      await this.redis.setEx(cacheKey, CACHE_TTL, dbDiamond);
      diamond = dbDiamond;
    }

    if (incrementView) {
      // Increment view count in Redis, sync to DB periodically
      const viewKey = `diamond_views:${id}`;
      const views = await this.redis.incr(viewKey);
      if (views % VIEW_SYNC_INTERVAL === 0) {
        // Sync to DB (fire and forget)
        this.prisma.diamond
          .update({ where: { id }, data: { viewCount: { increment: VIEW_SYNC_INTERVAL } } })
          .catch((e: Error) => this.logger.error('Failed to sync view count', e));
      }
    }

    return diamond;
  }

  async findByStockId(stockId: string) {
    const diamond = await this.prisma.diamond.findUnique({
      where: { stockId },
      include: { images: { orderBy: { sortOrder: 'asc' } } },
    });
    if (!diamond) throw new NotFoundException('Diamond not found');
    return diamond;
  }

  async compareDiamonds(ids: string[]) {
    if (ids.length < 2 || ids.length > 4) {
      throw new BadRequestException('Please provide 2 to 4 diamond IDs for comparison');
    }

    const diamonds = await Promise.all(ids.map((id) => this.findById(id, false)));
    return { diamonds };
  }

  async getFeatured(limit = 6) {
    const cacheKey = `diamonds:featured:${limit}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) return cached;

    const diamonds = await this.prisma.diamond.findMany({
      where: { isAvailable: true, isFeatured: true },
      take: limit,
      orderBy: { viewCount: 'desc' },
      include: { images: { take: 1, orderBy: { sortOrder: 'asc' } } },
    });

    await this.redis.setEx(cacheKey, CACHE_TTL * 2, diamonds);
    return diamonds;
  }

  async getRelated(id: string, limit = 4) {
    const diamond = await this.prisma.diamond.findUnique({
      where: { id },
      select: { shape: true, caratWeight: true, priceInr: true },
    });
    if (!diamond) return [];

    return this.prisma.diamond.findMany({
      where: {
        id: { not: id },
        shape: diamond.shape,
        isAvailable: true,
        caratWeight: {
          gte: diamond.caratWeight * 0.8,
          lte: diamond.caratWeight * 1.2,
        },
      },
      take: limit,
      orderBy: { viewCount: 'desc' },
      include: { images: { take: 1, orderBy: { sortOrder: 'asc' } } },
    });
  }

  async reserveDiamond(diamondId: string, userId: string): Promise<boolean> {
    const reserveKey = `reserve:diamond:${diamondId}`;
    const reserved = await this.redis.setNx(reserveKey, userId);

    if (reserved) {
      await this.redis.expire(reserveKey, RESERVATION_TTL);

      // Mark as reserved in DB
      await this.prisma.diamond.update({
        where: { id: diamondId },
        data: { isReserved: true },
      });

      this.logger.log(`Diamond ${diamondId} reserved by user ${userId}`);
    }

    return reserved;
  }

  async releaseReservation(diamondId: string): Promise<void> {
    const reserveKey = `reserve:diamond:${diamondId}`;
    await this.redis.del(reserveKey);
    await this.prisma.diamond
      .update({
        where: { id: diamondId },
        data: { isReserved: false },
      })
      .catch(() => null);
  }

  async indexToElasticsearch(diamondId: string): Promise<void> {
    const diamond = await this.prisma.diamond.findUnique({
      where: { id: diamondId },
      include: { images: { take: 1, orderBy: { sortOrder: 'asc' } } },
    });
    if (!diamond) return;

    await this.elasticsearch.index('diamonds', diamond.id, {
      ...diamond,
      priceInr: Number(diamond.priceInr),
    });
  }

  async syncAllToElasticsearch(): Promise<{ indexed: number }> {
    const diamonds = await this.prisma.diamond.findMany({
      include: { images: { take: 1, orderBy: { sortOrder: 'asc' } } },
    });

    const body = diamonds.flatMap((d) => [
      { index: { _index: 'diamonds', _id: d.id } },
      { ...d, priceInr: Number(d.priceInr) },
    ]);

    if (body.length) {
      await this.elasticsearch.bulk(body);
    }

    return { indexed: diamonds.length };
  }

  async toggleAvailability(id: string, isAvailable: boolean) {
    const diamond = await this.prisma.diamond.update({
      where: { id },
      data: { isAvailable },
      select: { id: true, stockId: true, isAvailable: true },
    });

    // Invalidate cache
    await this.redis.del(`diamond:${id}`);

    // Update ES
    await this.elasticsearch.index('diamonds', id, { isAvailable }).catch(() => null);

    return diamond;
  }
}
