import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PrismaService } from '../database/prisma.service';
import { RedisService } from '../redis/redis.service';
import { ElasticsearchService } from '../elasticsearch/elasticsearch.service';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly elasticsearch: ElasticsearchService
  ) {}

  @Get()
  @ApiOperation({ summary: 'Basic liveness probe' })
  liveness() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }

  @Get('ready')
  @ApiOperation({ summary: 'Readiness probe — checks all dependencies' })
  async readiness() {
    const checks: Record<string, 'ok' | 'error'> = {};

    // PostgreSQL
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      checks['postgres'] = 'ok';
    } catch {
      checks['postgres'] = 'error';
    }

    // Redis
    try {
      await this.redis.set('health:ping', 'pong');
      checks['redis'] = 'ok';
    } catch {
      checks['redis'] = 'error';
    }

    // Elasticsearch
    try {
      await this.elasticsearch.ping();
      checks['elasticsearch'] = 'ok';
    } catch {
      checks['elasticsearch'] = 'error';
    }

    const allOk = Object.values(checks).every((v) => v === 'ok');

    return {
      status: allOk ? 'ok' : 'degraded',
      checks,
      timestamp: new Date().toISOString(),
    };
  }
}
