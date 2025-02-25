import { UserEntity } from '../user/user.entity';
import { MoveUserReqDto } from './dto/move-user.req.dto';

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
        if (!(partyName in this.parties)) {
            throw new Error('Invalid party name');
        }

        this.parties[partyName] = party;
    }

    moveUser(moveUserReqDto: MoveUserReqDto) {
        const newParty = this.parties[moveUserReqDto.fromPartyName].filter(
            (user: UserEntity) => user.username !== moveUserReqDto.username,
        );

        this.updateParty(newParty, moveUserReqDto.fromPartyName);
        this.parties[moveUserReqDto.toPartyName].push({
            username: moveUserReqDto.username,
            className: moveUserReqDto.className,
        });
    }
}
