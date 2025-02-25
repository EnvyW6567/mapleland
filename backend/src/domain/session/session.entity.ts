import { UserEntity } from '../user/user.entity';
import { MoveUserReqDto } from './dto/move-user.req.dto';
import { RemoveUserReqDto } from './dto/remove-user.req.dto';
import { SessionError } from './error/session.error';
import { SessionErrorType } from './error/session.error.type';

export class SessionEntity {
    readonly sessionId: string; // 고유 키
    readonly parties: Record<string, Array<UserEntity>>;

    constructor(sessionId: string) {
        this.sessionId = sessionId;
        this.parties = {
            1: [],
            2: [],
            3: [],
            4: [],
            5: [],
            6: [],
            7: [],
            8: [],
            solo: [],
            observer: [],
        };
    }

    getSessionId(): string {
        return this.sessionId;
    }

    updateParty(party: UserEntity[], partyName: string) {
        this.validatePartyName(partyName);

        this.parties[partyName] = party;
    }

    moveUser(moveUserReqDto: MoveUserReqDto) {
        this.validatePartyName(moveUserReqDto.fromPartyName);
        this.validatePartyName(moveUserReqDto.toPartyName);

        const newParty = this.parties[moveUserReqDto.fromPartyName].filter(
            (user: UserEntity) => user.username !== moveUserReqDto.username,
        );

        this.updateParty(newParty, moveUserReqDto.fromPartyName);
        this.parties[moveUserReqDto.toPartyName].push({
            username: moveUserReqDto.username,
            className: moveUserReqDto.className,
        });
    }

    removeUser(removeUserReqDto: RemoveUserReqDto) {
        this.validatePartyName(removeUserReqDto.partyName);

        const newParty = this.parties[removeUserReqDto.partyName].filter(
            (user: UserEntity) => user.username !== removeUserReqDto.username,
        );

        this.updateParty(newParty, removeUserReqDto.partyName);
    }

    validatePartyName(partyName: string) {
        if (partyName in this.parties) {
            return;
        }
        throw new SessionError(SessionErrorType.INVALID_PARTY_NAME);
    }
}
