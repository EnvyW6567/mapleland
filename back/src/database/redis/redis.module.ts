import { Module, Global } from '@nestjs/common';
import Redis from 'ioredis';
import { redisConfig } from './redis.config';
import { RedisService } from './redis.service';

@Global()
@Module({
    providers: [
        {
            provide: 'REDIS_CLIENT',
            useFactory: () => {
                return new Redis(redisConfig);
            },
        },
        RedisService,
    ],
    exports: ['REDIS_CLIENT', RedisService],
})
export class RedisModule {}
