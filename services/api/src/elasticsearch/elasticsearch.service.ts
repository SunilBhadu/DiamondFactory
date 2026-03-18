import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from '@elastic/elasticsearch';

const DIAMOND_INDEX = 'diamonds';

const DIAMOND_MAPPINGS = {
  properties: {
    id: { type: 'keyword' },
    sku: { type: 'keyword' },
    stockId: { type: 'keyword' },
    shape: { type: 'keyword' },
    caratWeight: { type: 'float' },
    color: { type: 'keyword' },
    clarity: { type: 'keyword' },
    cut: { type: 'keyword' },
    polish: { type: 'keyword' },
    symmetry: { type: 'keyword' },
    fluorescence: { type: 'keyword' },
    certificateLab: { type: 'keyword' },
    certificateNo: { type: 'keyword' },
    depthPct: { type: 'float' },
    tablePct: { type: 'float' },
    lwRatio: { type: 'float' },
    eyeClean: { type: 'boolean' },
    isLabGrown: { type: 'boolean' },
    priceInr: { type: 'float' },
    currency: { type: 'keyword' },
    isAvailable: { type: 'boolean' },
    isReserved: { type: 'boolean' },
    isFeatured: { type: 'boolean' },
    isSold: { type: 'boolean' },
    cutScore: { type: 'float' },
    inWishlistCount: { type: 'integer' },
    viewCount: { type: 'integer' },
    createdAt: { type: 'date' },
    updatedAt: { type: 'date' },
  },
};

@Injectable()
export class ElasticsearchService implements OnModuleInit {
  private readonly logger = new Logger(ElasticsearchService.name);
  private client!: Client;

  constructor(private configService: ConfigService) {}

  async onModuleInit(): Promise<void> {
    const esUrl = this.configService.get<string>('elasticsearch.url', 'http://localhost:9200');
    const username = this.configService.get<string>('elasticsearch.username');
    const password = this.configService.get<string>('elasticsearch.password');

    const clientConfig: ConstructorParameters<typeof Client>[0] = {
      node: esUrl,
    };

    if (username && password && username !== 'elastic') {
      clientConfig.auth = { username, password };
    }

    this.client = new Client(clientConfig);

    try {
      const info = await this.client.info();
      this.logger.log(`Elasticsearch connected — version ${info.version.number}`);

      // Ensure diamond index exists
      await this.ensureIndex(DIAMOND_INDEX, DIAMOND_MAPPINGS);
    } catch (error) {
      this.logger.warn(
        `Elasticsearch connection failed (non-critical): ${(error as Error).message}`
      );
    }
  }

  async ensureIndex(indexName: string, mappings: Record<string, unknown>): Promise<void> {
    try {
      const exists = await this.client.indices.exists({ index: indexName });
      if (!exists) {
        await this.client.indices.create({
          index: indexName,
          body: {
            settings: {
              number_of_shards: 1,
              number_of_replicas: 0,
              analysis: {
                analyzer: {
                  diamond_analyzer: {
                    type: 'custom',
                    tokenizer: 'standard',
                    filter: ['lowercase', 'trim'],
                  },
                },
              },
            },
            mappings,
          },
        });
        this.logger.log(`Index "${indexName}" created`);
      }
    } catch (error) {
      this.logger.warn(`Failed to ensure index "${indexName}": ${(error as Error).message}`);
    }
  }

  async index(indexName: string, id: string, document: Record<string, unknown>): Promise<void> {
    await this.client.index({
      index: indexName,
      id,
      document,
    });
  }

  async search<T = unknown>(
    indexName: string,
    query: Record<string, unknown>
  ): Promise<{
    hits: Array<{ _id: string; _source: T }>;
    total: number;
    aggregations?: Record<string, unknown>;
  }> {
    try {
      const response = await this.client.search({
        index: indexName,
        ...query,
      } as Parameters<typeof this.client.search>[0]);

      const hits = (response.hits.hits as Array<{ _id: string; _source: T }>).map((hit) => ({
        _id: hit._id,
        _source: hit._source,
      }));

      const total =
        typeof response.hits.total === 'number'
          ? response.hits.total
          : (response.hits.total as { value: number })?.value || 0;

      return {
        hits,
        total,
        aggregations: response.aggregations as Record<string, unknown>,
      };
    } catch (error) {
      this.logger.error('Elasticsearch search failed', error);
      throw error;
    }
  }

  async delete(indexName: string, id: string): Promise<void> {
    try {
      await this.client.delete({ index: indexName, id });
    } catch (error) {
      this.logger.warn(`Failed to delete document ${id} from ${indexName}`);
    }
  }

  async bulk(
    operations: Array<Record<string, unknown>>
  ): Promise<{ errors: boolean; items: unknown[] }> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await (this.client.bulk as any)({ operations });
    return { errors: response.errors, items: response.items };
  }

  async count(indexName: string, query?: Record<string, unknown>): Promise<number> {
    const response = await this.client.count({
      index: indexName,
      ...(query ? { query } : {}),
    } as Parameters<typeof this.client.count>[0]);
    return response.count;
  }

  async ping(): Promise<boolean> {
    try {
      await this.client.ping();
      return true;
    } catch {
      return false;
    }
  }

  getDiamondIndex(): string {
    return DIAMOND_INDEX;
  }
}
