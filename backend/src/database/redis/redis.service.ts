import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
    private pubClient: Redis; // 메시지 발행용 Redis 클라이언트
    private subClient: Redis; // 메시지 구독용 Redis 클라이언트
    private client: Redis; // 일반 Redis 작업용 클라이언트

    async onModuleInit() {
        this.client = new Redis({ host: 'localhost', port: 6379 });
        this.pubClient = new Redis({ host: 'localhost', port: 6379 });
        this.subClient = new Redis({ host: 'localhost', port: 6379 });

        console.log('🔗 Connected to Redis');

        this.subClient.on('message', (channel, message) => {
            console.log(`📩 Received message from ${channel}:`, message);
        });
    }

    async onModuleDestroy() {
        await this.client.quit();
        await this.pubClient.quit();
        await this.subClient.quit();
    }

    // 일반 Redis 명령 실행
    async set(key: string, value: any) {
        await this.client.set(key, JSON.stringify(value));
    }

    async get(key: string) {
        const data = await this.client.get(key);
        return data ? JSON.parse(data) : null;
    }

    // Redis Hash 사용
    async hset(hash: string, key: string, value: any) {
        await this.client.hset(hash, key, JSON.stringify(value));
    }

    async hget(hash: string, key: string) {
        const data = await this.client.hget(hash, key);
        return data ? JSON.parse(data) : null;
    }

    // 메시지 발행
    async publish(channel: string, message: any) {
        await this.pubClient.publish(channel, JSON.stringify(message));
    }

    // 메시지 구독
    async subscribe(channel: string, callback: (message: any) => void) {
        this.subClient.subscribe(channel);
        this.subClient.on('message', (subChannel, message) => {
            if (subChannel === channel) {
                callback(JSON.parse(message));
            }
        });
    }
}
