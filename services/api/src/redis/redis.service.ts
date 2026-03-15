import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client!: Redis;

  constructor(private configService: ConfigService) {}

  async onModuleInit(): Promise<void> {
    const redisUrl = this.configService.get<string>('redis.url', 'redis://localhost:6379');

    this.client = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      lazyConnect: true,
      enableReadyCheck: true,
    });

    this.client.on('connect', () => {
      this.logger.log('Redis connected');
    });

    this.client.on('error', (err) => {
      this.logger.error('Redis error', err.message);
    });

    this.client.on('reconnecting', () => {
      this.logger.warn('Redis reconnecting...');
    });

    try {
      await this.client.connect();
    } catch (error) {
      this.logger.error('Failed to connect to Redis', error);
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.client.quit();
    this.logger.log('Redis disconnected');
  }

  // ─── Basic Operations ─────────────────────────────────────────────────────

  async get<T>(key: string): Promise<T | null> {
    const value = await this.client.get(key);
    if (value === null) return null;
    try {
      return JSON.parse(value) as T;
    } catch {
      return value as unknown as T;
    }
  }

  async set(key: string, value: unknown): Promise<void> {
    const serialized = typeof value === 'string' ? value : JSON.stringify(value);
    await this.client.set(key, serialized);
  }

  async setEx(key: string, ttlSeconds: number, value: unknown): Promise<void> {
    const serialized = typeof value === 'string' ? value : JSON.stringify(value);
    await this.client.setex(key, ttlSeconds, serialized);
  }

  async del(key: string | string[]): Promise<number> {
    if (Array.isArray(key)) {
      return this.client.del(...key);
    }
    return this.client.del(key);
  }

  async exists(key: string): Promise<boolean> {
    const result = await this.client.exists(key);
    return result > 0;
  }

  async incr(key: string): Promise<number> {
    return this.client.incr(key);
  }

  async expire(key: string, ttlSeconds: number): Promise<void> {
    await this.client.expire(key, ttlSeconds);
  }

  async ttl(key: string): Promise<number> {
    return this.client.ttl(key);
  }

  async keys(pattern: string): Promise<string[]> {
    return this.client.keys(pattern);
  }

  // ─── Hash Operations ──────────────────────────────────────────────────────

  async hget(key: string, field: string): Promise<string | null> {
    return this.client.hget(key, field);
  }

  async hset(key: string, field: string, value: string): Promise<void> {
    await this.client.hset(key, field, value);
  }

  async hdel(key: string, ...fields: string[]): Promise<number> {
    return this.client.hdel(key, ...fields);
  }

  async hgetall(key: string): Promise<Record<string, string>> {
    return this.client.hgetall(key);
  }

  async hmset(key: string, data: Record<string, string>): Promise<void> {
    await this.client.hmset(key, data);
  }

  // ─── List Operations ──────────────────────────────────────────────────────

  async lpush(key: string, ...values: string[]): Promise<number> {
    return this.client.lpush(key, ...values);
  }

  async lrange(key: string, start: number, stop: number): Promise<string[]> {
    return this.client.lrange(key, start, stop);
  }

  // ─── Set Operations ───────────────────────────────────────────────────────

  async sadd(key: string, ...members: string[]): Promise<number> {
    return this.client.sadd(key, ...members);
  }

  async sismember(key: string, member: string): Promise<boolean> {
    const result = await this.client.sismember(key, member);
    return result === 1;
  }

  async srem(key: string, ...members: string[]): Promise<number> {
    return this.client.srem(key, ...members);
  }

  // ─── SetNX (for locks/reservations) ──────────────────────────────────────

  async setNx(key: string, value: string, ttlSeconds?: number): Promise<boolean> {
    let result: string | null;
    if (ttlSeconds) {
      result = await this.client.set(key, value, 'EX', ttlSeconds, 'NX');
    } else {
      result = await this.client.set(key, value, 'NX');
    }
    return result === 'OK';
  }

  // ─── Health Check ─────────────────────────────────────────────────────────

  async ping(): Promise<boolean> {
    try {
      const result = await this.client.ping();
      return result === 'PONG';
    } catch {
      return false;
    }
  }

  getClient(): Redis {
    return this.client;
  }
}
