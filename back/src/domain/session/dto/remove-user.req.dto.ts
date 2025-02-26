import { IsNotEmpty, IsString } from 'class-validator';

export class RemoveUserReqDto {
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    partyName: string;

    @IsNotEmpty()
    @IsString()
    sessionId: string;
}
