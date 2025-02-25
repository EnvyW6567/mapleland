import { Injectable } from '@nestjs/common';
import { RedisService } from '../../database/redis/redis.service';
import { SessionEntity } from './session.entity';
import { plainToInstance } from 'class-transformer';
import { SessionResDto } from './dto/session.res.dto';
import { AddUserReqDto } from './dto/add-user.req.dto';
import { MoveUserReqDto } from './dto/move-user.req.dto';
import { UserEntity } from '../user/user.entity';
import { SessionError } from './error/session.error';
import { SessionErrorType } from './error/session.error.type';
import { RemoveUserReqDto } from './dto/remove-user.req.dto';

@Injectable()
export class SessionService {
    private readonly SESSION_PREFIX = 'session:';
    private readonly SESSION_EVENTS = 'session-events';

    constructor(private readonly redisService: RedisService) {}

    async createSession() {
        const sessionId = this.createRandomSessionId();
        const session = new SessionEntity(sessionId);

        await this.redisService.hset(
            this.SESSION_PREFIX,
            sessionId,
            JSON.stringify(session),
        );

        return plainToInstance(SessionResDto, {
            sessionId: sessionId,
            parties: session.parties,
        });
    }

    async addUser(addUserReqDto: AddUserReqDto) {
        const sessionData = await this.redisService.hget(
            this.SESSION_PREFIX,
            addUserReqDto.sessionId,
        );
        if (!sessionData)
            throw new SessionError(SessionErrorType.SESSION_NOT_FOUND);

        const session = plainToInstance(SessionEntity, JSON.parse(sessionData));
        const user = plainToInstance(UserEntity, {
            username: addUserReqDto.username,
            className: addUserReqDto.className,
        });
        const parties = session.parties;

        parties['solo'] = parties['solo'] || [];
        parties['solo'].push(user);

        await this.redisService.hset(
            this.SESSION_PREFIX,
            addUserReqDto.sessionId,
            JSON.stringify(session),
        );
        await this.redisService.publish(this.SESSION_EVENTS, {
            type: 'USER_JOINED',
            sessionId: addUserReqDto.sessionId,
            username: addUserReqDto.username,
            className: addUserReqDto.className,
            parties: parties,
        });
    }

    async moveUser(moveUserReqDto: MoveUserReqDto) {
        const sessionData = await this.redisService.hget(
            this.SESSION_PREFIX,
            moveUserReqDto.sessionId,
        );

        if (!sessionData)
            throw new SessionError(SessionErrorType.SESSION_NOT_FOUND);
        const session: SessionEntity = plainToInstance(
            SessionEntity,
            JSON.parse(sessionData),
        );

        session.moveUser(moveUserReqDto);
        await this.broadcastSession(moveUserReqDto.sessionId, session);
    }

    async removeUser(removeUserReqDto: RemoveUserReqDto) {
        const sessionData = await this.redisService.hget(
            this.SESSION_PREFIX,
            removeUserReqDto.sessionId,
        );

        if (!sessionData)
            throw new SessionError(SessionErrorType.SESSION_NOT_FOUND);
        const session: SessionEntity = plainToInstance(
            SessionEntity,
            JSON.parse(sessionData),
        );

        session.removeUser(removeUserReqDto);
        await this.broadcastSession(removeUserReqDto.sessionId, session);
    }

    async subscribeToSessionEvents(callback: (event: any) => void) {
        await this.redisService.subscribe(this.SESSION_EVENTS, callback);
    }

    private async broadcastSession(sessionId: string, session: SessionEntity) {
        await this.redisService.hset(
            this.SESSION_PREFIX,
            sessionId,
            JSON.stringify(session),
        );
        await this.redisService.publish(this.SESSION_EVENTS, {
            type: 'USER_LEFT',
            sessionId,
            parties: session.parties,
        });
    }

    private createRandomSessionId() {
        const characters =
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

        let sessionId = '';
        for (let i = 0; i < 8; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            sessionId += characters[randomIndex];
        }

        return sessionId;
    }
}
