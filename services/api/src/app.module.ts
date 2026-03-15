import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import configuration from './config/configuration';
import { DatabaseModule } from './database/database.module';
import { RedisModule } from './redis/redis.module';
import { ElasticsearchModule } from './elasticsearch/elasticsearch.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DiamondsModule } from './diamonds/diamonds.module';
import { OrdersModule } from './orders/orders.module';
import { PaymentsModule } from './payments/payments.module';
import { CartModule } from './cart/cart.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    // Config (global)
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env', '../../.env.local', '../../.env'],
      load: [configuration],
    }),

    // Rate limiting
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 60000,
        limit: 100,
      },
      {
        name: 'long',
        ttl: 3600000,
        limit: 1000,
      },
    ]),

    // Database (global)
    DatabaseModule,

    // Redis (global)
    RedisModule,

    // Elasticsearch (global)
    ElasticsearchModule,

    // Feature modules
    AuthModule,
    UsersModule,
    DiamondsModule,
    OrdersModule,
    PaymentsModule,
    CartModule,
    WishlistModule,
    HealthModule,
  ],
})
export class AppModule {}
