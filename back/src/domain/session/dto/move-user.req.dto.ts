import { IsNotEmpty, IsString } from 'class-validator';

export class MoveUserReqDto {
    @IsNotEmpty()
    @IsString()
    username: string;

    @IsNotEmpty()
    @IsString()
    className: string;

    @IsNotEmpty()
    @IsString()
    fromPartyName: string;

    @IsNotEmpty()
    @IsString()
    toPartyName: string;

    @IsNotEmpty()
    @IsString()
    sessionId: string;
}
