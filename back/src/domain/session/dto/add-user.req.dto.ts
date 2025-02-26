import { IsString, IsNotEmpty } from 'class-validator';

export class AddUserReqDto {
    @IsString()
    @IsNotEmpty()
    sessionId: string;

    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    className: string;
}
