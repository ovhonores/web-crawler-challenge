import { Module } from '@nestjs/common';
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import KeyvRedis from '@keyv/redis';

@Module({
  imports: [
    NestCacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        stores: [
          new KeyvRedis(
            `redis://${config.get('redis.host')}:${config.get('redis.port')}`,
          ),
        ],
        ttl: (config.get<number>('redis.ttl') ?? 0) * 1000,
      }),
      isGlobal: true,
    }),
  ],
})
export class CacheModule {}
