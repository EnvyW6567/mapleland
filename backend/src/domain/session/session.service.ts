import { Injectable } from '@nestjs/common';
import { RedisService } from '../../database/redis/redis.service';
import { SessionEntity } from './session.entity';
import { plainToInstance } from 'class-transformer';
import { SessionResDto } from './dto/session.res.dto';
import { AddUserReqDto } from './dto/add-user.req.dto';
import { MoveUserReqDto } from './dto/move-user.req.dto';
import { UserEntity } from '../user/user.entity';

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
            parties: session.getParties,
        });
    }

    async addUser(addUserReqDto: AddUserReqDto) {
        const sessionData = await this.redisService.hget(
            this.SESSION_PREFIX,
            addUserReqDto.sessionId,
        );
        if (!sessionData) throw new Error('Session not found'); //TODO: CustomError

        const session = plainToInstance(SessionEntity, JSON.parse(sessionData));
        const user = plainToInstance(UserEntity, {
            username: addUserReqDto.username,
            className: addUserReqDto.className,
        });
        const parties = session.getParties();

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

        if (!sessionData) throw new Error('Session not found'); //TODO: CustomError

        const session = plainToInstance(SessionEntity, JSON.parse(sessionData));
        console.log(session);
        console.log(JSON.parse(sessionData));

        if (!this.isValidPartyName(moveUserReqDto, session))
            throw new Error('Invalid party name');
        session.moveUser(moveUserReqDto);

        await this.redisService.hset(
            this.SESSION_PREFIX,
            moveUserReqDto.sessionId,
            session,
        );
        await this.redisService.publish(this.SESSION_EVENTS, {
            type: 'USER_MOVED',
            sessionId: moveUserReqDto.sessionId,
            parties: session.getParties(),
        });
    }

    // 🔹 세션에서 사용자 제거
    async removeUserFromSession(sessionId: string, userId: string) {
        const session = await this.redisService.hget(
            this.SESSION_PREFIX,
            sessionId,
        );
        if (!session) throw new Error('Session not found'); //TODO: CustomError

        session.users = session.users.filter((id: string) => id !== userId);

        await this.redisService.hset(this.SESSION_PREFIX, sessionId, session);
        await this.redisService.publish(this.SESSION_EVENTS, {
            type: 'USER_LEFT',
            sessionId,
            userId,
        });
    }

    async subscribeToSessionEvents(callback: (event: any) => void) {
        await this.redisService.subscribe(this.SESSION_EVENTS, callback);
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

    private isValidPartyName(
        moveUserReqDto: MoveUserReqDto,
        session: SessionEntity,
    ) {
        return (
            moveUserReqDto.fromPartyName in session.getParties() &&
            moveUserReqDto.toPartyName in session.getParties()
        );
    }
}
