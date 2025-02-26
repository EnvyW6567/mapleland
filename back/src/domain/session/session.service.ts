import { Injectable } from '@nestjs/common';
import { RedisService } from '../../database/redis/redis.service';
import { SessionEntity } from './session.entity';
import { plainToInstance } from 'class-transformer';
import { SessionResDto } from './dto/session.res.dto';
import { AddUserReqDto } from './dto/add-user.req.dto';
import { MoveUserReqDto } from './dto/move-user.req.dto';
import { SessionError } from './error/session.error';
import { SessionErrorType } from './error/session.error.type';
import { RemoveUserReqDto } from './dto/remove-user.req.dto';
import { PartiesResDto } from './dto/parties.res.dto';

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
            sessionId,
            parties: session.parties,
        });
    }

    async getSessionParties(sessionId: string) {
        const session = await this.findSession(sessionId);

        return plainToInstance(PartiesResDto, { parties: session.parties });
    }

    async addUser(addUserReqDto: AddUserReqDto) {
        const session = await this.findSession(addUserReqDto.sessionId);

        session.addUser(addUserReqDto);
        await this.broadcastSession(addUserReqDto.sessionId, session);
    }

    async moveUser(moveUserReqDto: MoveUserReqDto) {
        const session = await this.findSession(moveUserReqDto.sessionId);

        session.moveUser(moveUserReqDto);
        await this.broadcastSession(moveUserReqDto.sessionId, session);
    }

    async removeUser(removeUserReqDto: RemoveUserReqDto) {
        const session = await this.findSession(removeUserReqDto.sessionId);

        session.removeUser(removeUserReqDto);
        await this.broadcastSession(removeUserReqDto.sessionId, session);
    }

    async subscribeToSessionEvents(callback: (event: any) => void) {
        await this.redisService.subscribe(this.SESSION_EVENTS, callback);
    }

    private async findSession(sessionId: string): Promise<SessionEntity> {
        const sessionData = await this.redisService.hget(
            this.SESSION_PREFIX,
            sessionId,
        );
        if (!sessionData)
            throw new SessionError(SessionErrorType.SESSION_NOT_FOUND);

        return plainToInstance(SessionEntity, JSON.parse(sessionData));
    }

    private async broadcastSession(sessionId: string, session: SessionEntity) {
        await this.redisService.hset(
            this.SESSION_PREFIX,
            sessionId,
            JSON.stringify(session),
        );
        await this.redisService.publish(this.SESSION_EVENTS, {
            type: 'UPDATE',
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
