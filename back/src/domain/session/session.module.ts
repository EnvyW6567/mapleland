import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { SessionController } from './session.controller';
import { SessionRepository } from './session.repository';
import { RedisModule } from '../../database/redis/redis.module';

@Module({
    imports: [RedisModule],
    controllers: [SessionController],
    providers: [SessionService, SessionRepository],
})
export class SessionModule {}
