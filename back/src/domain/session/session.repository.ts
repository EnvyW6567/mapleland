import { Injectable, Inject } from '@nestjs/common';
import Redis from 'ioredis';
import { SessionEntity } from './session.entity';

@Injectable()
export class SessionRepository {
    session = new Map<string, SessionEntity>();

    constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis) {}

    private getRedisKey(sessionId: string): string {
        return `session:${sessionId}`;
    }

    async save(session: SessionEntity): Promise<void> {
        this.session.set(session.getSessionId(), session);

        const redisKey = this.getRedisKey(session.getSessionId());
    }

    async existsById(sessionId: string): Promise<boolean> {
        const redisKey = this.getRedisKey(sessionId);
        const exists = await this.redisClient.exists(redisKey);

        return exists === 1;
    }

    async findById(sessionId: string): Promise<SessionEntity | null> {
        const session = this.session.get(sessionId);

        if (!session) {
            return null;
        }
        return session;
    }

    async deleteById(sessionId: string): Promise<void> {
        const redisKey = this.getRedisKey(sessionId);
        await this.redisClient.del(redisKey);
    }
}
