import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { Parties } from '../type/parties.type';

export class SessionResDto {
    @IsString()
    @IsNotEmpty()
    sessionId: string;

    @IsArray()
    @IsNotEmpty()
    parties: Parties;
}
